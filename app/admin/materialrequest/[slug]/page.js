'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/button';
import SearchableSelect from '../../../../components/ui/SearchableSelect';
import { Input } from '../../../../components/ui/input';
import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../../../../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';

const schema = yup.object().shape({
  siteId: yup.string().required('Site is required'),
  purpose: yup.string().required('Purpose is required'),
  priority: yup.string().required('Priority is required'),
  date: yup.date().required('Date is required'),
  materials: yup
    .array()
    .of(
      yup.object().shape({
        materialId: yup.string().required('Material is required'),
        quantity: yup
          .number()
          .transform((value, originalValue) =>
            String(originalValue).trim() === '' ? undefined : value
          )
          .positive('Quantity must be positive')
          .required('Quantity is required'),
        unit: yup.string().required('Unit is required'),
      })
    )
    .min(1, 'At least one material is required'),
});

const unitsData = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'ton', label: 'Ton' },
  { value: 'ltr', label: 'Liter' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'mtr', label: 'Meter' },
  { value: 'bag', label: 'Bag' },
  { value: 'box', label: 'Box' },
  { value: 'roll', label: 'Roll' },
  { value: 'set', label: 'Set' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'other', label: 'Other' },
];

export default function MaterialRequestForm() {
  const { slug } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditable = slug !== 'creatematerialrequest';

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      siteId: '',
      purpose: '',
      priority: '',
      date: '',
      materials: [{ materialId: '', quantity: '', unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  });

  // API Queries
  const { data: materialsData = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () =>
      api.get('/material/getactivematerials').then(res => res.data),
  });

  const { data: sitesData = [], isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => api.get('/project/getallsiteids').then(res => res.data.data),
  });

  const { data: purpose = [], isLoading: purposeLoading } = useQuery({
    queryKey: ['purpose'],
    queryFn: () => api.get('/purpose/getallpurposes').then(res => res.data),
  });

  const {
    data: existingRequest = null,
    isLoading: existingRequestLoading,
    error: existingRequestError,
  } = useQuery({
    queryKey: ['existingRequest', slug],
    queryFn: () =>
      api.get(`/materialrequest/getorderbyid/${slug}`).then(res => res.data),
    // enabled: isEditable && slug,
    retry: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: formData => api.post('/materialrequest/create', formData),
    onSuccess: () => {
      toast.success('Material request created successfully!');
      queryClient.invalidateQueries(['materialrequest']);
      reset();
      router.back();
    },
    onError: err => {
      toast.error(
        err?.response?.data?.message || 'Failed to create material request'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/materialrequest/update/${id}`, data),
    onSuccess: () => {
      toast.success('Material request updated successfully!');
      queryClient.invalidateQueries(['existingRequest', slug]);
      queryClient.invalidateQueries(['materialrequest']);
      router.back();
    },
    onError: err => {
      toast.error(
        err?.response?.data?.message || 'Failed to update material request'
      );
    },
  });

  // Helper functions for creating new options
  const createMaterialApi = async label => {
    try {
      const res = await api.post('/material/creatematerial', { name: label });
      await queryClient.invalidateQueries(['materials']);
      toast.success(`Material "${label}" created successfully`);
      return { label: res.data.name, value: res.data._id };
    } catch (error) {
      toast.error('Failed to create material');
      throw error;
    }
  };

  const createPurposeApi = async label => {
    try {
      const res = await api.post('/purpose/createpurpose', { name: label });
      await queryClient.invalidateQueries(['purpose']);
      toast.success(`Purpose "${label}" created successfully`);
      return { label: res.data.name, value: res.data._id };
    } catch (error) {
      toast.error('Failed to create purpose');
      throw error;
    }
  };

  // Form submission handler
  const onSubmit = data => {
    if (isEditable && existingRequest) {
      updateMutation.mutate({ id: slug, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Memoized loading state
  const isLoading = useMemo(
    () =>
      materialsLoading ||
      sitesLoading ||
      purposeLoading ||
      (isEditable && existingRequestLoading),
    [
      materialsLoading,
      sitesLoading,
      purposeLoading,
      isEditable,
      existingRequestLoading,
    ]
  );

  // Form title
  const formTitle = useMemo(
    () => (isEditable ? 'Edit Material Request' : 'Create Material Request'),
    [isEditable]
  );

  // Submit button state
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Effect to populate form for editing
  useEffect(() => {
    if (!isEditable || !existingRequest || isLoading) return;

    reset({
      siteId: existingRequest.site?._id || '',
      purpose: existingRequest.purpose || '',
      priority: existingRequest.priority || '',
      date: existingRequest.requiredBefore
        ? new Date(existingRequest.requiredBefore)
        : null,
      materials:
        existingRequest.materials?.length > 0
          ? existingRequest.materials.map(m => ({
              materialId: m.item?._id || '',
              quantity: m.quantity || '',
              unit: m.unit || '',
            }))
          : [{ materialId: '', quantity: '', unit: '' }],
    });
  }, [existingRequest, isEditable, isLoading, reset]);

  // Handle existing request error
  if (isEditable && existingRequestError) {
    return (
      <AsideContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Request
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load the material request data.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </AsideContainer>
    );
  }

  return (
    <AsideContainer>
      <div className="flex flex-col justify-between items-center my-5">
        {/* Header */}
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator orientation="vertical" className="h-4 bg-black" />
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-125"
            onClick={() => router.back()}
            aria-label="Go back"
          />
          <h1 className="font-ubuntu font-bold text-xl md:text-2xl leading-7 truncate">
            {formTitle}
          </h1>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="w-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Form */}
        {!isLoading && (
          <div className="w-full p-5 bg-white rounded-lg shadow-md mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Site, Purpose, Priority, Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Site */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="siteId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Site
                  </label>
                  <Controller
                    name="siteId"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        id="siteId"
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={sitesLoading}
                        options={sitesData.map(s => ({
                          value: s._id || s.id,
                          label: s.siteID,
                        }))}
                        addNewOption={false}
                        placeholder="Select Site"
                      />
                    )}
                  />
                  {errors.siteId && (
                    <p
                      id="siteId-error"
                      role="alert"
                      className="text-red-500 text-sm"
                    >
                      {errors.siteId.message}
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="purpose"
                    className="text-sm font-medium text-gray-700"
                  >
                    Purpose
                  </label>
                  <Controller
                    name="purpose"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        id="purpose"
                        value={field.value}
                        onChange={field.onChange}
                        options={purpose.map(s => ({
                          value: s.name,
                          label: s.name,
                        }))}
                        isLoading={purposeLoading}
                        createOptionApi={createPurposeApi}
                        placeholder="Select purpose"
                      />
                    )}
                  />
                  {errors.purpose && (
                    <p
                      id="purpose-error"
                      role="alert"
                      className="text-red-500 text-sm"
                    >
                      {errors.purpose.message}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <div className="relative w-full">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="priority"
                            className="w-full pr-8 pl-4 border font-medium text-sm"
                          >
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        {field.value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => field.onChange('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500"
                            aria-label="Clear priority"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  />
                  {errors.priority && (
                    <p
                      id="priority-error"
                      role="alert"
                      className="text-red-500 text-sm"
                    >
                      {errors.priority.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="date"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            aria-label="Pick a date"
                            className={cn(
                              'w-full justify-start text-left font-normal hover:bg-secondary',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              dayjs(field.value).format('DD MMM YYYY')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            initialFocus
                            className="[&_button:hover]:bg-secondary"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && (
                    <p
                      id="date-error"
                      role="alert"
                      className="text-red-500 text-sm"
                    >
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Materials List */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">
                  Materials
                </label>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                  >
                    {/* Material */}
                    <div className="space-y-1.5">
                      <Controller
                        name={`materials.${index}.materialId`}
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={materialsData.map(m => ({
                              value: m._id || m.id,
                              label: m.name,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            createOptionApi={createMaterialApi}
                            isLoading={materialsLoading}
                            placeholder="Select Material"
                          />
                        )}
                      />
                      {errors.materials?.[index]?.materialId && (
                        <p role="alert" className="text-red-500 text-sm">
                          {errors.materials[index].materialId.message}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-1.5">
                      <Input
                        id={`materials.${index}.quantity`}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Quantity"
                        {...register(`materials.${index}.quantity`)}
                        aria-describedby={`materials.${index}.quantity-error`}
                      />
                      {errors.materials?.[index]?.quantity && (
                        <p
                          id={`materials.${index}.quantity-error`}
                          role="alert"
                          className="text-red-500 text-sm"
                        >
                          {errors.materials[index].quantity.message}
                        </p>
                      )}
                    </div>

                    {/* Unit */}
                    <div className="space-y-1.5">
                      <Controller
                        name={`materials.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={unitsData}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Unit"
                          />
                        )}
                      />
                      {errors.materials?.[index]?.unit && (
                        <p role="alert" className="text-red-500 text-sm">
                          {errors.materials[index].unit.message}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <div className="flex items-center">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          aria-label="Remove material"
                          className="text-red-500 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          <FiTrash2 size={20} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add More */}
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    append({ materialId: '', quantity: '', unit: '' })
                  }
                  className="gap-1 rounded-full bg-secondary"
                >
                  <FiPlus /> Add Material
                </Button>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="rounded-full hover:bg-primary hover:text-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full bg-secondary"
                >
                  {isSubmitting
                    ? isEditable
                      ? 'Updating...'
                      : 'Creating...'
                    : isEditable
                    ? 'Update Request'
                    : 'Create Request'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AsideContainer>
  );
}
