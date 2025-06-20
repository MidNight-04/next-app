'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AsideContainer from '../../../../components/AsideContainer';
import { toast } from 'sonner';
import { IoIosArrowBack } from 'react-icons/io';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required*'),
  employeeID: Yup.string().required('Employee ID is required*'),
  role: Yup.string().required('Role is required*'),
  email: Yup.string().email('Invalid email').required('Email is required*'),
  phone: Yup.string().required('Phone is required*'),
  address: Yup.string().required('Address is required*'),
});

const AddMemberForm = () => {
  const router = useRouter();
  const [roleList, setRoleList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      employeeID: '',
      role: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/projectrole/getall`)
      .then(res => {
        if (res) setRoleList(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);

  const onSubmit = formData => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/teammember/add`, {
        data: formData,
      })
      .then(response => {
        if (response) {
          toast(response.data.message, { position: 'top-right' });
          reset();
          router.back();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <AsideContainer>
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>Add Employee</h1>
      </div>
      <div className="bg-white rounded-3xl p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-4 [&_label]:font-semibold"
        >
          <div className="flex flex-col">
            <label>Name</label>
            <input
              {...register('name')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              placeholder="Enter Name"
            />
            {errors.name ? (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <label>Employee ID</label>
            <input
              {...register('employeeID')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              placeholder="Enter Employee ID"
            />
            {errors.employeeID ? (
              <span className="text-red-500 text-sm">
                {errors.employeeID.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <label>Role</label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-12 font-medium rounded-[7px] bg-gray-100 border border-primary px-4 data-[placeholder]:text-gray-400 data-[placeholder]:font-normal data-[state=checked]:font-medium">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleList.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item._id}
                        className="data-[state=checked]:font-medium data-[state=checked]:text-primary"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role ? (
              <span className="text-red-500 text-sm">
                {errors.role.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <label>Email</label>
            <input
              {...register('email')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              type="email"
              placeholder="Enter Email"
            />
            {errors.email ? (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>

          <div className="flex flex-col">
            <label>Phone</label>
            <input
              {...register('phone')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              placeholder="Enter Phone"
            />
            {errors.phone ? (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>

          <div className="flex flex-col">
            <label>Address</label>
            <input
              {...register('address')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              placeholder="Enter Address"
            />
            {errors.address ? (
              <span className="text-red-500 text-sm">
                {errors.address.message}
              </span>
            ) : (
              <span className="h-5" />
            )}
          </div>

          <div className="col-span-2 flex justify-end items-center mt-4">
            <button
              type="submit"
              className="bg-secondary text-primary font-semibold rounded-3xl px-4 py-3 flex flex-row items-center"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </AsideContainer>
  );
};

export default AddMemberForm;
