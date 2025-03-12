"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, styled } from "@mui/material";
import { toast } from "sonner";
import Link from "next/link";
import AsideContainer from "../../../components/AsideContainer";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Add } from "@mui/icons-material";

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    "backgroundColor": "#f8fbfc",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    "backgroundColor": "#eee9da",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
}));

const ClientTable = () => {
  const router = useRouter();
  const [clientList, setClientList] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [clientId, setclientId] = useState(null);
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const columns = [
    { field: "seriel", headerName: "S. No.", width: 140 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 340 },
    { field: "phone", headerName: "Phone", width: 200 },
    { field: "address", headerName: "Address", width: 260 },
  ];
  useEffect(() => {
    getAllClient();
  }, []);

  const getAllClient = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/client/getall`)
      .then(response => {
        setClientList(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormData = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const deleteClient = () => {
    deleteHandler();
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/client/delete/${clientId}`
      )
      .then(response => {
        if (response) {
          toast("Record deleted successfully");
          getAllClient();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateFunction = id => {
    setUserId(id);
    setConfirmationOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/client/databyid/${id}`)
      .then(response => {
        if (response) {
          // console.log(response.data.data)
          setData({
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
            address: response.data.data.address,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleConfirm = () => {
    // Perform action based on authorizationStatus
    const dataUpdate = {
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/client/updatebyid`,
        dataUpdate
      )
      .then(response => {
        if (response) {
          getAllClient();
          toast(`${response.data.message}`);
        }
      })
      .catch(error => {
        console.log(error);
      });
    // Close the confirmation dialog
    setConfirmationOpen(false);
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setConfirmationOpen(false);
  };

  const deleteHandler = () => {
    setDeleteConfirm(prev => !prev);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 280,
      renderCell: params => {
        return (
          <div className="flex flex-row items-center gap-2">
            <button
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => updateFunction(params?.row?.id)}
            >
              <FiEdit className="text-xl" />
            </button>
            <button
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => {
                setclientId(params.row.id);
                deleteHandler();
              }}
            >
              <MdOutlineDelete className="text-xl" />
            </button>
          </div>
        );
      },
    },
  ];
  const arrayData = [];
  clientList?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      seriel: index + 1,
      name: row?.name,
      email: row?.email,
      phone: row?.phone,
      address: row?.address,
    });
  });
  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2">
            Client List
          </h1>
          <button
            className="bg-secondary text-primary rounded-3xl px-4 py-3 flex flex-row  items-center"
            onClick={() => router.push("/admin/clients/add")}
          >
            <Add sx={{ marginRight: "4px" }} />
            <span>Add Client</span>
          </button>
        </div>
        <StripedDataGrid
          rows={arrayData}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          getRowClassName={params =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          rowsPerPageOptions={[9]}
          localeText={{ noRowsLabel: "No Data Available..." }}
          sx={{
            "fontFamily": "ubuntu",
            "fontSize": "16px",
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": { color: "#93bfcf" },
            "& .MuiDataGrid-menuOpen": { background: "#0b192c" },
            "&.MuiDataGrid-root": {
              borderRadius: "16px",
              marginBottom: "1rem",
              // color: "#93bfcf",
              background: "#0b192c",
            },
            "& .MuiDataGrid-filler": { background: "#0b192c" },
            "& .MuiDataGrid-columnHeader": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-columnHeader--sortable": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-withBorderColor": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-menuIcon": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-sortIcon": {
              opacity: "inherit !important",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              background: "#0b192c",
              color: "#93bfcf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar":
              {
                display: "none",
              },
            "& .MuiToolbar-root ": {
              color: "#93bfcf",
            },
            "& .MuiButtonBase-root": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-overlay": {
              background: "#eee9da",
              color: "#0b192c",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />
        <Modal
          open={confirmationOpen}
          onClose={handleCancel}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white w-1/3 p-6 rounded-3xl outline-none">
            <div>
              <h3 className=" text-2xl font-semibold font-ubuntu">
                Update Client Data
              </h3>
              <hr className="my-4" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="name">Name</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="email">Email</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="email"
                  type="text"
                  name="email"
                  value={data.email}
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="phone">Phone</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="phone"
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="address">Address</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="address"
                  type="text"
                  name="address"
                  value={data.address}
                  onChange={e => handleFormData(e)}
                />
              </div>
            </div>
            <div className="flex flex-row justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="border border-secondary text-secondary rounded-full px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="border border-secondary text-primary bg-secondary rounded-full px-4 py-2"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>

        {/* confirm the deletion of client */}
        <Modal
          open={deleteConfirm}
          onClose={deleteHandler}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
            <div>
              <h3 className=" text-2xl font-semibold font-ubuntu">
                Delete Client
              </h3>
              <hr className="my-4" />
            </div>
            <h5>Are your sure you want to delete ?</h5>
            <div className="flex flex-row gap-2 justify-end mt-4">
              <button
                className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={deleteHandler}
              >
                Cancel
              </button>
              <button
                className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={deleteClient}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AsideContainer>
  );
};

export default ClientTable;
