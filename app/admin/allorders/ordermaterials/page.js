// 'use client';

// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { Button } from '../../../../components/ui/button';
// import SearchableSelect from '../../../../components/ui/SearchableSelect';
// import { Input } from '../../../../components/ui/input';
// import api from '../../../../lib/api';
// import AsideContainer from '../../../../components/AsideContainer';
// import { SidebarTrigger } from '../../../../components/ui/sidebar';
// import { Separator } from '../../../../components/ui/separator';
// import { useRouter } from 'next/navigation';
// import { IoIosArrowBack } from 'react-icons/io';
// import { toast } from 'sonner';

// const schema = yup.object().shape({
//   materialId: yup.string().required('Material is required'),
//   siteId: yup.string().required('Site is required'),
//   purpose: yup.string().required('Purpose is required'),
//   priority: yup.string().required('Priority is required'),
//   quantity: yup
//     .number()
//     .typeError('Quantity must be a number')
//     .positive('Quantity must be positive')
//     .required('Quantity is required'),
// });

// export default function MaterialRequestForm() {
//   const router = useRouter();

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       materialId: '',
//       siteId: '',
//       purpose: '',
//       priority: '',
//       quantity: '',
//     },
//   });

//   // Fetch materials & sites
//   const { data: materialsData = [], isLoading: materialsLoading } = useQuery({
//     queryKey: ['materials'],
//     queryFn: () => api.get('/materials').then(res => res.data),
//   });

//   const { data: sitesData = [], isLoading: sitesLoading } = useQuery({
//     queryKey: ['sites'],
//     queryFn: () => api.get('/sites').then(res => res.data),
//   });

//   // Submit mutation
//   const mutation = useMutation({
//     mutationFn: formData => api.post('/material-requests', formData),
//     onSuccess: () => {
//       toast.success('Material request submitted successfully!');
//       reset();
//       router.back();
//     },
//     onError: err => {
//       toast.error(err?.response?.data?.message || 'Something went wrong');
//     },
//   });

//   const onSubmit = data => {
//     mutation.mutate(data);
//   };

//   return (
//     <AsideContainer>
//       <div className="flex flex-col justify-between items-center my-5">
//         {/* Header */}
//         <div className="flex w-full items-center gap-1 lg:gap-2">
//           <SidebarTrigger className="-ml-2 hover:bg-primary" />
//           <Separator
//             orientation="vertical"
//             className="data-[orientation=vertical]:h-4 bg-black"
//           />
//           <IoIosArrowBack
//             className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
//             onClick={() => router.back()}
//           />
//           <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
//             Create Material Request
//           </h1>
//         </div>

//         {/* Form */}
//         <div className="w-full p-5 bg-white rounded-lg shadow-md mt-5">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-5 gap-x-4 gap-y-2">
//               {/* Material */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">
//                   Material
//                 </label>
//                 <Controller
//                   name="materialId"
//                   control={control}
//                   render={({ field }) => (
//                     <SearchableSelect
//                       value={field.value}
//                       onChange={field.onChange}
//                       isLoading={materialsLoading}
//                       options={materialsData.map(m => ({
//                         value: m.id,
//                         label: m.name,
//                       }))}
//                       placeholder="Select Material"
//                     />
//                   )}
//                 />
//                 {errors.materialId && (
//                   <p className="text-red-500 text-sm">
//                     {errors.materialId.message}
//                   </p>
//                 )}
//               </div>

//               {/* Quantity */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">
//                   Quantity
//                 </label>
//                 <Input
//                   type="number"
//                   placeholder="Quantity"
//                   {...register('quantity')}
//                 />
//                 {errors.quantity && (
//                   <p className="text-red-500 text-sm">
//                     {errors.quantity.message}
//                   </p>
//                 )}
//               </div>

//               {/* Site */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">
//                   Site
//                 </label>
//                 <Controller
//                   name="siteId"
//                   control={control}
//                   render={({ field }) => (
//                     <SearchableSelect
//                       value={field.value}
//                       onChange={field.onChange}
//                       isLoading={sitesLoading}
//                       options={sitesData.map(s => ({
//                         value: s.id,
//                         label: s.name,
//                       }))}
//                       placeholder="Select Site"
//                     />
//                   )}
//                 />
//                 {errors.siteId && (
//                   <p className="text-red-500 text-sm">
//                     {errors.siteId.message}
//                   </p>
//                 )}
//               </div>

//               {/* Purpose */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">
//                   Purpose
//                 </label>
//                 <Input placeholder="Purpose" {...register('purpose')} />
//                 {errors.purpose && (
//                   <p className="text-red-500 text-sm">
//                     {errors.purpose.message}
//                   </p>
//                 )}
//               </div>

//               {/* Priority */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">
//                   Priority
//                 </label>
//                 <Controller
//                   name="priority"
//                   control={control}
//                   render={({ field }) => (
//                     <SearchableSelect
//                       value={field.value}
//                       onChange={field.onChange}
//                       options={[
//                         { value: 'low', label: 'Low' },
//                         { value: 'medium', label: 'Medium' },
//                         { value: 'high', label: 'High' },
//                       ]}
//                       placeholder="Select Priority"
//                     />
//                   )}
//                 />
//                 {errors.priority && (
//                   <p className="text-red-500 text-sm">
//                     {errors.priority.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit */}
//             <Button
//               type="submit"
//               disabled={mutation.isPending}
//               className="w-auto bg-secondary text-primary px-4 py-2 mt-4 float-end rounded-full"
//             >
//               {mutation.isPending ? 'Submitting...' : 'Submit'}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </AsideContainer>
//   );
// }

'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
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

const schema = yup.object().shape({
  siteId: yup.string().required('Site is required'),
  purpose: yup.string().required('Purpose is required'),
  priority: yup.string().required('Priority is required'),
  materials: yup
    .array()
    .of(
      yup.object().shape({
        materialId: yup.string().required('Material is required'),
        quantity: yup
          .number()
          .typeError('Quantity must be a number')
          .positive('Quantity must be positive')
          .required('Quantity is required'),
      })
    )
    .min(1, 'At least one material is required'),
});

export default function MaterialRequestForm() {
  const router = useRouter();

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
      materials: [{ materialId: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materials',
  });

  // Fetch materials & sites
  const { data: materialsData = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => api.get('/materials').then(res => res.data),
  });

  const { data: sitesData = [], isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => api.get('/sites').then(res => res.data),
  });

  // Submit mutation
  const mutation = useMutation({
    mutationFn: formData => api.post('/material-requests', formData),
    onSuccess: () => {
      toast.success('Material request submitted successfully!');
      reset();
      router.back();
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = data => {
    mutation.mutate(data);
  };

  return (
    <AsideContainer>
      <div className="flex flex-col justify-between items-center my-5">
        {/* Header */}
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
            Create Material Request
          </h1>
        </div>

        {/* Form */}
        <div className="w-full p-5 bg-white rounded-lg shadow-md mt-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {/* Site */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Site
                </label>
                <Controller
                  name="siteId"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      isLoading={sitesLoading}
                      options={sitesData.map(s => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      placeholder="Select Site"
                    />
                  )}
                />
                {errors.siteId && (
                  <p className="text-red-500 text-sm">
                    {errors.siteId.message}
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Purpose
                </label>
                <Input placeholder="Purpose" {...register('purpose')} />
                {errors.purpose && (
                  <p className="text-red-500 text-sm">
                    {errors.purpose.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Priority
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                      ]}
                      placeholder="Select Priority"
                    />
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Materials
              </label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-x-4 items-center"
                >
                  {/* Material */}
                  <Controller
                    name={`materials.${index}.materialId`}
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        value={field.value}
                        onChange={field.onChange}
                        isLoading={materialsLoading}
                        options={materialsData.map(m => ({
                          value: m.id,
                          label: m.name,
                        }))}
                        placeholder="Select Material"
                      />
                    )}
                  />
                  {errors.materials?.[index]?.materialId && (
                    <p className="text-red-500 text-sm col-span-5">
                      {errors.materials[index].materialId.message}
                    </p>
                  )}

                  {/* Quantity */}
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...register(`materials.${index}.quantity`)}
                  />
                  {errors.materials?.[index]?.quantity && (
                    <p className="text-red-500 text-sm col-span-5">
                      {errors.materials[index].quantity.message}
                    </p>
                  )}

                  {/* Remove Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={() => append({ materialId: '', quantity: '' })}
                className="flex items-center gap-1 text-secondary hover:text-primary bg-primary hover:bg-secondary px-3 py-2 rounded-full transition duration-300"
              >
                <FiPlus /> Add Material
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-auto bg-secondary text-primary px-4 py-2 mt-4 float-end rounded-full"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </div>
      </div>
    </AsideContainer>
  );
}
