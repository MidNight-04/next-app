'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled, Modal } from '@mui/material';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '../../../lib/api';
import AsideContainer from '../../../components/AsideContainer';
import { Add } from '@mui/icons-material';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';

const schema = yup.object().shape({
  name: yup.string().required('Role is required'),
});

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#f8fbfc',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
    },
    '&.Mui-selected': { backgroundColor: '#93bfcf' },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: '#eee9da',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
    },
    '&.Mui-selected': { backgroundColor: '#93bfcf' },
  },
}));

const RoleDataTable = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationDelete, setConfirmationDelete] = useState(false);
  const [userId, setUserId] = useState('');

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () =>
      api.get('/api/role/getall').then(res => res.data.data),
  });

  const addMutation = useMutation({
    mutationFn: data => api.post('/api/role/add', data),
    onSuccess: res => {
      toast.success(res.data.message);
      reset();
      queryClient.invalidateQueries(['roles']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: data => api.put('/api/role/updatebyid', data),
    onSuccess: res => {
      toast.success(res.data.message);
      setConfirmationOpen(false);
      queryClient.invalidateQueries(['roles']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/api/role/delete/${id}`),
    onSuccess: () => {
      toast.success('Role deleted');
      queryClient.invalidateQueries(['roles']);
    },
  });

  const openEditModal = id => {
    const role = roles.find(r => r._id === id);
    setUserId(id);
    setValue('name', role.name);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(userId);
    setConfirmationDelete(false);
  };

  const rows = roles.map((r, i) => ({
    id: r._id,
    seriel: i + 1,
    name: r.name,
  }));

  const columns = [
    { field: 'seriel', headerName: 'SNo.', width: 500 },
    { field: 'name', headerName: 'Role', width: 500 },
    {
      field: 'action',
      headerName: 'Action',
      width: 500,
      renderCell: params => (
        <div className="flex flex-row gap-2 items-center text-xl">
          <div
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            onClick={() => openEditModal(params.row.id)}
          >
            <FiEdit />
          </div>
          <div
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            onClick={() => {
              setUserId(params.row.id);
              setConfirmationDelete(true);
            }}
          >
            <MdOutlineDelete />
          </div>
        </div>
      ),
    },
  ];

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2">
          Role List
        </h1>
        <Link href="/admin/roles/add">
          <button className="bg-secondary text-primary rounded-3xl px-3 pr-5 py-3 flex flex-row gap-1 items-center">
            <Add />
            Add Role
          </button>
        </Link>
      </div>

      <StripedDataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        localeText={{ noRowsLabel: 'No Data Available...' }}
        getRowClassName={params =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        sx={{
          fontFamily: 'ubuntu',
          fontSize: '16px',
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeaderTitle': { color: '#93bfcf' },
          '& .MuiDataGrid-menuOpen': { background: '#0b192c' },
          '&.MuiDataGrid-root': {
            borderRadius: '16px',
            marginBottom: '1rem',
            // color: "#93bfcf",
            background: '#0b192c',
          },
          '& .MuiDataGrid-filler': { background: '#0b192c' },
          '& .MuiDataGrid-columnHeader': {
            background: '#0b192c',
            color: '#93bfcf',
          },
          '& .MuiDataGrid-columnHeader--sortable': {
            color: '#93bfcf',
          },
          '& .MuiDataGrid-withBorderColor': {
            color: '#93bfcf',
          },
          '& .MuiDataGrid-menuIcon': {
            background: '#0b192c',
            color: '#93bfcf',
          },
          '& .MuiDataGrid-columnHeaders': {
            background: '#0b192c',
            color: '#93bfcf',
          },
          '& .MuiDataGrid-sortIcon': {
            opacity: 'inherit !important',
            color: '#93bfcf',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            background: '#0b192c',
            color: '#93bfcf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar':
            {
              display: 'none',
            },
          '& .MuiToolbar-root ': {
            color: '#93bfcf',
          },
          '& .MuiButtonBase-root': {
            color: '#93bfcf',
          },
          '& .MuiDataGrid-overlay': {
            background: '#eee9da',
            color: '#0b192c',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      />

      {/* Update Modal */}
      <Modal open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none m-auto mt-20">
          <h3 className="text-2xl font-semibold font-ubuntu">Update Role</h3>
          <hr className="my-4" />
          <form
            onSubmit={handleSubmit(data =>
              updateMutation.mutate({ id: userId, role: data.name })
            )}
            className="flex flex-col gap-4"
          >
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2"
                onClick={() => setConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-secondary text-primary rounded-3xl px-4 py-2"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={confirmationDelete}
        onClose={() => setConfirmationDelete(false)}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none m-auto mt-20">
          <h3 className="text-2xl font-semibold font-ubuntu">Delete Role</h3>
          <hr className="my-4" />
          <p>Are you sure you want to delete this role?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2"
              onClick={() => setConfirmationDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default RoleDataTable;
