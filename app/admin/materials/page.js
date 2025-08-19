'use client';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material';
import AsideContainer from '../../../components/AsideContainer';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import { useRouter } from 'next/navigation';
import { Add } from '@mui/icons-material';
import api from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { FiEdit } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { FaCheck } from 'react-icons/fa6';

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

const columns = [
  { field: 'seriel', headerName: 'S. No.', width: 140 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 300 },
  { field: 'status', headerName: 'Status', width: 140 },
];

const Page = () => {
  const router = useRouter();
  const { data = [], isLoading } = useQuery({
    queryKey: ['allmaterials'],
    queryFn: async () => {
      const response = await api.get('/material/getallmaterials');
      return response.data;
    },
  });

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 280,
      renderCell: params => (
        <div className="flex flex-row items-center gap-2">
          <button
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground"
            onClick={() => router.push('/admin/vendors/' + params.row.id)}
          >
            <FiEdit className="text-xl" />
          </button>
          <button
            className="p-2 rounded-full border border-primary text-primary bg-primary-foreground"
            onClick={() => {}}
          >
            {params.row.status !== 'Active' ? (
              <FaCheck className="text-xl" />
            ) : (
              <RxCross2 className="text-xl" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
            Vendors List
          </h1>
        </div>
        <button
          className="ml-auto bg-secondary text-primary px-3 py-2 rounded-full text-nowrap flex items-center gap-1 hover:bg-primary hover:text-secondary transition duration-300"
          onClick={() => router.push(`/admin/materials/addmaterial`)}
        >
          <Add />
          <span>Add Material</span>
        </button>
      </div>
      <div>
        <StripedDataGrid
          rows={data.map((vendor, i) => ({
            ...vendor,
            id: vendor._id,
            seriel: i + 1,
            status: vendor.isActive ? 'Active' : 'Inactive',
          }))}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          getRowClassName={params =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          rowsPerPageOptions={[9]}
          localeText={{ noRowsLabel: 'No Data Available...' }}
          sx={tableStyles}
        />
      </div>
    </AsideContainer>
  );
};

export default Page;
