'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AsideContainer from '../../../components/AsideContainer';
import Link from 'next/link';
import { RiUserForbidLine } from 'react-icons/ri';
import { CiViewList } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa6';
import { MdOutlineDelete } from 'react-icons/md';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';

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

const ContractorTable = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getContractors();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    {
      field: 'name',
      headerName: 'Name',
      type: 'text',
      width: 180,
    },
    { field: 'designation', headerName: 'Designation', width: 130 },
    {
      field: 'businessContactNumber',
      headerName: 'Contact Number',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 180,
    },
    {
      field: 'approvalStatus',
      headerName: 'Status',
      width: 180,
      renderCell: params => {
        return (
          <div className={`cellWithStatus ${params?.row?.approvalStatus}`}>
            {params?.row?.approvalStatus == 'Approved' ? (
              'Approved'
            ) : (
              <div className="statusButton">Pending</div>
            )}
          </div>
        );
      },
    },
  ];

  const getContractors = props => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/contractor/applications`)
      .then(resp => {
        setRows(resp?.data?.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err);
      });
  };
  const deleteContractor = id => {
    // const REACT_APP_BASE_PATH= "http://localhost:8080"
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/contractor/deleteById/${id}`
      )
      .then(resp => {
        if (resp) {
          toast(resp.data.message);
          getContractors();
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };

  const suspendDealer = id => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/contractor/suspendById/${id}`
      )
      .then(resp => {
        if (resp) {
          toast(resp.data.message);
          getContractors();
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };
  const activeDealer = id => {
    axios
      .put(`${process.env.REACT_APP_BASE_PATH}/api/contractor/activeById/${id}`)
      .then(resp => {
        if (resp) {
          toast(resp.data.message);
          getContractors();
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };
  useEffect(() => {
    getContractors();
  }, []);
  const arrayData = [];
  rows?.map(row => {
    arrayData.push({
      id: row?.id,
      name: row?.name,
      email: row?.email,
      designation: row?.designation,
      companyName: row?.companyName,
      gst: row?.gst,
      businessContactNumber: row?.businessContactNumber,
      approvalStatus: row?.approvalStatus,
      actionID: row?._id,
      userStatus: row?.userStatus,
    });
  });

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 600,
      renderCell: params => {
        return (
          <div className="flex flex-row gap-2">
            <span
              onClick={() =>
                router.push(`/admin/contractor/${params?.row?.id}`)
              }
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            >
              <CiViewList />
            </span>
            <button
              onClick={() => deleteContractor(params?.row?.id)}
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
            >
              <MdOutlineDelete />
            </button>
            {params?.row?.userStatus === 'active' ? (
              <span
                onClick={() => suspendDealer(params?.row?.id)}
                className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              >
                <RiUserForbidLine />
              </span>
            ) : (
              <span
                onClick={() => activeDealer(params?.row?.id)}
                className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              >
                <FaCheck />
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const notify = type => {
    if (type == 'success') {
      toast.success('Approved Successfully ! ', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error('Something Went Wrong ! ', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <AsideContainer>
      <div className="">
        <div className="flex flex-row justify-between items-center my-4">
          {/* <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          /> */}
          <div className="flex w-full items-center gap-1 lg:gap-2">
            <SidebarTrigger className="-ml-2 hover:bg-primary" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4 bg-black"
            />
            <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
              Contractor List
            </h1>
          </div>
          <button
            className="bg-secondary text-primary rounded-3xl px-3 py-2 text-nowrap"
            onClick={() => router.push('/admin/contractor/add')}
          >
            Add Contractor
          </button>
        </div>
        {/* <div className="datatableTitle">
       Dealer's Application List
       <NavLink to={"/admin/dealer/new"} className="addNewUserNavLink" >
       New Application
       </NavLink>
       </div> */}
        <StripedDataGrid
          rows={arrayData}
          columns={columns.concat(actionColumn)}
          getRowClassName={params =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          pageSize={9}
          rowsPerPageOptions={[9]}
          // checkboxSelection
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
      </div>
    </AsideContainer>
  );
};

export default ContractorTable;
