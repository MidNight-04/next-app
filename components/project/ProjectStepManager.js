// components/project/ProjectStepManager.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useAddPointMutation } from '../../hooks/useProjectDetails';

const schema = Yup.object().shape({
  pointName: Yup.string().required('Point Name is required'),
  checkList: Yup.string().required('Checklist is required'),
  duration: Yup.number().when('force', {
    is: false,
    then: schema => schema.required('Duration is required'),
  }),
  issueMember: Yup.string().required('Issue member is required'),
  prevContent: Yup.string().required('Previous content is required'),
});

export default function ProjectStepManager({ slug, userId, userName }) {
  const { mutate: addPoint, isPending } = useAddPointMutation(slug);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { force: false },
  });

  const onSubmit = data => {
    const payload = {
      ...data,
      id: slug,
      activeUser: userId,
      userName,
      date: new Date().toISOString().split('T')[0],
    };
    addPoint(payload, {
      onSuccess: res => {
        toast.success(res.message || 'Step added successfully');
        reset();
      },
      onError: err => {
        toast.error(err.message || 'Failed to add step');
      },
    });
  };

  const forceChecked = watch('force');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('pointName')} placeholder="Point Name" />
      {errors.pointName && <p>{errors.pointName.message}</p>}
      <select {...register('checkList')}>
        <option value="">Select Checklist</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      {errors.checkList && <p>{errors.checkList.message}</p>}
      {!forceChecked && (
        <>
          <input
            type="number"
            {...register('duration')}
            placeholder="Duration"
          />
          {errors.duration && <p>{errors.duration.message}</p>}
        </>
      )}
      <input type="checkbox" {...register('force')} /> Force
      <input {...register('issueMember')} placeholder="Issue Member" />
      {errors.issueMember && <p>{errors.issueMember.message}</p>}
      <textarea {...register('prevContent')} placeholder="Previous Content" />
      {errors.prevContent && <p>{errors.prevContent.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Step'}
      </button>
    </form>
  );
}
