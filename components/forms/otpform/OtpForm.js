"use client";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Button } from "@mui/material";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { postEndpoint } from "../../../helpers/endpoints";
import { useParams, useRouter } from "next/navigation";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import { useState } from "react";
import { toast } from "react-toastify";

const otpSchema = Yup.object({
  username: Yup.string(),
  otp: Yup.number()
    .required("OTP is required.")
    .min(6, "Please enter a valid 6 digit OTP."),
});
const style = { color: "red", fontSize: ".75rem", paddingLeft: ".25rem" };

const OtpForm = () => {
  const [showLoader, setShowLoader] = useState(false);
  const { slug } = useParams();
  const username = useAuthStore(state => state.username);
  const setLogIn = useAuthStore(state => state.setLogIn);
  const router = useRouter();
  const otpMutation = useMutation({
    mutationFn: data =>
      postEndpoint({
        endpoint: `${slug}/signin`,
        data,
      }),
    onSuccess: data => {
      if (data.message === "You have been logged in") {
        toast.success("You have logged in successfully!");
        setLogIn({
          username: data.username,
          token: data?.token,
          isAuth: true,
          userId: data.id,
          email: data.email,
          userType: data.roles,
          token: data.token,
        });
        setShowLoader(false);
        setTimeout(() => {
          if (data.roles[0] === "ROLE_USER") {
            router.back();
          } else {
            router.push("/admin/projects");
          }
        }, 1000);
      }
    },
    onError: () => {
      setShowLoader(false);
      toast.error("Please enter a valid OTP.");
    },
    // onSettled: () => {
    //   setShowLoader(false);
    //   router.back();
    // },
  });

  const loginMutation = useMutation({
    mutationKey: ["login", slug],
    mutationFn: () =>
      postEndpoint({
        endpoint: `${slug}/signin-otp`,
        data: { username },
      }),
    onSuccess: data => {
      if (data.status === 200) {
        setShowLoader(false);
        toast.success("OTP sent to you registered mobile number.");
      }
    },
    onError: data => {
      if (data.status !== 200) {
        setShowLoader(false);
        toast.success("Something went Wrong please try again later.");
      }
    },
  });

  return (
    <>
      {showLoader && <LoaderSpinner />}
      <Formik
        initialValues={{
          username,
          otp: "",
        }}
        validationSchema={otpSchema}
        onSubmit={data => {
          setShowLoader(true);
          otpMutation.mutate({ ...data });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="otp">
                  OTP
                </label>
                <Field
                  className="p-2 border bg-[#f3f4f6] border-primary outline-none rounded-[7px]"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                />
                {errors.otp && touched.otp ? (
                  <div style={style}>{errors.otp}</div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="p-[6px] px-4 bg-secondary rounded-full font-ubuntu text-primary font-semibold"
                type="submit"
              >
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="text-center">
        Didn&apos;t received OTP ?{"  "}
        <span
          className="text-primary hover:underline cursor-pointer"
          onClick={() => {
            setShowLoader(true);
            loginMutation.mutate();
          }}
        >
          Resend
        </span>
      </div>
    </>
  );
};

export default OtpForm;
