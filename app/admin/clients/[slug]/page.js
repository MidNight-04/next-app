'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams } from 'next/navigation';

import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

const statusOptions = ['active', 'inactive', 'blocked'];

const getSchema = isEditMode => {
  const baseSchema = {
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email().required('Email is required'),
    employeeID: Yup.string(),
    phone: Yup.string().required('Phone number is required'),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
    userStatus: Yup.string().oneOf(['active', 'inactive', 'blocked']),
    roles: Yup.string().required('Role is required'),
    image: Yup.mixed().nullable(),
  };

  if (!isEditMode) {
    return Yup.object().shape({
      ...baseSchema,
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Minimum 6 characters'),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    });
  }

  // Edit mode: password optional
  return Yup.object().shape({
    ...baseSchema,
    password: Yup.string().notRequired(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password')],
      'Passwords must match'
    ),
  });
};

export default function AddMemberForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { slug } = useParams();
  const isEditMode = slug !== 'add';
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema(isEditMode)),
    defaultValues: {
      id: slug,
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      employeeID: '',
      phone: '',
      city: '',
      state: '',
      zipCode: '',
      userStatus: '',
      roles: '',
      image: null,
    },
  });

  const { data: roleList = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/role/getall');
      return res.data.data;
    },
  });

  const isEdit = slug !== 'add';

  const {
    data: userData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['team-member', slug],
    queryFn: () =>
      api.get(`/teammember/databyid/${slug}`).then(res => res.data.data),
    enabled: isEdit,
  });

  const isRolesReady = !rolesLoading && roleList.length > 0;

  useEffect(() => {
    if (isEdit && isSuccess && userData && isRolesReady) {
      const roleId = userData.roles;
      const roleExists = roleList.some(role => role._id === roleId);
      const validStatus = statusOptions.includes(userData.userStatus)
        ? userData.userStatus
        : 'active';
      if (!roleExists) {
        console.warn('User role not found in role list:', roleId);
      }

      reset({
        id: slug,
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        employeeID: userData.employeeID || '',
        phone: userData.phone || '',
        countryCode: userData.countryCode || '+91',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || 'India',
        zipCode: userData.zipCode || '',
        userStatus: validStatus,
        roles: roleExists ? roleId : '',
        image: null,
      });

      if (userData.image) {
        setImagePreview(userData.image);
      }
    }
  }, [isEdit, isSuccess, userData, isRolesReady, reset, roleList]);

  const mutation = useMutation({
    mutationFn: async formData => {
      if (slug !== 'add') {
        return api.put('/auth/updateuser', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        return api.post('/users/createuser', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const onSubmit = async values => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === 'image' && values.image?.[0]) {
          formData.append('image', values.image[0]);
        } else if (key === 'password' && !values.password && isEditMode) {
          continue;
        } else if (key !== 'confirmPassword') {
          formData.append(key, values[key]);
        }
      }

      await mutation.mutateAsync(formData);

      toast.success(
        isEditMode ? 'User updated successfully' : 'User added successfully'
      );
      router.back();
    } catch (err) {
      console.error(err);
      toast.error('Submission failed');
    }
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', e.target.files);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const capitalize = (str = '') => {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <AsideContainer>
      <div className="flex items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer hover:scale-150 transition"
        />
        <h1>{isEditMode ? 'Edit User' : 'Add User'}</h1>
      </div>

      <div className="bg-white rounded-3xl p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 [&_label]:font-semibold"
        >
          {[
            ['First Name', 'firstname'],
            ['Last Name', 'lastname'],
            ['Username', 'username'],
            ['Email', 'email', 'email'],
            ['Employee ID', 'employeeID'],
            ['Phone', 'phone'],
            ['City', 'city'],
            ['State', 'state'],
            ['Zip Code', 'zipCode'],
          ].map(([label, name, type = 'text']) => (
            <div className="flex flex-col" key={name}>
              <label>{label}</label>
              <input
                {...register(name)}
                type={type}
                placeholder={`Enter ${label}`}
                className="h-12 border border-primary px-4 bg-gray-100 rounded-md"
              />
              {errors[name] && (
                <span className="text-red-500 text-sm">
                  {errors[name].message}
                </span>
              )}
            </div>
          ))}

          <div className="flex flex-col">
            <label>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className=" w-full text-gray-400 font-semibold text-sm bg-gray-100 border border-primary rounded-[7px] file:cursor-pointer cursor-pointer file:border-0 file:py-[14px] file:px-3 file:mr-4 file:bg-secondary file:hover:bg-gray-200 file:text-primary"
            />
            {imagePreview && (
              <img src={imagePreview} className="w-24 h-24 mt-2 rounded" />
            )}
            {errors.image && (
              <span className="text-red-500 text-sm">
                {errors.image.message}
              </span>
            )}
          </div>

          <div className="flex flex-col relative">
            <label>Password {isEditMode && '(optional)'}</label>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              className="h-12 border border-primary px-4 pr-10 bg-gray-100 rounded-md"
            />
            <span
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-9 right-3 cursor-pointer text-sm text-gray-500 [&_svg]:text-xl"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col relative">
            <label>Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className="h-12 border border-primary px-4 bg-gray-100 rounded-md"
            />
            <span
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute top-9 right-3 cursor-pointer text-sm text-gray-500 [&_svg]:text-xl"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Status</label>
            <Controller
              control={control}
              name="userStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 bg-gray-100 border border-primary px-4">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status
                          .split(' ')
                          .map(word => capitalize(word))
                          .join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userStatus && (
              <span className="text-red-500 text-sm">
                {errors.userStatus.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Role</label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={rolesLoading}
                >
                  <SelectTrigger className="h-12 bg-gray-100 border border-primary px-4">
                    <SelectValue
                      placeholder={rolesLoading ? 'Loading...' : 'Select role'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roleList.map(role => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.name
                          .split(' ')
                          .map(word => capitalize(word))
                          .join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roles && (
              <span className="text-red-500 text-sm">
                {errors.roles.message}
              </span>
            )}
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-secondary text-primary font-semibold rounded-3xl px-6 py-3"
            >
              {isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </AsideContainer>
  );
}
