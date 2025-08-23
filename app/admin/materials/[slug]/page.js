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
  name: yup.string().required('Material name is required'),
});

export default function AddVendorForm() {
  const { slug } = useParams();
  const router = useRouter();
  const isEditMode = slug !== 'addmaterial';

  const { data, isLoading } = useQuery({
    queryKey: ['material', slug],
    queryFn: async () => {
      const response = await api.get(`/vendor/getmaterialbyid/${slug}`);
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
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (data && isEditMode) {
      reset({
        name: data.name || '',
      });
    }
  }, [data, isEditMode, reset]);

  const mutation = useMutation({
    mutationFn: data =>
      isEditMode
        ? api.put(`/material/updatematerial/${slug}`, data)
        : api.post('/material/creatematerial', data),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? 'Material updated successfully'
          : 'Material added successfully'
      );
      reset();
      router.back();
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Failed to add Material');
    },
  });

  const onSubmit = data => {
    mutation.mutate(data);
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
        <h1>Add Material</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Vendor Name */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Name</label>
            <Input
              {...register('name')}
              placeholder="Enter Material Name"
              className="bg-gray-100"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-secondary text-primary font-semibold rounded-3xl"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </AsideContainer>
  );
}
