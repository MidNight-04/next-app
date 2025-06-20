'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { useQueries } from '@tanstack/react-query';
import { postEndpoint } from '../../../../../helpers/endpoints';
import AsideContainer from '../../../../../components/AsideContainer';
import axios from 'axios';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];

const contractorSchema = yup.object().shape({
  name: yup.string().required('First name is required'),
  designation: yup.string().required('Designation is required'),
  companyName: yup.string().required('Company Name is required'),
  Address: yup.string().required('Address is required'),
  upiId: yup.string().required('UPI ID is required'),
  phone: yup.number().min(8).required('Business Contact Number is required'),
  radius: yup.number().required('Delivery radius is required'),
  merchantType: yup.string().required('Merchant Type is required'),
  gst: yup
    .mixed()
    .required('Gst is required')
    .test('fileType', 'Unsupported file format', value => {
      return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
    }),
  bankDetails: yup
    .mixed()
    .required('Bank Details is required')
    .test('fileType', 'Unsupported file format', value => {
      return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
    }),
  pan: yup
    .mixed()
    .required('Pan is required')
    .test('fileType', 'Unsupported file format', value => {
      return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
    }),
  Aadhar: yup
    .mixed()
    .required('Aadhar is required')
    .test('fileType', 'Unsupported file format', value => {
      return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
    }),
});

const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contractorSchema),
    defaultValues: {
      country: 'India',
      roles: ['contractor'],
    },
  });

  const onSubmit = async formData => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_PATH}/api/auth/signup`,
        formData
      );
      toast.success('Contractor added successfully!');
      // router.push('/contractors');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row items-center my-4">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Add Contractor
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[15px] p-5 mb-5"
        >
          <div className="grid grid-cols-2 gap-4 gap-x-8">
            {[
              ['Name', 'name'],
              ['Designation', 'designation'],
              ['Company Name', 'companyName'],
              ['Address', 'Address'],
              ['UPI ID', 'upiId'],
              ['Business Contact Number', 'phone'],
            ].map(([label, name]) => (
              <div
                key={name}
                className="flex flex-col gap-2 [&_label]:font-semibold"
              >
                <label>{label}</label>
                <input
                  {...register(name)}
                  placeholder={`Enter ${label}`}
                  type={name === 'password' ? 'password' : 'text'}
                  className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                />
                {errors[name] && (
                  <span className="text-red-500 text-sm">
                    {errors[name]?.message}
                  </span>
                )}
              </div>
            ))}

            <div>
              <label>Date of Company Formation</label>
            </div>
          </div>

          <div>
            <input type="file" accept="image/*" {...register('gst')} />
            {errors.gst && <p>{errors.gst.message}</p>}
          </div>
          <div>
            <input type="file" accept="image/*" {...register('bankDetails')} />
            {errors.bankDetails && <p>{errors.bankDetails.message}</p>}
          </div>
          <div>
            <input type="file" accept="image/*" {...register('pan')} />
            {errors.pan && <p>{errors.pan.message}</p>}
          </div>
          <div>
            <input type="file" accept="image/*" {...register('Aadhar')} />
            {errors.Aadhar && <p>{errors.Aadhar.message}</p>}
          </div>

          <div className="flex flex-row justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </AsideContainer>
  );
};

export default Page;
