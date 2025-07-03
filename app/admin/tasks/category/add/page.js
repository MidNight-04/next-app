'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../../../../lib/api';
import AsideContainer from '../../../../../components/AsideContainer';

const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
});

const AddTaskCategoryForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: formData =>
      api.post(`/category/add`, { data: formData }).then(res => res.data),
    onSuccess: res => {
      if (res.status === 204) {
        toast(res.message || 'No content');
      } else {
        toast.success(res.message || 'Category added successfully');
        reset();
        router.back();
      }
    },
    onError: err => {
      console.error(err);
      toast.error('Failed to add category');
    },
  });

  const onSubmit = formData => {
    mutate(formData);
  };

  return (
    <AsideContainer>
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>Add Category</h1>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-xl [&_label]:font-semibold">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Name</label>
          <div className="flex flex-row w-full gap-4">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Category"
              {...register('name')}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 w-full"
            />

            <button
              type="submit"
              className="bg-secondary text-primary font-semibold rounded-3xl px-4 py-3 flex items-center disabled:opacity-60"
            >
              {isPending || isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}*</p>
          )}
        </form>
      </div>
    </AsideContainer>
  );
};

export default AddTaskCategoryForm;
