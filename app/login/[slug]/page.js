"use client";
import { Button, Card } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import SigninForm from "../../../components/forms/signinform/SigninForm";
import OtpForm from "../../../components/forms/otpform/OtpForm";
import { useAuthStore } from "../../../store/useAuthStore";
import { redirect } from "next/navigation";
const Header = dynamic(() => import("../../../components/Header"), {
  ssr: false,
});
const Footer = dynamic(() => import("../../../components/Footer"), {
  ssr: false,
});

const style = { color: "red", fontSize: ".75rem", paddingLeft: ".25rem" };

const Page = () => {
  const [showOtp, setShowOtp] = useState(false);
  const type = useAuthStore(state => state.type);
  const isAuth = useAuthStore(state => state.isAuth);

  if (isAuth) {
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
      <div className="bg-gray-100 h-[100vh] p-40 -md:p-8 flex justify-center ">
        <div className="bg-white p-8 w-[40rem] h-[32rem] rounded-3xl shadow-lg">
          <div className="flex flex-col w-full flex-auto">
            <div className="text-primary text-3xl font-semibold mb-12">
              <h1>Log In</h1>
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
