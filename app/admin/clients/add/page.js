'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsideContainer from '../../../../components/AsideContainer';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
});

const AddClientForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async data => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_PATH}/api/client/add`,
        { data }
      );

      if (response.data.status === 201) {
        toast(response.data.message);
        reset();
        router.push('/admin/clients');
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast('Something went wrong.');
    }
  };

  return (
    <AsideContainer>
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 bg-black"
        />
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
          Add Client
        </h1>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 -md:grid-cols-1 mb-4"
        >
          {[
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              placeholder: 'Enter Name',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter Email',
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'number',
              placeholder: 'Enter Phone',
            },
            {
              name: 'address',
              label: 'Address',
              type: 'text',
              placeholder: 'Enter Address',
            },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-3">
              <label
                htmlFor={field.name}
                className="text-lg font-semibold text-secondary"
              >
                {field.label}
              </label>
              <input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
                className="outline-none border border-[#efefef] rounded-[7px] p-3 bg-[#fafafa]"
              />
              {errors[field.name] && (
                <span className="text-red-500 text-sm -mt-2">
                  {errors[field.name]?.message}
                </span>
              )}
            </div>
          ))}

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-secondary text-primary rounded-3xl px-4 py-3 inline-block font-semibold transition-opacity ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </AsideContainer>
  );
};

export default AddClientForm;
