'use client';

import { useAuthStore } from '../../../store/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';
import Image from 'next/image';
import AsideContainer from '../../../components/AsideContainer';
import fallbackImage from '../../../public/assets/No_image_available.svg.webp';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { Modal } from '@mui/material';
import { useRef, useState } from 'react';
import ChangePasswordForm from '../../../components/changePassword/ChangePassword';
import CropImageModal from '../../../components/cropImage/CropImage';
import { toast } from 'sonner';

const Page = () => {
  const userId = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);
  const hasHydrated = useAuthStore.persist?.hasHydrated();
  const router = useRouter();

  const fileInputRef = useRef(null);
  const [showChangePasswordModal, setShowPassowrdModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () =>
      api.get(`/teammember/databyid/${userId}`).then(res => res.data.data),
    enabled: !!userId && hasHydrated,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async imageFile => {
      if (!imageFile) throw new Error('No image selected');

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('image', imageFile);

      const response = await api.post('/auth/change-profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'Profile image updated');
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: error => {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    },
  });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleChangePassword = () => setShowPassowrdModal(prev => !prev);

  const profileImageSrc =
    typeof profileData?.profileImage === 'string' &&
    profileData.profileImage.startsWith('http')
      ? profileData.profileImage
      : fallbackImage;

  const fullName =
    [profileData?.firstname, profileData?.lastname].filter(Boolean).join(' ') ||
    '—';

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center -lg:pt-2 -lg:mb-2">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <IoIosArrowBack
            onClick={() => router.back()}
            className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
            Profile
          </h1>
        </div>
        <div className="flex flex-row gap-2">
          <button
            onClick={toggleChangePassword}
            className="py-2 px-3 bg-transparent border-2 border-secondary rounded-full font-ubuntu hover:bg-secondary [&_p]:hover:text-primary-foreground [&_svg]:hover:text-primary-foreground"
          >
            <span className="text-secondary flex flex-row items-center gap-2">
              <FaRegEdit className="text-xl" />
              <p className="text-[13px] font-bold text-nowrap">
                Change Password
              </p>
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 px-8 -md:px-4 shadow-md">
        {!isLoading && !isPending ? (
          <div className="grid grid-cols-4 -lg:grid-cols-3 -sm:grid-cols-1 gap-4 justify-between [&_h4]:text-primary [&_h4]:text-xl [&_h4]:font-bold [&_h4]:font-ubuntu [&_h4]:leading-loose [&_p]:font-semibold">
            <div className="flex flex-row gap-4 h-full">
              <span className="h-full rounded-full w-1 bg-primary" />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-[160px] h-[160px] rounded-full overflow-hidden">
                  <Image
                    src={profileImageSrc}
                    height={160}
                    width={160}
                    className="w-full h-full object-cover"
                    alt="profile-img"
                  />
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-secondary text-primary px-4 py-2 rounded-full text-sm"
                  >
                    {isPending ? 'Uploading...' : 'Change Picture'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 col-span-3 items-center justify-center">
              <div>
                <h4>Full Name</h4>
                <p>{fullName}</p>
              </div>
              <div>
                <h4>Phone</h4>
                <p>{profileData?.phone || '—'}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{profileData?.email || '—'}</p>
              </div>
              <div>
                <h4>City</h4>
                <p>{profileData?.city || '—'}</p>
              </div>
              <div>
                <h4>State</h4>
                <p>{profileData?.state || '—'}</p>
              </div>
              <div>
                <h4>Zip Code</h4>
                <p>{profileData?.zipCode || '—'}</p>
              </div>
              {userType === 'ROLE_CLIENT' && (
                <div>
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

      <Modal
        open={showChangePasswordModal}
        onClose={toggleChangePassword}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ChangePasswordForm onClose={toggleChangePassword} />
      </Modal>
      <CropImageModal
        open={showCropModal}
        image={selectedImage}
        onClose={() => setShowCropModal(false)}
        onCropComplete={croppedBlob => mutate(croppedBlob)}
      />
    </AsideContainer>
  );
};

export default Page;
