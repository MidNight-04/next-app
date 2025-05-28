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
import * as yup from "yup";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';

const contractorSchema = yup.object().shape({
  name: yup.string().required("First name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  // password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  // pincode: yup.string().required("Pincode is required"),
  roles: yup.array().of(yup.string()).default(["contractor"]),
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

  const state = watch('state');

  const [
    { data: statesData },
    { data: citiesData },
  ] = useQueries({
    queries: [
      {
        queryKey: ['getStates'],
        queryFn: () =>
          postEndpoint({
            endpoint: 'auth/getStates',
            data: { country: 'India' },
          }),
      },
      {
        queryKey: [`${state}/cities`],
        queryFn: () =>
          postEndpoint({
            endpoint: 'auth/getCities',
            data: { state_name: state },
          }),
        enabled: state !== '',
      },
    ],
  });

  const onSubmit = async (formData) => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_PATH}/api/auth/signup`, formData);
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

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[15px] p-5 mb-5">
          <div className="grid grid-cols-2 gap-4 gap-x-8">
            {[
              ['Name', 'name'],
              ['Username', 'username'],
              ['Email', 'email'],
              ['Phone', 'phone'],
              // ['Password', 'password'],
              // ['Pincode', 'pincode'],
            ].map(([label, name]) => (
              <div key={name} className="flex flex-col gap-2 [&_label]:font-semibold">
                <label>{label}</label>
                <input
                  {...register(name)}
                  placeholder={`Enter ${label}`}
                  type={name === 'password' ? 'password' : 'text'}
                  className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                />
                {errors[name] && (
                  <span className="text-red-500 text-sm">{errors[name]?.message}</span>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>Country</label>
              <Select
                value="India"
                onValueChange={(val) => setValue('country', val)}
              >
                <SelectTrigger className="h-[54px] bg-gray-100 border px-4 border-primary rounded-[7px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <span className="text-red-500 text-sm">{errors.country.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>State</label>
              <Select
                onValueChange={(val) => setValue('state', val)}
              >
                <SelectTrigger className="h-[54px] bg-gray-100 border px-4 border-primary rounded-[7px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {statesData?.states?.map((item, idx) => (
                    <SelectItem key={idx} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <span className="text-red-500 text-sm">{errors.state.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>City</label>
              <Select
                onValueChange={(val) => setValue('city', val)}
              >
                <SelectTrigger className="h-[54px] bg-gray-100 border px-4 border-primary rounded-[7px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {citiesData?.cities?.map((item, idx) => (
                    <SelectItem key={idx} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <span className="text-red-500 text-sm">{errors.city.message}</span>
              )}
            </div>
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