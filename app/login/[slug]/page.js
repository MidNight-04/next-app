'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import SigninForm from '../../../components/forms/signinform/SigninForm';
import OtpForm from '../../../components/forms/otpform/OtpForm';
import { useAuthStore } from '../../../store/useAuthStore';
import { redirect } from 'next/navigation';
import { PiCopyrightThin } from 'react-icons/pi';
import Image from 'next/image';
import SigninwithPassword from '../../../components/forms/signinwtihpassword/signinwithpassword';

// const Header = dynamic(() => import("../../../components/Header"), {
//   ssr: false,
// });
// const Footer = dynamic(() => import("../../../components/Footer"), {
//   ssr: false,
// });

const Page = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const type = useAuthStore(state => state.type);
  const isAuth = useAuthStore(state => state.isAuth);
  const hasHydrated = useAuthStore.persist?.hasHydrated();

  if (hasHydrated && isAuth) {
    redirect('/admin/projects');
  }

  let endpoint;
  switch (type) {
    case 'client':
      endpoint = 'auth-client';
      break;
    case 'member':
      endpoint = 'auth-member';
      break;
    case 'user':
      endpoint = 'auth';
      break;
    default:
      endpoint = 'auth';
      break;
  }

  const otpHandler = () => {
    setShowOtp(true);
  };

  return (
    <>
      {/* <Header /> */}
      <div
        className="h-screen flex justify-center items-center"
        style={{
          backgroundImage: `url('/bg-white.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span className="absolute top-5 left-5 -md:hidden">
          <Image
            src={'/full_logo_blue1.png'}
            height={60}
            width={120}
            alt="logo"
          />
        </span>
        <div className="bg-white p-8 lg:w-1/4 -xl:w-2/4 -lg:1/3 -md:w-11/12 h-auto rounded-3xl shadow-lg dark:bg-gray-800 dark:text-gray-100">
          <div className="flex flex-col w-full flex-auto justify-between h-full gap-4">
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src={'/full_logo_blue1.png'}
                height={100}
                width={300}
                alt="icon"
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>
                <Image
                  src={'/assets/profile-placeholder.png'}
                  height={100}
                  width={100}
                  alt="placeholder"
                />
              </div>
              <div className="text-center">
                <p className="font-ubuntu text-lg font-semibold">
                  Already a member?
                </p>
                <p className="text-lg">Sign in to your account</p>
              </div>
            </div>
            {!showOtp && !showPassword && <SigninForm showOtp={otpHandler} />}
            {showOtp && !showPassword && <OtpForm />}
            {showPassword && <SigninwithPassword />}
            <div className="flex flex-col gap-4 justify-center items-left text-center">
              <span
                className="text-sm text-gray-500 hover:text-primary cursor-pointer hover:underline underline-offset-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? 'Sign in with OTP'
                  : 'Sign in with your Email and Password'}
              </span>
              <span className="text-gray-500 text-sm">
                <PiCopyrightThin size={12} className="inline" /> 2025 Bldox |
                All rights reserved
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Page;
