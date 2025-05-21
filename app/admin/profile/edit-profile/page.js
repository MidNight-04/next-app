"use client";
import LoaderSpinner from "../../../../components/loader/LoaderSpinner";
import { useQuery } from "@tanstack/react-query";
import { styled, TextField } from "@mui/material";
import image from "../../../../public/assets/No_image_available.svg.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../store/useAuthStore";
import { getClientEndpoint } from "../../../../helpers/endpoints";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AsideContainer from "../../../../components/AsideContainer";
import { FiLoader } from "react-icons/fi"; // will be user a WIP icon
import { MdSchedule } from "react-icons/md"; //schedule icon
import { IoIosArrowBack } from "react-icons/io";

const CustomField = styled(TextField)`
  & label.Mui-focused {
    color: #93BFCF;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #93BFCF;
    }
  }
`;

const Page = () => {
  const router = useRouter();
  const userId = useAuthStore(state => state.userId);
  const [profileData, setProfileData] = useState({
    profileImage: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const { data: profile, isFetched } = useQuery({
    queryKey: [`profileData/${userId}`],
    queryFn: () =>
      getClientEndpoint({
        endpoint: `databyid/${userId}`,
      }),
    initialData: {
      profileImage: image,
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (e.target.files) {
      setProfileData({ ...profileData, [name]: e.target.files[0] });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  useEffect(() => {
    if (isFetched) {
      setProfileData({
        image: profile?.data.profileImage[0],
        name: profile?.data.name,
        phone: profile?.data.phone,
        email: profile?.data.email,
        address: profile?.data.address,
      });
    }
  }, [profile, isFetched]);

  const updateForm = () => {
    if (!profileData.name) {
      toast("Name is required");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/client/update-profile/${userId}`,
        headers: { "Content-Type": "multipart/form-data" },
        data: profileData,
      };
      axios
        .request(config)
        .then(resp => {
          toast(resp.data.message);
          router.back();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold my-5 font-ubuntu -md:mb-2 -md:text-lg">
            Edit Profile
          </h1>
        </div>
        {isFetched ? (
          <div className="bg-white rounded-3xl p-8 -md:p-4">
            <div className="form">
              <div className="flex flex-col justify-center items-center mb-8">
                <Image
                  src={profileData.profileImage || image}
                  alt="profile-img"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                {/* <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="file_input"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={handleChange}
                /> */}
                <div className="w-60">
                  <label className="text-base text-[#565656] font-semibold mb-2 block text-center">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleChange}
                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-3 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                  />
                  {/* <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG SVG, WEBP, and GIF are Allowed.
                  </p> */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 my-4 -md:grid-cols-1">
                <div className="flex flex-col gap-2">
                  <label className="text-base text-[#565656] font-semibold ml-1">
                    Name
                  </label>
                  <input
                    value={profileData.name}
                    className="p-4 outline-none border-[1px] rounded-lg bg-[#fafafa] focus-within:border-[#93BFCF]"
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base text-[#565656] font-semibold ml-1">
                    Phone
                  </label>
                  <input
                    variant="outlined"
                    value={profileData.phone}
                    className="p-4 outline-none border-[1px] rounded-lg bg-[#fafafa] focus-within:border-primary"
                    type="text"
                    name="phone"
                    id="phone"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base text-[#565656] font-semibold ml-1">
                    Email
                  </label>
                  <input
                    value={profileData.email}
                    type="text"
                    className="p-4 outline-none border-[1px] rounded-lg bg-[#fafafa] focus-within:border-primary"
                    name="email"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base text-[#565656] font-semibold ">
                    Address
                  </label>
                  <input
                    value={profileData.address}
                    className="p-4 outline-none border-[1px] rounded-lg bg-[#fafafa] focus-within:border-primary"
                    type="text"
                    name="address"
                    id="address"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <button
                className="border-2 text-nowrap border-secondary cursor-pointer font-semibold text-sm font-ubuntu px-3 py-2 rounded-3xl bg-secondary text-primary hover:border-secondary -md:px-4 -md:py-1 -md:text-sm"
                onClick={() => updateForm(userId)}
              >
                Update
              </button>
              <button
                className="border-2 text-nowrap border-secondary cursor-pointer text-secondary font-semibold text-sm font-ubuntu px-3 py-2 rounded-3xl -md:px-4 -md:py-1 -md:text-sm"
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </AsideContainer>
  );
};

export default Page;
