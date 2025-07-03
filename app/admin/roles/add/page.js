'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import { IoIosArrowBack } from 'react-icons/io';

const schema = yup.object({
  role: yup.string().trim().required('Role is mandatory'),
});

const AddRoleForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async data => {
      return api.post('/role/add', { name: data.role });
    },
    onSuccess: res => {
      toast.success(res?.data?.message || 'Role added successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      reset();
      router.push('/admin/roles');
    },
    onError: () => {
      toast.error('Failed to add role');
    },
  });

  const onSubmit = async data => {
    await mutateAsync(data);
  };

  return (
    <AsideContainer>
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>Add Role</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl [&_label]:font-semibold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <label htmlFor="role">Name</label>
          <div className="flex flex-row w-full gap-4">
            <input
              {...register('role')}
              id="role"
              name="role"
              type="text"
              placeholder="Enter Role"
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 w-full"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary text-primary font-semibold rounded-3xl px-4 py-3 flex items-center disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm font-medium">
              {errors.role.message}
            </p>
          )}
        </form>
      </div>
    </AsideContainer>
  );
};

export default AddRoleForm;
