"use client";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Button } from "@mui/material";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { postEndpoint } from "../../../helpers/endpoints";
import { useState } from "react";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import { useParams } from "next/navigation";

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
    },
  });

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
            <div className="[&_input]:focus-visible:border-blue-500">
              <label htmlFor="username">Username</label>
              <Field
                className="[&_input]:focus-visible:border-blue-500"
                id="username"
                name="username"
                placeholder="Enter Username"
                style={{
                  padding: ".5rem",
                  width: "100%",
                  border: "1px solid #e5e5e5",
                  borderRadius: "6px",
                }}
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
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "100%", marginTop: "1rem" }}
            >
              Get OTP
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SigninForm;
