"use client";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
  Select,
  MenuItem,
  TableContainer,
  Paper,
} from "@mui/material";
import { toast } from "sonner";
import Link from "next/link";
import AsideContainer from "../../../../components/AsideContainer";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({
    name: "",
  });

  const columns = [
    { field: "seriel", headerName: "SNo.", width: 100 },
    { field: "name", headerName: "Name", width: 400 },
  ];
  useEffect(() => {
    getAllTaskCategory();
  }, []);

  const getAllTaskCategory = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/category/list`)
      .then(response => {
        setCategoryList(response?.data?.data);
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

  const deleteCategory = id => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/task-category/delete/${id}`
      )
      .then(response => {
        if (response) {
          toast("Record deleted successfully");
          getAllTaskCategory();
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
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/task-category/databyid/${id}`
      )
      .then(response => {
        if (response) {
          //   console.log(response.data.data)
          setData({
            name: response.data.data.name,
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
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/task-category/updatebyid`,
        dataUpdate
      )
      .then(response => {
        if (response) {
          toast(`${response.data.message}`);
          getAllTaskCategory();
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
  categoryList?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      seriel: index + 1,
      name: row?.name,
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 350,
      renderCell: params => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => updateFunction(params?.row?.id)}
            >
              Update
            </div>
            <div
              className="deleteButton"
              onClick={() => deleteCategory(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <AsideContainer>
      <div className="datatable">
        <div className="flex flex-row gap-2 justify-between items-center my-4">
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Category List
          </h1>
          <button onClick={() => router.push("/admin/tasks/category/add")}>
            Add Category
          </button>
        </div>
        <div className="bg-white">
          <DataGrid
            rows={arrayData}
            columns={columns.concat(actionColumn)}
            pageSize={9}
            getRowClassName={() => ({ color: "#fff" })}
            rowsPerPageOptions={[9]}
            localeText={{ noRowsLabel: "No Data Available..." }}
          />
        </div>
        <Dialog open={confirmationOpen} onClose={handleCancel}>
          <DialogTitle>Update Task Category</DialogTitle>
          <DialogContent style={{ width: "500px" }}>
            <DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="role"
                type="text"
                fullWidth
                name="name"
                value={data.name}
                onChange={e => handleFormData(e)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AsideContainer>
  );
};
export default Page;
