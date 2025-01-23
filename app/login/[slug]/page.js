"use client";
import { Button, Card } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import SigninForm from "../../../components/forms/signinform/SigninForm";
import OtpForm from "../../../components/forms/otpform/OtpForm";
import { useAuthStore } from "../../../store/useAuthStore";
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
      <Header />
      <div className="bg-gray-100 h-[100vh] p-40 -md:p-8 flex justify-center">
        <Card className="bg-white p-8 w-[40rem] h-[32rem]">
          <div className="flex flex-col w-full flex-auto">
            <div className="text-blue-500 text-3xl font-semibold mb-12">
              <h1>Log In</h1>
            </div>
            {!showOtp ? <SigninForm showOtp={otpHandler} /> : <OtpForm />}
            <div>
              <div>
                <div className="flex justify-center mt-4">
                  Don&#39;t have an account?
                  <span className="text-blue-500 cursor-pointer">Sign up</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default Page;
