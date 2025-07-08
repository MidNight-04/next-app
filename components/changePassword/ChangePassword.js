'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const ChangePasswordForm = ({ onClose }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const { userId } = useAuthStore.getState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: data => api.post('/auth/change-password', { userId, ...data }),
    onSuccess: () => {
      toast('Password changed successfully.');
      onClose();
      reset();
    },
    onError: error => {
      toast(error?.response?.data?.message || 'Failed to change password');
      onClose();
      setSuccessMessage('');
    },
  });

  const onSubmit = data => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md p-4 border bg-white rounded-xl w-2/4 -md:w-3/4"
    >
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <div className="flex flex-col">
        <label className="text-base text-[#565656] font-semibold ml-1 capitalize mb-2">
          Current Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          {...register('currentPassword')}
          className={`p-4 outline-none border rounded-lg bg-[#fafafa] ${
            errors.currentPassword
              ? 'border-red-500'
              : 'focus:border-[#93BFCF] border-gray-300'
          }`}
        />
        <p className="text-red-500 text-sm h-5">
          {errors.currentPassword?.message}
        </p>
      </div>

      <div className="flex flex-col">
        <label className="text-base text-[#565656] font-semibold ml-1 capitalize mb-2">
          New Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          {...register('newPassword')}
          className={`p-4 outline-none border rounded-lg bg-[#fafafa] ${
            errors.newPassword
              ? 'border-red-500'
              : 'focus:border-[#93BFCF] border-gray-300'
          }`}
        />
        <p className="text-red-500 text-sm h-5">
          {errors.newPassword?.message}
        </p>
      </div>

      <div className="flex flex-col">
        <label className="text-base text-[#565656] font-semibold ml-1 capitalize mb-2">
          Confirm New Password
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          {...register('confirmPassword')}
          className={`p-4 outline-none border rounded-lg bg-[#fafafa] ${
            errors.currentPassword
              ? 'border-red-500'
              : 'focus:border-[#93BFCF] border-gray-300'
          }`}
        />
        <p className="text-red-500 text-sm h-5">
          {errors.confirmPassword?.message}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showPasswords}
          onChange={() => setShowPasswords(prev => !prev)}
        />
        <label>Show Passwords</label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-secondary text-primary px-4 py-2 rounded-full float-right"
      >
        {mutation.isPending ? 'Updating...' : 'Change Password'}
      </button>

      {successMessage && (
        <p className="text-green-600 font-medium">{successMessage}</p>
      )}
    </form>
  );
};

export default ChangePasswordForm;
