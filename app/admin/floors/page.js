"use client";
import { useEffect, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import {
  Chip,
  Button,
  Modal,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  styled,
} from "@mui/material";
import { toast } from "sonner";
import Link from "next/link";
import AsideContainer from "../../../components/AsideContainer";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
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

const ProjectFloorList = () => {
  const [data, setData] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [authorizationStatus, setAuthorizationStatus] = useState("");
  const [confirmationDelete, setConfirmationDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [floor, setFloor] = useState("");

  const columns = [
    { field: "seriel", headerName: "SNo.", width: 500 },

    { field: "name", headerName: "Floor", width: 500 },
  ];
  useEffect(() => {
    getAllFloor();
  }, []);

  const getAllFloor = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/floor/getall`)
      .then(response => {
        setData(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteFloor = id => {
    axios
      .delete(`${process.env.REACT_APP_BASE_PATH}/api/floor/delete/${id}`)
      .then(response => {
        if (response) {
          toast("Record deleted successfully");
          getAllFloor();
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
      .get(`${process.env.REACT_APP_BASE_PATH}/api/floor/databyid/${id}`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data)
          setFloor(response.data.data?.name);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleConfirm = () => {
    // Perform action based on authorizationStatus
    const data = {
      id: userId,
      floor: floor,
    };
    axios
      .put(`${process.env.REACT_APP_BASE_PATH}/api/floor/updatebyid`, data)
      .then(response => {
        if (response) {
          getAllFloor();
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

  const arrayData = [];
  data?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      seriel: index + 1,
      name: row?.name,
    });
  });
  const handleDelete = () => {
    setConfirmationDelete(prev => !prev);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 500,
      renderCell: params => {
        return (
          <div className="flex flex-row gap-2 items-center text-xl">
            <div
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => updateFunction(params?.row?.id)}
            >
              <FiEdit />
            </div>
            <div
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => {
                setUserId(params.row.id);
                handleDelete();
              }}
            >
              <MdOutlineDelete />
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2">
          Floor List
        </h1>
        <Link href="/admin/floors/add">
          <button className="bg-secondary text-primary rounded-3xl px-3 pr-5 py-3 flex flex-row gap-1 items-center">
            <Add />
            Add Floor
          </button>
        </Link>
      </div>
      <StripedDataGrid
        rows={arrayData}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        localeText={{ noRowsLabel: "No Data Available..." }}
        getRowClassName={params =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
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
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Update Floor
            </h3>
            <hr className="my-4" />
          </div>
          <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
            <label htmlFor="floor">Floor</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="floor"
              type="text"
              name="floor"
              value={floor}
              onChange={e => setFloor(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row items-center"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row items-center"
              onClick={handleConfirm}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmationDelete}
        onClose={handleDelete}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Delete Floor
            </h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleDelete}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={deleteFloor}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default ProjectFloorList;
