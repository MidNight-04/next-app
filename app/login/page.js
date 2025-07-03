import Image from 'next/image';
import { PiCopyrightThin } from 'react-icons/pi';
import LoginFormTabs from '../../components/formtabs/FormTabs';

export default function LoginClientPage() {
  return (
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
      <div className="bg-white p-8 lg:w-1/5 -xl:w-1/4 -lg:1/4 -md:w-1/2 h-auto min-w-96 rounded-3xl shadow-lg dark:bg-gray-800 dark:text-gray-100">
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
          <LoginFormTabs />
          <span className="text-gray-500 text-sm flex text-center items-center justify-center">
            <PiCopyrightThin size={12} className="inline" /> 2025 Bldox | All
            rights reserved
          </span>
        </div>
      </div>
    </div>
  );
}
