"use client";
import { useEffect, useLayoutEffect } from "react";
import image from "../../../public/assets/No_image_available.svg.webp";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import {
  getClientEndpoint,
  getTeamMemberEndpoint,
  getUserEndpoint,
} from "../../../helpers/endpoints";
import LoaderSpinner from "../../../components/loader/LoaderSpinner";
import Image from "next/image";
import AsideContainer from "../../../components/AsideContainer";

const Page = () => {
  const router = useRouter();
  const userId = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state);
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const {
    data: profileData,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [`profileData/${userId}`],
    queryFn: async () => {
      if (userType === "ROLE_CLIENT") {
        const response = await getClientEndpoint({
          endpoint: `databyid/${userId}`,
        });
        return response.data;
      } else if (userType === "ROLE_ADMIN") {
        const response = await getUserEndpoint({
          endpoint: `single-profile/${userId}`,
        });
        return response.data;
      } else {
        const response = await getTeamMemberEndpoint({
          endpoint: `databyid/${userId}`,
        });
        return response.data;
      }
    },
    retry: 3,
    enabled: hasHydrated,
    staleTime: 10000,
  });

  useLayoutEffect(() => {
    refetch();
  }, [userId]);

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
                {userType === "ROLE_ADMIN" && (
                  <button
                    className="border-2 text-nowrap border-secondary cursor-pointer text-secondary font-semibold text-sm font-ubuntu px-3 py-2 rounded-3xl hover:bg-secondary hover:text-primary hover:border-secondary -md:px-4 -md:py-1 -md:text-sm"
                    onClick={() => router.push("/admin/profile/edit-profile")}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <h4>Name</h4>
                <p>{profileData?.name}</p>
              </div>
              <div className="mb-4">
                <h4>Phone</h4>
                <p>{profileData?.phone}</p>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="mb-4">
                <h4>Email</h4>
                <p>{profileData?.email}</p>
              </div>
              {userType === "ROLE_CLINT" && (
                <div className="mb-4">
                  <h4>Address</h4>
                  <p>{profileData?.address}</p>
                </div>
              )}
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
