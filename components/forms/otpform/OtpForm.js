'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { signIn, getSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../../lib/api';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';

const schema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required.')
    .length(6, 'Enter a valid 6-digit OTP.'),
});

const OtpForm = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [timer, setTimer] = useState(0);

  const username = useAuthStore(state => state.username);
  const setLogIn = useAuthStore(state => state.setLogIn);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { otp: '' },
  });

  const resendOtpMutation = useMutation({
    mutationKey: ['resend-otp', slug],
    mutationFn: async () => {
      const response = await api.post(`/${slug}/signin-otp`, { username });
      return response.data;
    },
    onSuccess: data => {
      setShowLoader(false);
      setTimer(60);
      if (data.status === 200) {
        toast.success('OTP resent successfully.');
      } else {
        toast.error('Failed to resend OTP.');
      }
    },
    onError: () => {
      setShowLoader(false);
      toast.error('Error resending OTP.');
    },
  });

  const onSubmit = async ({ otp }) => {
    setShowLoader(true);

    const result = await signIn('credentials', {
      redirect: false,
      username,
      otp,
    });

    if (result?.error) {
      toast.error('Invalid OTP or login failed.');
      setShowLoader(false);
      return;
    }

    const session = await getSession();

    if (session?.user?.accessToken) {
      const user = session.user;

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

      toast.success('Login successful!');
      router.refresh();
      router.push('/admin/projects');
    } else {
      toast.error('Login succeeded, but session is invalid.');
    }

    setShowLoader(false);
  };

  // Countdown for resend OTP
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {showLoader && <LoaderSpinner />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="hidden" value={username} readOnly />

        <div>
          <label className="font-semibold" htmlFor="otp">
            OTP
          </label>
          <input
            id="otp"
            {...register('otp')}
            placeholder="Enter OTP"
            className="p-2 border bg-[#f3f4f6] border-primary outline-none rounded-[7px] w-full"
          />
          {errors.otp && (
            <div className="text-red-600 text-sm mt-1">
              {errors.otp.message}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="p-[6px] px-4 bg-secondary rounded-full font-ubuntu text-primary font-semibold"
            disabled={showLoader}
          >
            Login
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        Didn&apos;t receive OTP?{' '}
        <span
          className={`text-primary hover:underline cursor-pointer ${
            resendOtpMutation.isLoading || timer > 0
              ? 'opacity-50 pointer-events-none'
              : ''
          }`}
          onClick={() => {
            setShowLoader(true);
            resendOtpMutation.mutate();
          }}
        >
          {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
        </span>
      </div>
    </>
  );
};

export default OtpForm;
