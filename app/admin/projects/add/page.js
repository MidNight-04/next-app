'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { IoIosArrowBack } from 'react-icons/io';
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
  cost: yup.string().typeError('Cost must be a number').required('Cost is required'),
  date: yup.date().transform((value, originalValue) => new Date(originalValue)).required('Start date is required'),
  duration: yup.string().min(1).typeError('Duration must be a number').required('Duration is required'),
  admin: yup.string().required('Admin is required'),
  architect: yup.string().required('Architect is required'),
  sr_engineer: yup.string().required('Sr. Engineer is required'),
  engineer: yup.string().required('Site Engineer is required'),
  accountant: yup.string().required('Accountant is required'),
  operation: yup.string().required('Operation is required'),
  sales: yup.string().required('Sales is required'),
  contractor: yup.string().required('Contractor is required'),
});

const toOptions = (arr, labelFn = item => item.name, valueFn = item => item._id) =>
  arr.map(item => ({ label: labelFn(item), value: valueFn(item) }));

const AddProjectForm = () => {
  const router = useRouter();
  const userName = useAuthStore(state => state.username);
  const activeUser = useAuthStore(state => state.userId);

  const [floorOptions, setFloorOptions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [clients, setClients] = useState([]);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '', siteID: '', location: '', branch: '', client: '',
      floor: '', plan: '', area: '', cost: '', date: '', duration: '',
      admin: '', architect: '', sr_engineer: '', engineer: '', accountant: '',
      operation: '', sales: '', contractor: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [stagesRes, membersRes, clientsRes, contractorsRes, floorsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/constructionstep/getall`),
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`),
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/client/getall`),
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/contractor/applications`),
          axios.get(`${process.env.REACT_APP_BASE_PATH}/api/floor/getall`),
        ]);

        setStages(stagesRes?.data?.data?.sort((a, b) => a.priority - b.priority) || []);
        setTeamMembers(membersRes?.data?.data || []);
        setClients(clientsRes?.data?.data || []);
        setContractors(contractorsRes?.data?.data?.filter(c => c.approvalStatus === 'Approved') || []);
        setFloorOptions(floorsRes?.data?.data || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderInput = (label, name, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <input {...register(name)} type={type} placeholder={placeholder}
        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold" />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value ?? ''}>
            <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {options.map((item, index) => (
                <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
    </div>
  );

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        assignedName: userName,
        assignedID: activeUser,
      };

      const response = await axios.post(`${process.env.REACT_APP_BASE_PATH}/api/project/add`, { data: payload });

      if (response.data.status === 201) {
        toast(response.data.message);
        router.push('/admin/projects');
      } else {
        toast(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Project submission error:', error);
      toast('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <AsideContainer>
    {isLoading ? (
      <LoaderSpinner />
    ) : (
      <div>
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator orientation="vertical" className="h-4 bg-black" />
          <IoIosArrowBack onClick={() => router.back()} className="cursor-pointer transition hover:scale-150" />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">Add Project</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[15px] p-5 mb-5">
          <div className="grid grid-cols-2 gap-4 gap-x-8 -md:grid-cols-1">
            {renderInput('Project Name', 'name', 'text', 'Enter Name')}
            {renderInput('Site ID', 'siteID', 'text', 'Enter Site ID')}
            {renderInput('Project Location', 'location', 'text', 'Enter project location')}
            {renderSelect('Branch', 'branch', [
              { value: 'Gurgaon', label: 'Gurgaon' },
              { value: 'Patna', label: 'Patna' },
              { value: 'Ranchi', label: 'Ranchi' },
            ])}
            {renderSelect('Client', 'client', toOptions(clients))}
            {renderSelect('Number of Floor', 'floor', toOptions(floorOptions, f => f.name, f => f.name))}
            {renderSelect('Select Floor Plan', 'plan', toOptions(stages))}
            {renderInput('Project Area', 'area', 'text', 'Enter project area')}
            {renderInput('Project Cost', 'cost', 'number', 'Enter project cost')}
            {renderInput('Start Date', 'date', 'date')}
            {renderInput('Duration (In months)', 'duration', 'number', 'Enter Construction duration')}
            {renderSelect('Project Admin', 'admin', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'admin'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Architect', 'architect', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'architect'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Sr. Engineer', 'sr_engineer', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'sr. engineer'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Site Engineer', 'engineer', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'site engineer'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Accountant', 'accountant', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'accountant'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Operation', 'operation', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'operations'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Sales', 'sales', toOptions(teamMembers.filter(m => m.role?.name.toLowerCase() === 'sales'), m => `${m.name} (${m.employeeID})`))}
            {renderSelect('Contractor', 'contractor', toOptions(contractors, c => `${c.name} (${c.companyNameShopName})`))}
          </div>
          <div className="flex flex-row justify-end">
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl cursor-pointer mt-4">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    )}
  </AsideContainer>
  );
};

export default AddProjectForm;