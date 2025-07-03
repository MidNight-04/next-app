'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';

import AsideContainer from '../../../../components/AsideContainer';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getClientEndpoint } from '../../../../helpers/endpoints';
import api from '../../../../lib/api';
import fallbackImage from '../../../../public/assets/No_image_available.svg.webp';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  image: yup
    .mixed()
    .nullable()
    .test('fileType', 'Unsupported file type', value => {
      return (
        !value ||
        typeof value === 'string' ||
        (typeof File !== 'undefined' && value instanceof File)
      );
    }),
});

const Page = () => {
  const router = useRouter();
  const userId = useAuthStore(state => state.userId);

  const [imagePreview, setImagePreview] = useState(null);

  const { data: profile, isFetched } = useQuery({
    queryKey: [`profileData/${userId}`],
    queryFn: () =>
      getClientEndpoint({
        endpoint: `databyid/${userId}`,
      }),
    enabled: !!userId,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      image: null,
    },
  });

  const selectedImage = watch('image');

  useEffect(() => {
    if (selectedImage && selectedImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(selectedImage);
    } else if (typeof selectedImage === 'string') {
      setImagePreview(selectedImage);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (isFetched) {
      const data = profile?.data;
      reset({
        name: data?.name || '',
        phone: data?.phone || '',
        email: data?.email || '',
        address: data?.address || '',
        image: null, // do not preload image into file input
      });
      if (data?.image?.[0]) {
        setImagePreview(data.image[0]);
      }
    }
  }, [profile, isFetched, reset]);

  const onSubmit = async data => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key === 'image' && data.image instanceof File) {
          formData.append('image', data.image);
        } else if (key !== 'image') {
          formData.append(key, data[key]);
        }
      }

      const response = await api.post(
        `/api/client/update-profile/${userId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success(response.data.message || 'Profile updated');
      router.back();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold my-5 font-ubuntu -md:mb-2 -md:text-lg">
            Edit Profile
          </h1>
        </div>

        {isFetched ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl p-8 -md:p-4"
          >
            <div className="flex flex-col justify-center items-center mb-8">
              <img
                src={imagePreview || fallbackImage?.src}
                alt="profile-img"
                width={100}
                height={100}
                className="rounded-full object-cover w-[100px] h-[100px]"
              />
              <div className="w-60 mt-4">
                <label className="block text-sm font-medium text-center text-[#565656] mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  onChange={e =>
                    setValue('image', e.target.files?.[0] || null)
                  }
                  className="w-full cursor-pointer border file:py-2 file:px-3 file:bg-gray-100 file:hover:bg-gray-200 text-sm file:text-gray-500 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 -md:grid-cols-1">
              {['name', 'phone', 'email', 'address'].map(field => (
                <div className="flex flex-col gap-2" key={field}>
                  <label
                    htmlFor={field}
                    className="text-base text-[#565656] font-semibold ml-1 capitalize"
                  >
                    {field}
                  </label>
                  <input
                    id={field}
                    {...register(field)}
                    className={`p-4 outline-none border rounded-lg bg-[#fafafa] ${
                      errors[field]
                        ? 'border-red-500'
                        : 'focus:border-[#93BFCF] border-gray-300'
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-xs text-red-500 ml-1">
                      {errors[field]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="border-2 text-nowrap border-secondary font-semibold text-sm px-3 py-2 rounded-3xl bg-secondary text-primary hover:border-secondary disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
              <button
                type="button"
                className="border-2 text-nowrap border-secondary text-secondary font-semibold text-sm px-3 py-2 rounded-3xl"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </AsideContainer>
  );
};

export default Page;
