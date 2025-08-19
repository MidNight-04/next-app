'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';

const schema = yup.object().shape({
  name: yup.string().required('Vendor name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
  gstNumber: yup.string().required('GST number is required'),
});

export default function AddVendorForm() {
  const router = useRouter();
  const { slug } = useParams();
  const isEditMode = slug !== 'addvendor';

  const { data, isLoading } = useQuery({
    queryKey: ['vendor', slug],
    queryFn: async () => {
      const response = await api.get(`/vendor/getvendorbyid/${slug}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
    },
  });

  useEffect(() => {
    if (data && isEditMode) {
      reset({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        gstNumber: data.gstNumber || '',
      });
    }
  }, [data, isEditMode, reset]);

  const mutation = useMutation({
    mutationFn: formData =>
      isEditMode
        ? api.put(`/vendor/updatevendor/${slug}`, formData)
        : api.post('/vendor/createvendor', formData),
    onSuccess: () => {
      toast.success(
        isEditMode ? 'Vendor updated successfully' : 'Vendor added successfully'
      );
      router.back();
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = formData => {
    mutation.mutate(formData);
  };

  return (
    <AsideContainer>
      {/* Header */}
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 bg-black"
        />
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>{!isEditMode ? 'Add Vendor' : 'Edit Vendor'}</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {isEditMode && isLoading ? (
          <p>Loading vendor details...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Name */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Name</label>
                <Input
                  {...register('name')}
                  placeholder="Enter Vendor Name"
                  className="bg-gray-100"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Phone</label>
                <Input
                  {...register('phone')}
                  placeholder="Enter Phone Number"
                  className="bg-gray-100"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Email</label>
                <Input
                  {...register('email')}
                  placeholder="Enter Email"
                  className="bg-gray-100"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Address</label>
                <Input
                  {...register('address')}
                  placeholder="Enter Address"
                  className="bg-gray-100"
                />
                {errors.address && (
                  <span className="text-red-500 text-sm">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* GST */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">GST Number</label>
                <Input
                  {...register('gstNumber')}
                  placeholder="Enter GST Number"
                  className="bg-gray-100"
                />
                {errors.gstNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.gstNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-secondary text-primary font-semibold rounded-3xl hover:bg-primary hover:text-secondary transition duration-300"
              >
                {mutation.isPending
                  ? isEditMode
                    ? 'Updating...'
                    : 'Submitting...'
                  : 'Submit'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AsideContainer>
  );
}
