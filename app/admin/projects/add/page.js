'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';

const schema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  siteID: yup.string().required('Site ID is required'),
  location: yup.string().required('Location is required'),
  branch: yup.string().required('Branch is required'),
  client: yup.string().required('Client is required'),
  floor: yup.string().required('Number of floors is required'),
  plan: yup.string().required('Floor plan is required'),
  area: yup.string().required('Area is required'),
  cost: yup
    .number()
    .typeError('Cost must be a number')
    .required('Cost is required'),
  date: yup
    .date()
    .transform((value, originalValue) => new Date(originalValue))
    .required('Start date is required'),
  duration: yup
    .number()
    .typeError('Duration must be a number')
    .required('Duration is required'),
  admin: yup.string().required('Admin is required'),
  architect: yup.string().required('Architect is required'),
  sr_engineer: yup.string().required('Sr. Engineer is required'),
  engineer: yup.string().required('Site Engineer is required'),
  accountant: yup.string().required('Accountant is required'),
  operation: yup.string().required('Operation is required'),
  sales: yup.string().required('Sales is required'),
  contractor: yup.string().required('Contractor is required'),
});

const toOptions = (
  arr,
  labelFn = item => item.name,
  valueFn = item => item._id
) =>
  Array.isArray(arr)
    ? arr.map(item => ({ label: labelFn(item), value: valueFn(item) }))
    : [];

const FormInput = React.memo(function FormInput({
  label,
  name,
  register,
  errors,
  type = 'text',
  placeholder = '',
  inputProps = {},
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );
});

const FormSelect = React.memo(function FormSelect({
  label,
  name,
  control,
  errors,
  options,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value ?? ''}>
            <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );
});

const AddProjectForm = () => {
  const router = useRouter();
  const { userId, userName, activeUser, token } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      siteID: '',
      location: '',
      branch: '',
      client: '',
      floor: '',
      plan: '',
      area: '',
      cost: '',
      date: '',
      duration: '',
      admin: '',
      architect: '',
      sr_engineer: '',
      engineer: '',
      accountant: '',
      operation: '',
      sales: '',
      contractor: '',
      assignedBy: userId,
    },
  });

  const [stagesQuery, usersQuery, contractorsQuery, floorOptionsQuery] =
    useQueries({
      queries: [
        {
          queryKey: ['construction-steps'],
          queryFn: async () => {
            const res = await api.get(`/constructionstep/getall`);
            return res?.data?.data?.sort((a, b) => a.priority - b.priority);
          },
          enabled: !!token,
        },
        {
          queryKey: ['all-users'],
          queryFn: async () => {
            const res = await api.get(`/user/getallusers`);
            return res?.data;
          },
          enabled: !!token,
        },
        {
          queryKey: ['approved-contractors'],
          queryFn: async () => {
            const res = await api.get(`/contractor/applications`);
            return res?.data?.data?.filter(
              c => c.approvalStatus === 'Approved'
            );
          },
          enabled: !!token,
        },
        {
          queryKey: ['floor-options'],
          queryFn: async () => {
            const res = await api.get(`/floor/getall`);
            return res?.data?.data;
          },
          enabled: !!token,
        },
      ],
    });

  const clientOptions = useMemo(
    () =>
      toOptions(
        usersQuery.data?.filter(
          u => u.roles?.name?.toLowerCase() === 'client'
        ) || [],
        u => `${u.firstname} ${u.lastname}`
      ),
    [usersQuery.data]
  );

  const floorOptions = useMemo(
    () =>
      toOptions(
        floorOptionsQuery.data || [],
        f => f.name,
        f => f.name
      ),
    [floorOptionsQuery.data]
  );

  const contractorOptions = useMemo(
    () =>
      toOptions(
        contractorsQuery.data || [],
        c => `${c.name} (${c.companyNameShopName})`
      ),
    [contractorsQuery.data]
  );

  const stagesOptions = useMemo(
    () => toOptions(stagesQuery.data || []),
    [stagesQuery.data]
  );

  const userRoleOptions = role =>
    toOptions(
      usersQuery.data?.filter(u => u.roles?.name?.toLowerCase() === role) || [],
      u => `${u.firstname} ${u.lastname} (${u.employeeID})`
    );

  const isLoading = [
    stagesQuery,
    usersQuery,
    contractorsQuery,
    floorOptionsQuery,
  ].some(q => q.isLoading);

  const { mutate: submitProject, isPending: isSubmitting } = useMutation({
    mutationFn: async formData => {
      const payload = {
        ...formData,
        assignedName: userName,
        assignedID: activeUser,
      };
      const res = await api.post(`/project/add`, { data: payload });
      if (res.data.status !== 201)
        throw new Error(res.data.message || 'Submission failed');
      return res.data;
    },
    onSuccess: data => {
      toast(data.message || 'Project created successfully!');
      queryClient.invalidateQueries(['projects']);
      router.push('/admin/projects');
    },
    onError: error => {
      toast(
        error?.response?.data?.message ||
          error.message ||
          'An error occurred while submitting.'
      );
    },
  });

  const onSubmit = data => submitProject(data);

  return (
    <AsideContainer>
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <div>
          <div className="flex w-full items-center gap-2">
            <SidebarTrigger className="-ml-2 hover:bg-primary" />
            <Separator orientation="vertical" className="h-4 bg-black" />
            <IoIosArrowBack
              onClick={() => router.back()}
              className="cursor-pointer transition hover:scale-150"
            />
            <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
              Add Project
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[15px] p-5 mb-5"
          >
            <div className="grid grid-cols-2 gap-4 gap-x-8 -md:grid-cols-1">
              <FormInput
                label="Project Name"
                placeholder="Enter Project Name"
                name="name"
                register={register}
                errors={errors}
                autoFocus
              />
              <FormInput
                label="Site ID"
                placeholder="Site ID"
                name="siteID"
                register={register}
                errors={errors}
              />
              <FormInput
                label="Project Location"
                placeholder="Location"
                name="location"
                register={register}
                errors={errors}
              />
              <FormSelect
                label="Branch"
                name="branch"
                placeholder="Branch"
                control={control}
                errors={errors}
                options={toOptions(
                  ['Gurgaon', 'Patna', 'Ranchi'],
                  v => v,
                  v => v
                )}
              />
              <FormSelect
                label="Client"
                name="client"
                control={control}
                errors={errors}
                options={clientOptions}
              />
              <FormSelect
                label="Number of Floor"
                name="floor"
                control={control}
                errors={errors}
                options={floorOptions}
              />
              <FormSelect
                label="Select Floor Plan"
                name="plan"
                control={control}
                errors={errors}
                options={stagesOptions}
              />
              <FormInput
                label="Project Area"
                name="area"
                placeholder="Area"
                register={register}
                errors={errors}
              />
              <FormInput
                label="Project Cost"
                name="cost"
                placeholder="Cost"
                type="number"
                register={register}
                errors={errors}
              />
              <FormInput
                label="Start Date"
                name="date"
                type="date"
                placeholder="Start Date"
                register={register}
                errors={errors}
              />
              <FormInput
                label="Duration (In months)"
                name="duration"
                type="number"
                placeholder="Duration"
                register={register}
                errors={errors}
              />
              <FormSelect
                label="Project Admin"
                name="admin"
                control={control}
                errors={errors}
                options={userRoleOptions('project admin')}
              />
              <FormSelect
                label="Architect"
                name="architect"
                control={control}
                errors={errors}
                options={userRoleOptions('architect')}
              />
              <FormSelect
                label="Sr. Engineer"
                name="sr_engineer"
                control={control}
                errors={errors}
                options={userRoleOptions('sr. engineer')}
              />
              <FormSelect
                label="Site Engineer"
                name="engineer"
                control={control}
                errors={errors}
                options={userRoleOptions('site engineer')}
              />
              <FormSelect
                label="Accountant"
                name="accountant"
                control={control}
                errors={errors}
                options={userRoleOptions('accountant')}
              />
              <FormSelect
                label="Operation"
                name="operation"
                control={control}
                errors={errors}
                options={userRoleOptions('operations')}
              />
              <FormSelect
                label="Sales"
                name="sales"
                control={control}
                errors={errors}
                options={userRoleOptions('sales')}
              />
              <FormSelect
                label="Contractor"
                name="contractor"
                control={control}
                errors={errors}
                options={contractorOptions}
              />
            </div>
            <div className="flex flex-row justify-end gap-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-400 text-gray-700 rounded-3xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </AsideContainer>
  );
};

export default AddProjectForm;
