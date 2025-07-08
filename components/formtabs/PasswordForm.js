'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import LoaderSpinner from '../loader/LoaderSpinner';
import { Eye, EyeOff } from 'lucide-react';

const schema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6).required('Password is required'),
});

const PasswordForm = ({ inputRef }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setLogIn = useAuthStore(state => state.setLogIn);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async ({ username, password }) => {
    setShowLoader(true);
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      toast.error('Invalid username or password');
      setShowLoader(false);
      return;
    }

    const session = await getSession();
    const user = session?.user;

    if (user?.accessToken) {
      setLogIn({
        token: user.accessToken,
        tokenSetAt: Date.now(),
        userId: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
        userType: user.userType ?? null,
        employeeId: user.employeeId ?? null,
        username: user.username ?? null,
      });

      toast.success('Logged in');
      router.refresh();
      router.push('/admin/projects');
    } else {
      toast.error('Session not found');
    }

    setShowLoader(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showLoader && <LoaderSpinner />}

      <label className="block mb-2 font-medium font-ubuntu">Email</label>
      <input
        {...register('username')}
        placeholder="Enter Email"
        ref={e => {
          if (e) {
            register('username').ref(e);
            if (
              inputRef &&
              typeof inputRef === 'object' &&
              'current' in inputRef
            ) {
              inputRef.current = e;
            }
          }
        }}
        className={`p-2 w-full border rounded outline-none ${
          errors.username ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.username && (
        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
      )}

      <label className="block mt-4 mb-2">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          placeholder="Enter Password"
          className={`p-2 w-full border rounded pr-10 outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}

      <button
        type="submit"
        className="mt-4 bg-secondary text-primary w-full py-2 rounded-full"
      >
        Login
      </button>
    </form>
  );
};

export default PasswordForm;
