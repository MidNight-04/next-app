"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import SigninForm from "../../../components/forms/signinform/SigninForm";
import OtpForm from "../../../components/forms/otpform/OtpForm";
import { useAuthStore } from "../../../store/useAuthStore";
import { redirect } from "next/navigation";
import Image from "next/image";

const Header = dynamic(() => import("../../../components/Header"), {
  ssr: false,
});
const Footer = dynamic(() => import("../../../components/Footer"), {
  ssr: false,
});

const Page = () => {
  const [showOtp, setShowOtp] = useState(false);
  const type = useAuthStore(state => state.type);
  const isAuth = useAuthStore(state => state.isAuth);
  const hasHydrated = useAuthStore.persist?.hasHydrated();

  if (hasHydrated && isAuth) {
    redirect("/admin/projects");
  }

  let endpoint;
  switch (type) {
    case "client":
      endpoint = "auth-client";
      break;
    case "member":
      endpoint = "auth-member";
      break;
    case "user":
      endpoint = "auth";
      break;
    default:
      endpoint = "auth";
      break;
  }

  const otpHandler = () => {
    setShowOtp(true);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="bg-gray-100 h-screen flex justify-center items-center -md:">
        <div className="bg-white p-8 w-1/4 -xl:w-2/4 -lg:2/3 -md:w-11/12 h-[32rem] rounded-3xl shadow-lg">
          <div className="flex flex-col w-full flex-auto justify-between h-full">
            <h1 className="font-ubuntu text-2xl font-semibold text-center text-primary">
              Welcome to Bldox
            </h1>
            <div className="flex flex-col items-center">
              <div>
                <Image
                  src={"/assets/profile-placeholder.png"}
                  height={100}
                  width={100}
                  alt="placeholder"
                />
              </div>
              <h2 className="font-ubuntu text-lg font-semibold">
                Already a member?
              </h2>
              <h3 className="text-lg">Sign in to your account</h3>
            </div>
            {!showOtp ? <SigninForm showOtp={otpHandler} /> : <OtpForm />}
            {!showOtp && (
              <div className="flex justify-center mt-4">
                Don&#39;t have an account ?
                <span className="text-primary cursor-pointer ml-1">
                  Sign up
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Page;
