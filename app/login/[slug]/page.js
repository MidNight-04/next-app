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

// import React, { useState, useEffect } from "react";
// import imageUrl from "../../public/assets/WEB3.png";
// // import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
// // import { changeUserRole, changeUser } from "../../redux/actions/userAction";
// // import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { useMutation } from "@tanstack/react-query";
// import { postEndpoint } from "../../helpers/endpoints";
// import { Passero_One } from "next/font/google";

// import { useRouter } from "next/router";
// import { redirect, usePathname } from "next/navigation";
// ("toast.configure()");

// const Login = () => {
//   const path = usePathname();
//   const router = useRouter();
//   const setLogIn = useAuthStore(state => state.setLogin);
//   // const dispatch = useDispatch();
//   // const { userRole } = useSelector(store => store.userReducer);

//   const [signData, setSignData] = useState({
//     username: "",
//     // password: "",
//   });
//   const [username, setUsername] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpPage, setOtpPage] = useState(false);

//   const getLoginData = e => {
//     const { name, value } = e.target;
//     setSignData({ ...signData, [name]: value });
//   };

//   const signinOtp = () => {
//     // console.log(location);
//     if (!signData.username) {
//       toast.error("Provide Email/Phone", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     } else {
//       if (location?.state?.onboardingRole === "client") {
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth-client/signin-otp`,
//           data: signData,
//         };
//         axios(config)
//           .then(async function (response) {
//             setOtpPage(true);
//             if (response.data.otp) {
//               console.log(response.data);
//               setUsername(response.data.username);
//             }
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("Client does not Exist", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       } else if (location?.state?.onboardingRole === "member") {
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth-member/signin-otp`,
//           data: signData,
//         };
//         axios(config)
//           .then(async function (response) {
//             setOtpPage(true);
//             if (response.data.otp) {
//               console.log(response.data.otp, response.data.username);
//               setUsername(response.data.username);
//             }
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("Employee does not Exist", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       } else {
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth/signin-otp`,
//           data: signData,
//         };
//         axios(config)
//           .then(async function (response) {
//             setOtpPage(true);
//             if (response.data.otp) {
//               console.log(response.data.otp, response.data.username);
//               setUsername(response.data.username);
//             }
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("User does not Exist", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       }
//     }
//   };

//   const handleLoginData = () => {
//     if (!otp) {
//       toast.error("Provide OTP", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     } else {
//       // console.log(location?.state?.onboardingRole)
//       if (
//         location?.state?.onboardingRole === "user" ||
//         location?.state?.onboardingRole === undefined
//       ) {
//         const data = { otp: otp, username: username };
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth/signin`,
//           data: data,
//         };
//         // console.log(config);
//         axios(config)
//           .then(async function (response) {
//             // console.log(response);
//             setLogIn({
//               username: response.data.username,
//               userType: response.data.roles[0],
//               token: response.data.token,
//               userId: response.data.id,
//               username: response.data.username,
//             });
//             // localStorage.setItem("role", response.data.roles[0]);
//             // localStorage.setItem("token", response.data.token);
//             // localStorage.setItem("activeUser", response.data.id);
//             // localStorage.setItem("userName", response.data.username);
//             // dispatch(changeUserRole(response.data.roles[0]));
//             // dispatch(changeUser(response.data));
//             toast.success(response.data.message, {
//               position: "top-right",
//             });
//             setOtp("");
//             if (response.data.roles[0] === "ROLE_ADMIN") {
//               redirect("/admin/profile");
//             }
//             if (response.data.roles[0] === "ROLE_USER") {
//               redirect("/homepage");
//             }
//             // navigate(
//             //   response.data.roles[0] === "ROLE_ADMIN"
//             //     ? "/admin"
//             //     : response.data.roles[0] === "ROLE_USER"
//             //     ? "/"
//             //     : localStorage.getItem("last_url")
//             //     ? localStorage.getItem("last_url")
//             //     : `/${response.data.roles[0]
//             //         .substring(5)
//             //         .toLowerCase()}/profile`
//             // );
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("Enter valid OTP", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       } else if (location?.state?.onboardingRole === "member") {
//         const data = { otp: otp, username: username };
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth-member/signin`,
//           data: data,
//         };

//         axios(config)
//           .then(async function (response) {
//             // console.log(response.data);
//             setLogIn({
//               userType: response.data.roles[0],
//               token: response.data.token,
//               userId: response.data.id,
//               employeeId: response.data.employeeID,
//               username: response.data.username,
//             });
//             // localStorage.setItem("role", response.data.roles);
//             // localStorage.setItem("token", response.data.token);
//             // localStorage.setItem("activeUser", response.data.id);
//             // localStorage.setItem("employeeID", response.data.employeeID);
//             // localStorage.setItem("userName", response.data.username);
//             // dispatch(changeUserRole(response.data.roles));
//             // dispatch(changeUser(response.data));
//             toast.success(response.data.message, {
//               position: "top-right",
//             });
//             setOtp("");
//             redirect(`/admin/profile`);
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("Enter valid OTP", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       } else if (location?.state?.onboardingRole === "client") {
//         const data = { otp: otp, username: username };
//         let config = {
//           method: "post",
//           url: `${process.env.REACT_APP_BASE_PATH}/api/auth-client/signin`,
//           data: data,
//         };

//         axios(config)
//           .then(async function (response) {
//             // console.log(response.data);
//             setLogIn({
//               userType: response.data.roles[0],
//               token: response.data.token,
//               userId: response.data.id,
//               employeeId: response.data.employeeID,
//               username: response.data.username,
//             });
//             // localStorage.setItem("role", response.data.roles);
//             // localStorage.setItem("token", response.data.token);
//             // localStorage.setItem("activeUser", response.data.id);
//             // localStorage.setItem("userName", response.data.username);
//             // dispatch(changeUserRole(response.data.roles));
//             // dispatch(changeUser(response.data));
//             toast.success(response.data.message, {
//               position: "top-right",
//             });
//             setOtp("");
//             navigate(`/client/profile`);
//           })
//           .catch(function (error) {
//             // console.log(error);
//             toast.error("Enter valid OTP", {
//               position: toast.POSITION.TOP_RIGHT,
//             });
//           });
//       }
//     }
//   };

//   useEffect(() => {
//     let token = localStorage.getItem("token");
//     let role = localStorage.getItem("role");
//     if (token && role) {
//       router.push(`/admin/profile`);
//       // navigate(
//       //   role == "ROLE_ADMIN"
//       //     ? "/admin"
//       //     : `/${role.substring(5).toLowerCase()}/profile`
//       // );
//     }
//   }, []);

//   const goToLogin = () => {
//     router.push("/");
//   };

//   return (
//     <div className="login_wrapper">
//       <div className="login_inner_wrapper">
//         <p className="login_logo">
//           <img src={imageUrl} alt="thikedaar.com" />
//           <span className="modal__close" onClick={goToLogin}>
//             ×
//           </span>
//         </p>
//         <div className="login_header">
//           <h1>Please Sign in /Register to Continue</h1>
//         </div>
//         <div className="login_form_wrapper">
//           {otpPage ? (
//             <>
//               <span className="otp-message">
//                 Login OTP send to your Email/Phone
//               </span>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 name="otp"
//                 value={otp}
//                 onChange={e => setOtp(e.target.value)}
//               />
//               <Button text={"Login"} handleClick={handleLoginData} />
//               <div className="login_options">
//                 <span>
//                   Don&#39;t receive OTP?
//                   <button
//                     className="resend-otp"
//                     type="button"
//                     onClick={signinOtp}
//                   >
//                     Resend Again
//                   </button>
//                 </span>
//               </div>
//             </>
//           ) : (
//             <>
//               <span className="otp-message">Enter Email/Phone</span>
//               <input
//                 type="text"
//                 placeholder="Email / Mobile No."
//                 name="username"
//                 value={signData.username}
//                 onChange={e => getLoginData(e)}
//               />
//               <Button text={"Submit"} handleClick={signinOtp} />
//             </>
//           )}
//           {/* <div className="login_options">
//             <p>
//               <Link to="/forgot-password" style={{ color: "black" }}>
//                 {" "}
//                 Forgot Password?
//               </Link>
//             </p>
//           </div> */}
//           <div className="sign_text">
//             <p onClick={() => navigate("/sign_up")}>Sign Up</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
