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
        toast.success("You have logged in successfully!");
        router.back();
      }
    },
    onError: () => {
      setShowLoader(false);
      toast.error("Invalid OTP");
    },
    // onSettled: () => {
    //   setShowLoader(false);
    //   router.back();
    // },
  });
  const loginMutation = useMutation({
    mutationKey: ["login", slug],
    mutationFn: postEndpoint({
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
            <div className="[&_input]:focus-visible:border-blue-500">
              <div className="mt-4">
                <label htmlFor="otp">OTP</label>
                <Field
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  style={{
                    padding: ".5rem",
                    width: "100%",
                    border: "1px solid #e5e5e5",
                    borderRadius: "6px",
                  }}
                />
                {errors.otp && touched.otp ? (
                  <div style={style}>{errors.otp}</div>
                ) : null}
              </div>
            </div>
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "100%", marginTop: "1rem" }}
            >
              login
            </Button>
            <div
              onClick={() => {
                setShowLoader(true);
                loginMutation.mutate();
              }}
            >
              Resend OTP!
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default OtpForm;
