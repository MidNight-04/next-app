'use client';
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { GripVertical } from 'lucide-react';
import { FaPlus } from 'react-icons/fa6';
import { TiMinus } from 'react-icons/ti';
import AsideContainer from '../../../components/AsideContainer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import { toast } from 'sonner';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';

const schema = yup.object().shape({
  newField: yup.string().required(),
  checkList: yup.string().required(),
  checkListName: yup.string().when('checkList', {
    is: 'yes',
    then: yup.string().required('Checklist name is required'),
  }),
  duration: yup
    .number()
    .typeError('Duration must be a number')
    .required('Duration is required'),
  issueMember: yup
    .array()
    .min(1, 'At least one issue member is required')
    .of(yup.string()),
});

const fetchConstructionSteps = async () => {
  const res = await api.get('/constructionstep/getAll');
  return res.data.data;
};

const reorderSteps = async steps => {
  const res = await api.put('/constructionstep/reorder', { steps });
  return res.data;
};

const deleteStep = async id => {
  const res = await api.delete(`/constructionstep/delete/${id}`);
  return res.data;
};

const fetchRoles = async id => {
  const res = await api.get('/roles/getAllRoles');
  return res.data.data;
};

function SortableItem({ item, onDelete, onAddField, onRemoveField }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      key={item._id}
      value={item.name}
      className="bg-white w-full rounded-2xl mb-4"
    >
      <AccordionTrigger className="flex flex-row justify-between px-4 py-2 gap-4 rounded-3xl items-center cursor-pointer">
        <div className="flex flex-row items-center gap-2 text-secondary">
          <span
            {...listeners}
            {...attributes}
            className="cursor-grab text-gray-400 hover:text-secondary"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical size={18} />
          </span>
          <span className="font-semibold text-[18px]">{item.name}</span>
        </div>
        <div className="ml-auto flex items-center">
          <span
            className="p-2 rounded-full text-primary bg-primary-foreground border border-primary"
            onClick={e => {
              e.stopPropagation();
              onDelete(item._id);
            }}
          >
            <RiDeleteBin6Line />
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="bg-[#efefef] ">
        <div className="pt-4">
          <table className="bg-white rounded-3xl w-full">
            <thead>
              <tr className="bg-secondary text-primary rounded-t-3xl">
                <th className="text-left py-4 pl-6 font-semibold text-[16px] rounded-tl-3xl">
                  Step
                </th>
                <th className="text-center font-semibold text-[16px]">
                  Issue Member
                </th>
                <th className="text-center font-semibold text-[16px]">
                  Duration
                </th>
                <th className="text-right pr-6 font-semibold text-[16px] rounded-tr-3xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {item.points?.map((pt, idx) => (
                <tr key={idx}>
                  <td className="py-3 pl-6 text-[15px] text-left">
                    {pt.content}
                  </td>
                  <td className="text-center text-sm text-muted-foreground">
                    {pt.issueMember?.join(', ')}
                  </td>
                  <td className="text-center text-sm text-muted-foreground">
                    {pt.duration ? pt.duration : 'Same'}{' '}
                    {parseInt(pt.duration) > 1 ? 'days' : 'day'}
                  </td>
                  <td className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 border border-primary rounded-full"
                        onClick={() => onAddField(item._id, pt.point)}
                      >
                        <FaPlus className="text-primary" />
                      </button>
                      <button
                        className="p-2 border border-primary rounded-full"
                        onClick={() => onRemoveField(item._id, pt.point)}
                      >
                        <TiMinus className="text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function ConstructionStepTable() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [point, setPoint] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newField: '',
      checkList: '',
      checkListName: '',
      duration: '',
      issueMember: [],
    },
  });

  const checkList = watch('checkList');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['constructionSteps'],
    queryFn: fetchConstructionSteps,
  });

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  const reorderMutation = useMutation({
    mutationFn: reorderSteps,
    onSuccess: () => {
      toast.success('Order updated');
      queryClient.invalidateQueries({ queryKey: ['constructionSteps'] });
    },
    onError: () => toast.error('Reorder failed'),
  });

  const deleteStepMutation = useMutation({
    mutationFn: deleteStep,
    onSuccess: () => {
      toast.success('Step deleted');
      queryClient.invalidateQueries({ queryKey: ['constructionSteps'] });
    },
    onError: () => toast.error('Delete failed'),
  });

  const deleteFieldMutation = useMutation({
    mutationFn: data => api.put('/constructionstep/deletefield', data),
    onSuccess: () => {
      toast.success('Field deleted');
      queryClient.invalidateQueries({ queryKey: ['constructionSteps'] });
    },
    onError: () => toast.error('Delete field failed'),
  });

  const addFieldMutation = useMutation({
    mutationFn: payload => api.put('/constructionstep/addnewfield', payload),
    onSuccess: () => {
      toast.success('New field added');
      queryClient.invalidateQueries(['constructionSteps']);
      setAddFieldOpen(false);
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i._id === active.id);
    const newIndex = items.findIndex(i => i._id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    reorderMutation.mutate(
      reordered.map((step, idx) => ({ _id: step._id, order: idx }))
    );
  };

  const openDeleteModal = (id, type, point = null) => {
    setSelectedId(id);
    setPoint(point);
    setModalType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (modalType === 'step') deleteStepMutation.mutate(selectedId);
    else if (modalType === 'field')
      deleteFieldMutation.mutate({ id: selectedId, point });
    setDeleteModalOpen(false);
  };

  const openAddField = (id, point) => {
    setSelectedId(id);
    setPoint(point);
    setAddFieldOpen(true);
    reset();
  };

  const onSubmit = values => {
    addFieldMutation.mutate({
      id: selectedId,
      previousPoint: point,
      ...values,
    });
  };

  return (
    <AsideContainer>
      <div className="flex justify-between items-center">
        <h1 className="text-[25px] font-bold py-5 font-ubuntu">
          Construction Step List
        </h1>
        <button
          onClick={() => router.push('/admin/construction-steps/add')}
          className="bg-secondary text-primary rounded-3xl px-4 py-2 font-semibold"
        >
          Add Step
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading steps</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(i => i._id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion type="single" collapsible>
              {items.map(item => (
                <SortableItem
                  key={item._id}
                  item={item}
                  onDelete={id => openDeleteModal(id, 'step')}
                  onAddField={openAddField}
                  onRemoveField={(id, point) =>
                    openDeleteModal(id, 'field', point)
                  }
                />
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Field Modal */}
      <Modal
        open={addFieldOpen}
        onClose={() => setAddFieldOpen(false)}
        // closeAfterTransition
        // slots={{ backdrop: Backdrop }}
        // slotProps={{ backdrop: { timeout: 500 } }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Fade in={addFieldOpen}>
          <div className="bg-white w-2/4 p-8 rounded-3xl mt-20 mx-auto">
            <h3 className="text-2xl font-semibold font-ubuntu">Add New Step</h3>
            <hr className="my-4" />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <Controller
                name="newField"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter Step"
                    className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  />
                )}
              />
              {errors.newField && (
                <p className="text-red-500 col-span-2">
                  {errors.newField.message}
                </p>
              )}

              <Controller
                name="checkList"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  >
                    <MenuItem value="">Select Checklist</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.checkList && (
                <p className="text-red-500 col-span-2">
                  {errors.checkList.message}
                </p>
              )}

              {checkList === 'yes' && (
                <Controller
                  name="checkListName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Checklist Name"
                      className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                    />
                  )}
                />
              )}
              {errors.checkListName && (
                <p className="text-red-500 col-span-2">
                  {errors.checkListName.message}
                </p>
              )}

              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Duration"
                    type="number"
                    className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  />
                )}
              />
              {errors.duration && (
                <p className="text-red-500 col-span-2">
                  {errors.duration.message}
                </p>
              )}

              <label className="col-span-2 font-semibold mt-4">
                Issue Members
              </label>
              <div className="grid grid-cols-4 gap-1 col-span-2">
                {roles?.map(role => (
                  <Controller
                    key={role._id}
                    name="issueMember"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={value.includes(role.name)}
                            onChange={e => {
                              if (e.target.checked)
                                onChange([...value, role.name]);
                              else onChange(value.filter(v => v !== role.name));
                            }}
                          />
                        }
                        label={role.name.toUpperCase()}
                        sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}
                      />
                    )}
                  />
                ))}
              </div>
              {errors.issueMember && (
                <p className="text-red-500 col-span-2">
                  {errors.issueMember.message}
                </p>
              )}

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-transparent text-secondary border-2 border-secondary rounded-3xl px-4 py-2 font-semibold"
                  onClick={() => setAddFieldOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary text-primary rounded-3xl px-4 py-2 font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>

      {/* Shared Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        // closeAfterTransition
        // slots={{ backdrop: Backdrop }}
        // slotProps={{ backdrop: { timeout: 500 } }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Fade in={deleteModalOpen}>
          <div className="bg-white w-1/3 p-8 rounded-3xl mx-auto">
            <h3 className="text-2xl font-semibold font-ubuntu">
              Delete {modalType === 'step' ? 'Step' : 'Field'}
            </h3>
            <hr className="my-4" />
            <p>Are you sure you want to delete this {modalType}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-transparent text-secondary border-2 border-secondary rounded-3xl px-4 py-2 font-semibold"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-secondary text-primary rounded-3xl px-4 py-2 font-semibold"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </AsideContainer>
  );
}