'use client';
import React, { useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Modal, styled } from '@mui/material';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Add } from '@mui/icons-material';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import AsideContainer from '../../../components/AsideContainer';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#f8fbfc',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
      '@media (hover: none)': { backgroundColor: 'transparent' },
    },
    '&.Mui-selected': { backgroundColor: '#93bfcf' },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: '#eee9da',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
      '@media (hover: none)': { backgroundColor: 'transparent' },
    },
    '&.Mui-selected': { backgroundColor: '#93bfcf' },
  },
}));

const tableStyles = {
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
};

const ClientTable = () => {
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [userId, setUserId] = useState('');
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const { data: clientList = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/client/getall').then(res => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.get(`/user/deactivate/${id}`),
    onSuccess: () => {
      toast('Client deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteConfirm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatedData =>
      api.put('/client/updatebyid', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: res => {
      toast(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setConfirmationOpen(false);
      setUserId('');
    },
  });

  const columns = [
    { field: 'seriel', headerName: 'S. No.', width: 100 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'email', headerName: 'Email', width: 340 },
    { field: 'phone', headerName: 'Phone', width: 200 },
    { field: 'address', headerName: 'Address', width: 260 },
    { field: 'status', headerName: 'Status', width: 92 },
  ];

  const arrayData = clientList.map((row, index) => ({
    id: row._id,
    seriel: index + 1,
    name: `${row.firstname} ${row.lastname}`,
    email: row.email,
    phone: row.phone,
    address: `${row.city} ${row.state}`,
    status: row.userStatus.charAt(0).toUpperCase() + row.userStatus.slice(1),
  }));

  const updateFunction = id => {
    setUserId(id);
    setConfirmationOpen(true);
    api.get(`/client/databyid/${id}`).then(response => {
      const c = response.data.data;
      setData({
        name: `${c.firstname} ${c.lastname}`,
        email: c.email,
        phone: c.phone,
        address: `${c.city} ${c.state}`,
      });
    });
  };

  const handleFormData = e => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    updateMutation.mutate({ id: userId, ...data });
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
  };

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 280,
      renderCell: params => (
        <div className="flex flex-row items-center gap-2">
          <button
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground"
            // onClick={() => updateFunction(params.row.id)}
            onClick={() => router.push(`/admin/clients/${params.row.id}`)}
          >
            <FiEdit className="text-xl" />
          </button>
          <button
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground"
            onClick={() => {
              setClientId(params.row.id);
              setDeleteConfirm(true);
            }}
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AsideContainer>
      <div className="flex justify-between items-center my-4">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator orientation="vertical" className="h-4 bg-black" />
          <h1 className="font-ubuntu font-bold text-[25px]">Client List</h1>
        </div>
        <button
          className="bg-secondary text-primary rounded-3xl px-4 py-3 flex items-center text-nowrap"
          onClick={() => router.push('/admin/clients/add')}
        >
          <Add sx={{ marginRight: '4px' }} />
          Add Client
        </button>
      </div>

      <StripedDataGrid
        rows={arrayData}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        getRowClassName={params =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        rowsPerPageOptions={[9]}
        localeText={{ noRowsLabel: 'No Data Available...' }}
        sx={tableStyles}
      />

      <Modal
        open={confirmationOpen}
        onClose={handleCancel}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="bg-white w-1/3 p-6 rounded-3xl">
          <h3 className="text-2xl font-semibold font-ubuntu">
            Update Client Data
          </h3>
          <hr className="my-4" />
          <div className="flex flex-col gap-2">
            {['name', 'email', 'phone', 'address'].map(field => (
              <div key={field} className="flex flex-col gap-1">
                <label className="font-semibold" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 rounded-[7px] bg-gray-100"
                  id={field}
                  name={field}
                  value={data[field] || ''}
                  onChange={handleFormData}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="border border-secondary text-secondary rounded-full px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-secondary text-primary rounded-full px-4 py-2"
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl">
          <h3 className="text-2xl font-semibold font-ubuntu">
            Deactivate Client
          </h3>
          <hr className="my-4" />
          <p>Are you sure you want to Deactivate this client?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeleteConfirm(false)}
              className="border border-secondary text-secondary rounded-full px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteMutation.mutate(clientId)}
              className="bg-secondary text-primary rounded-full px-4 py-2"
            >
              Deactivate
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default ClientTable;
