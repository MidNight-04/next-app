"use client";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { postEndpoint } from "../../../helpers/endpoints";
import { useState } from "react";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import { redirect, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const logInSchema = Yup.object({
  username: Yup.string().required("Username is required."),
  password: Yup.string()
    .required("Password is Required.")
    .min(8, "Minimum 8 characters are required."),
});

const style = { color: "red", fontSize: ".75rem", paddingLeft: ".25rem" };

const SigninwithPassword = () => {
  const { slug } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAuth = useAuthStore((state) => state.isAuth);
  const setLogIn = useAuthStore((state) => state.setLogIn);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationKey: ["login", slug],
    mutationFn: (data) =>
      postEndpoint({
        endpoint: `${slug}/signinwithpassword`,
        data,
      }),
    onSuccess: (data) => {
      if (data.message === "You have been logged in") {
        toast("You have logged in successfully!");
        setLogIn({
          username: data.username,
          token: data.token,
          phone: data.phone,
          isAuth: true,
          userId: data.id,
          email: data.email,
          userType: data.roles,
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
    onError: (error) => {
      console.error("Login failed:", error?.response?.data?.message || error.message);
      setShowLoader(false);
      toast("User not found, Please enter a valid username or Password.");
    },
  });

  if (isAuth) {
    redirect("/admin/projects");
  }

  return (
    <>
      {showLoader && <LoaderSpinner />}
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={logInSchema}
        onSubmit={(data) => {
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
              />
              {errors.username && touched.username ? (
                <div style={style}>{errors.username}</div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 relative mt-4">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="p-2 pr-10 border bg-[#f3f4f6] border-primary outline-none rounded-[7px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-11 text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && touched.password ? (
                <div style={style}>{errors.password}</div>
              ) : null}
            </div>

            <div className="flex justify-end mt-6 w-full">
              <button
                className="p-[6px] px-3 bg-secondary rounded-full font-ubuntu text-primary font-semibold"
                type="submit"
              >
                <span>Login</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SigninwithPassword;

