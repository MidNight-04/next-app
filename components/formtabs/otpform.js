'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoaderSpinner from '../loader/LoaderSpinner';
import axios from 'axios';

const getSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  otp: Yup.string().when('$otpVisible', {
    is: true,
    then: schema =>
      schema.required('OTP is required').length(6, 'Must be 6 digits'),
    otherwise: schema => schema.notRequired(),
  }),
});

const OtpForm = ({ inputRef }) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const otpInputRef = useRef(null);

  const setLogIn = useAuthStore(state => state.setLogIn);
  const setUsername = useAuthStore(state => state.setUsername);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema, { context: { otpVisible } }),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { username: '', otp: '' },
  });

  const username = watch('username');
  const otp = watch('otp');

  const handleSendOtp = async () => {
    const valid = await trigger('username');
    if (!valid || !canResend) return;

    setShowLoader(true);
    try {
      const { data } = await axios.post(
        `${process.env.BACKEND_BASE_URL}/api/auth/signin-otp`,
        { username }
      );

      if (data.status === 200) {
        setUsername(username);
        setOtpVisible(true);
        setResendCount(prev => prev + 1);
        setCanResend(false);
        setTimeout(() => setCanResend(true), 30000); // 30 sec cooldown
        toast.success('OTP sent successfully');
      } else {
        toast.error(data?.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Server error while sending OTP');
    } finally {
      setShowLoader(false);
    }
  };

  const onSubmit = async ({ username, otp }) => {
    setShowLoader(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        otp,
      });

      if (result?.error) {
        toast.error('Invalid OTP');
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

        toast.success('Logged in successfully');
        router.refresh();
        router.push('/admin/projects');
      } else {
        toast.error('Session not found');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (otpVisible && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpVisible]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showLoader && <LoaderSpinner />}

      {!otpVisible && (
        <>
          <label className="block mb-2 font-medium font-ubuntu">Mobile No.</label>
          <input
            {...register('username')}
            placeholder="Enter Mobile No."
            className={`p-2 w-full border rounded ${
              errors.username
                ? 'border-red-500'
                : username
                ? 'border-green-500'
                : 'border-gray-300'
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canResend}
            className={`mt-4 bg-secondary text-primary  w-full py-2 rounded-full ${
              canResend ? 'bg-secondary' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Send OTP' : 'Wait to resend'}
          </button>
        </>
      )}

      {otpVisible && (
        <>
          <label className="block mb-2 font-medium font-ubuntu">OTP</label>
          <input
            {...register('otp')}
            placeholder="Enter 6-digit OTP"
            ref={e => {
              otpInputRef.current = e;
              if (e) {
                register('otp').ref(e);
                if (inputRef?.current !== undefined) {
                  inputRef.current = e;
                }
              }
            }}
            className={`p-2 w-full border rounded ${
              errors.otp
                ? 'border-red-500'
                : otp
                ? 'border-green-500'
                : 'border-gray-300'
            }`}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}

          <button
            type="submit"
            className="mt-4 bg-secondary text-primary  w-full py-2 rounded-full"
          >
            Login
          </button>
        </>
      )}
    </form>
  );
};

export default OtpForm;
