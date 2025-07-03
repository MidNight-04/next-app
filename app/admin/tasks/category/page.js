'use client';
import React, { useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import api from '../../../../lib/api';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  styled,
} from '@mui/material';
import { toast } from 'sonner';
import AsideContainer from '../../../../components/AsideContainer';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#f8fbfc',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: '#93bfcf',
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: '#eee9da',
    '&:hover': {
      backgroundColor: '#93bfcf',
      color: '#eee9da',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: '#93bfcf',
    },
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

const fetchCategories = async () => {
  const { data } = await api.get('/category/list');
  return data.data;
};

const updateCategory = async ({ id, name }) => {
  const { data } = await api.put('/task-category/updatebyid', { id, name });
  return data;
};

const deleteCategoryById = async id => {
  const { data } = await api.delete(`/task-category/delete/${id}`);
  return data;
};

const fetchCategoryById = async id => {
  const { data } = await api.get(`/task-category/databyid/${id}`);
  return data.data;
};

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationDelete, setConfirmationDelete] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const { data: categoryList = [], isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: data => {
      toast.success(data?.message || 'Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setConfirmationOpen(false);
    },
    onError: () => toast.error('Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryById,
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Delete failed'),
  });

  const handleEditOpen = async id => {
    try {
      const category = await fetchCategoryById(id);
      setEditData({ name: category.name });
      setEditId(id);
      setConfirmationOpen(true);
    } catch {
      toast.error('Failed to fetch category');
    }
  };

  const handleUpdate = () => {
    updateMutation.mutate({ id: editId, name: editData.name });
  };

  const handleDelete = id => {
    deleteMutation.mutate(id);
  };

  const rows = categoryList.map((item, index) => ({
    id: item._id,
    seriel: index + 1,
    name: item.name,
  }));

  const columns = [
    { field: 'seriel', headerName: 'SNo.', width: 100 },
    { field: 'name', headerName: 'Name', width: 400 },
    {
      field: 'action',
      headerName: 'Action',
      width: 350,
      renderCell: params => (
        <div className="flex flex-row gap-2 items-center">
          <div
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            onClick={() => handleEditOpen(params.row.id)}
          >
            <FiEdit className="text-xl" />
          </div>
          <div
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            onClick={() => {
              setRoleId(params.row.id);
              setConfirmationDelete(true);
            }}
          >
            <MdOutlineDelete className="text-xl" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <AsideContainer>
      <div className="datatable">
        <div className="flex flex-row gap-2 justify-between items-center my-4">
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Category List
          </h1>
          <button className='text-primary bg-secondary py-2 px-3 rounded-full' onClick={() => router.push('/admin/tasks/category/add')}>
            Add Category
          </button>
        </div>
        <div className="bg-white">
          <StripedDataGrid
            rows={rows}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            loading={isPending}
            localeText={{ noRowsLabel: 'No Data Available...' }}
            getRowClassName={params =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            sx={tableStyles}
          />
        </div>

        <Dialog
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
        >
          <DialogTitle>Update Task Category</DialogTitle>
          <DialogContent style={{ width: 500 }}>
            <DialogContentText>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                name="name"
                label="Category Name"
                value={editData.name}
                onChange={e => setEditData({ name: e.target.value })}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AsideContainer>
  );
};

export default Page;
