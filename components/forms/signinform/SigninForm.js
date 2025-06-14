"use client";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Button } from "@mui/material";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { postEndpoint } from "../../../helpers/endpoints";
import { useState } from "react";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";

const logInSchema = Yup.object({
  username: Yup.string().required("Username is required."),
  // password: Yup.string()
  //   .min("Minimum 8 characters are required.")
  //   .required("Password is Required."),
});

const style = { color: "red", fontSize: ".75rem", paddingLeft: ".25rem" };

const SigninForm = ({ showOtp }) => {
  const { slug } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const isAuth = useAuthStore(state => state.isAuth);
  const setUsername = useAuthStore(state => state.setUsername);

  const loginMutation = useMutation({
    mutationKey: ["login", slug],
    mutationFn: data =>
      postEndpoint({
        endpoint: `${slug}/signin-otp`,
        data,
      }),
    onSuccess: data => {
      setUsername(data.username);
      setShowLoader(false);
      showOtp();
      toast("OTP sent to you registered mobile number.");
    },
    onError: error => {
      setShowLoader(false);
      toast("User not found, Please enter a valid username.");
    },
  });

  // if (isAuth) {
  //   redirect("/admin/projects");
  // }

  return (
    <>
      {showLoader && <LoaderSpinner />}
      <Formik
        initialValues={{
          username: "",
        }}
        validationSchema={logInSchema}
        onSubmit={data => {
          setShowLoader(true);
          loginMutation.mutate({ ...data });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="font-semibold">
                Email or Phone
              </label>
              <Field
                className="p-2 border bg-[#f3f4f6] border-primary outline-none rounded-[7px]"
                id="username"
                name="username"
                placeholder="Enter Email or Phone"
                // style={{
                //   padding: ".5rem",
                //   width: "100%",
                //   border: "1px solid #e5e5e5",
                //   borderRadius: "6px",
                // }}
              />
              {errors.username && touched.username ? (
                <div style={style}>{errors.username}</div>
              ) : null}
            </div>
            {/* <div className="mt-4">
                          <label htmlFor="password">password</label>
                          <Field
                          id="password"
                          name="password"
                          placeholder="Enter password"
                          style={{
                              padding: ".5rem",
                              width: "100%",
                              border: "1px solid #e5e5e5",
                              borderRadius: "6px",
                              }}
                              />
                              {errors.password && touched.password ? (
                                <div style={style}>{errors.password}</div>
                                ) : null}
                                </div> */}
            <div className="flex justify-end mt-4 w-full">
              <button
                className="p-[6px] px-3 bg-secondary rounded-full font-ubuntu text-primary font-semibold"
                type="submit"
              >
                Get OTP
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SigninForm;
