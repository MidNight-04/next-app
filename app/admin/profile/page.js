"use client";
import { useEffect } from "react";
import image from "../../../public/assets/No_image_available.svg.webp";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { getClientEndpoint } from "../../../helpers/endpoints";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import { Button } from "@mui/material";
import Image from "next/image";
import AsideContainer from "../../../components/AsideContainer";

const Page = () => {
  const router = useRouter();
  const userId = useAuthStore(state => state.userId);
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`profileData/${userId}`],
    queryFn: () =>
      getClientEndpoint({
        endpoint: `databyid/${userId}`,
      }),
  });

  useEffect(() => {
    refetch();
  });

  return (
    <AsideContainer>
      <h1 className="text-[25px] font-ubuntu font-bold my-5">Profile</h1>
      <div className="bg-white rounded-3xl p-8 -md:px-4 shadow-md">
        {!isLoading ? (
          <div className="grid grid-cols-4 -lg:grid-cols-3 -sm:grid-cols-1 gap-4 justify-between [&_h4]:text-primary [&_h4]:text-xl [&_h4]:font-bold [&_h4]:font-ubuntu [&_h4]:leading-loose  [&_p]:font-semibold">
            <div className="flex flex-row gap-4 h-full">
              <span className="h-36 rounded-full w-1 bg-primary" />
              <div className="flex flex-col items-center justify-center gap-4">
                <Image
                  src={
                    profileData?.data?.profileImage[0]
                      ? profileData?.data?.profileImage[0]
                      : image
                  }
                  height={100}
                  width={100}
                  className="rounded-full"
                  alt="profile-img"
                />
                <button
                  className="border-2 text-nowrap border-primary cursor-pointer text-primary font-ubuntu text-sm px-3 py-1 rounded-3xl hover:bg-secondary hover:text-primary hover:border-secondary -md:px-4 -md:py-1 -md:text-sm"
                  onClick={() => router.push("/admin/profile/edit-profile")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <h4>Name</h4>
                <p>{profileData?.data.name}</p>
              </div>
              <div className="mb-4">
                <h4>Phone</h4>
                <p>{profileData?.data.phone}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <h4>Email</h4>
                <p>{profileData?.data.email}</p>
              </div>
              <div className="mb-4">
                <h4>Address</h4>
                <p>{profileData?.data.address}</p>
              </div>
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
