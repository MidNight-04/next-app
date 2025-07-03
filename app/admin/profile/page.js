'use client';

import { useAuthStore } from '../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';
import Image from 'next/image';
import AsideContainer from '../../../components/AsideContainer';
import fallbackImage from '../../../public/assets/No_image_available.svg.webp';

const Page = () => {
  const userId = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);
  const hasHydrated = useAuthStore.persist?.hasHydrated();

  const {
    data: profileData,
    isLoading,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () =>
      api.get(`/teammember/databyid/${userId}`).then(res => res.data.data),
    enabled: !!userId && hasHydrated,
  });

  const profileImageSrc =
    typeof profileData?.profileImage === 'string' &&
    profileData.profileImage.startsWith('http')
      ? profileData.profileImage
      : fallbackImage.src;

  const fullName =
    [profileData?.firstname, profileData?.lastname].filter(Boolean).join(' ') ||
    '—';

  return (
    <AsideContainer>
      <h1 className="text-[25px] font-ubuntu font-bold my-5">Profile</h1>
      <div className="bg-white rounded-3xl p-8 -md:px-4 shadow-md">
        {!isLoading ? (
          <div className="grid grid-cols-4 -lg:grid-cols-3 -sm:grid-cols-1 gap-4 justify-between [&_h4]:text-primary [&_h4]:text-xl [&_h4]:font-bold [&_h4]:font-ubuntu [&_h4]:leading-loose [&_p]:font-semibold">
            <div className="flex flex-row gap-4 h-full">
              <span className="h-full rounded-full w-1 bg-primary" />
              <div className="flex flex-col items-center justify-center gap-4">
                <Image
                  src={profileImageSrc}
                  height={100}
                  width={100}
                  className="rounded-full object-cover"
                  alt="profile-img"
                />
                {/* {userType === 'ROLE_ADMIN' && (
                  <button
                    className="border-2 text-nowrap border-secondary cursor-pointer text-secondary font-semibold text-sm font-ubuntu px-3 py-2 rounded-3xl hover:bg-secondary hover:text-primary hover:border-secondary -md:px-4 -md:py-1 -md:text-sm"
                    onClick={() => router.push('/admin/profile/edit-profile')}
                  >
                    Edit Profile
                  </button>
                )} */}
              </div>
            </div>

            <div className="grid grid-cols-3 col-span-3  justify-center">
              <div className="mb-4">
                <h4>Full Name</h4>
                <p>{fullName}</p>
              </div>
              <div className="mb-4">
                <h4>Phone</h4>
                <p>{profileData?.phone || '—'}</p>
              </div>
              <div className="mb-4">
                <h4>Email</h4>
                <p>{profileData?.email || '—'}</p>
              </div>
              <div className="mb-4">
                <h4>City</h4>
                <p>{profileData?.city || '—'}</p>
              </div>
              <div className="mb-4">
                <h4>State</h4>
                <p>{profileData?.state || '—'}</p>
              </div>
              <div className="mb-4">
                <h4>Zip Code</h4>
                <p>{profileData?.zipCode || '—'}</p>
              </div>
              {userType === 'ROLE_CLIENT' && (
                <div className="mb-4">
                  <h4>Address</h4>
                  <p>{profileData?.address || '—'}</p>
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
