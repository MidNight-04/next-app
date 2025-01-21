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
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AsideContainer from "../../../../components/AsideContainer";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 25,
  p: 4,
};

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const Page = () => {
  // const activeUser = localStorage.getItem("activeUser");
  const activeUser = "";
  const [taskList, setTaskList] = useState([]);
  const [viewTaskOpen, setViewTaskOpen] = useState(false);
  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(formatedtoday);
  const [id, setId] = useState("");

  const columns = [
    { field: "seriel", headerName: "SNo.", width: 80 },
    { field: "title", headerName: "Title", width: 200 },
    // {
    //   field: "member",
    //   headerName: "Member",
    //   width: 250,
    //   renderCell: (params) => {
    //     return (
    //       <div className="cellAction">
    //         {`${params?.row?.memberName} (${params.row?.member})`}
    //       </div>
    //     );
    //   },
    // },
    { field: "category", headerName: "Category", width: 200 },
    { field: "priority", headerName: "Priority", width: 100 },
    // { field: "status", headerName: "Status", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: params => {
        return (
          <div className="cellAction">
            {params.row.status === "Pending" ? (
              <span className="bg-green px-1 pe-1">{params.row.status}</span>
            ) : params.row.status === "InProgress" ? (
              <span className="bg-green bg-secondary px-1 pe-1">
                {params.row.status}
              </span>
            ) : (
              <span className="bg-green bg-success px-1 pe-1">
                {params.row.status}
              </span>
            )}
          </div>
        );
      },
    },
    { field: "dueDate", headerName: "Due Date", width: 180 },
    { field: "date", headerName: "Complete Date", width: 180 },
  ];
  useEffect(() => {
    getAllTask();
  }, []);

  const getAllTask = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/task/getall`)
      .then(response => {
        setTaskList(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteTaskById = id => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      axios
        .delete(`${process.env.REACT_APP_BASE_PATH}/api/task/delete/${id}`)
        .then(response => {
          if (response) {
            toast.success("Record deleted successfully", {
              position: "top-right",
            });
            getAllTask();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const updateTaskStatus = id => {
    setId(id);
    setUpdateTaskOpen(true);
    setStatus("");
    setImage("");
    setDate(formatedtoday);
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setViewTaskOpen(false);
    setUpdateTaskOpen(false);
  };

  const handleUpdate = () => {
    if (!status) {
      toast.error("Status is required", {
        position: "top-center",
      });
    } else if (!image) {
      toast.error("Image is required", {
        position: "top-center",
      });
    } else {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", status);
      // formData.append("image", image);
      for (let i = 0; i < image?.length; i++) {
        formData.append("image", image[i]);
      }
      formData.append("date", date);
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/task/update/admin`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };
      axios
        .request(config)
        .then(resp => {
          if (resp.data.status === 200) {
            toast.success(resp?.data?.message, {
              position: "top-center",
            });
            // Close the confirmation dialog
            setUpdateTaskOpen(false);

            getAllTask();
          } else {
            toast.error(resp?.data?.message, {
              position: "top-center",
            });
          }
        })
        .catch(err => {
          toast.error("Error while update daily task", {
            position: "top-center",
          });
          console.log(err);
        });
    }
  };

  const arrayData = [];
  taskList?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      seriel: index + 1,
      title: row?.title,
      // member: row?.issueMember[0]?.name,
      // memberName: row?.issueMember[0]?.employeeID,
      category: row?.category,
      priority: row?.priority,
      status: row?.adminStatus?.status,
      dueDate: row?.dueDate,
      date: row?.adminStatus?.date,
      issueMember: row?.issueMember,
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: params => {
        return (
          <div className="cellAction">
            {/* <div
              className="viewButton"
              //   onClick={() => updateFunction(params?.row?.id)}
            >
              View
            </div> */}
            <div
              className="deleteButton"
              onClick={() => deleteTaskById(params.row.id)}
            >
              Delete
            </div>
            {/* {params?.row?.issueMember?.some(
              (obj) =>
                obj.employeeID === activeUser) && (
                  <div
                    className="deleteButton"
                    onClick={() => updateTaskStatus(params.row.id)}
                  >
                    Update
                  </div>
                )
            } */}
          </div>
        );
      },
    },
  ];
  return (
    <AsideContainer>
      <div className="datatable">
        <div className="datatableTitle detail-heading mb-3">
          <p className="project-list-client">All Task</p>
          {/* <NavLink to="/admin/teammember/add">
            <Button
              variant="contained"
              size="small"
              style={{ backgroundColor: "#fec20e", fontWeight: "600",marginTop:"-15px" }}
            >
              Add Team Member
            </Button>
          </NavLink> */}
        </div>
        <div className="bg-white w-auto]">
          <DataGrid
            rows={arrayData}
            columns={columns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            localeText={{ noRowsLabel: "No Data Available..." }}
          />
        </div>
        {/* View task details */}
        <Dialog open={viewTaskOpen} onClose={handleCancel}>
          <DialogTitle>View Task</DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* update task status */}
        <Dialog open={updateTaskOpen} onClose={handleCancel}>
          <DialogTitle>Update Task Status</DialogTitle>
          <DialogContent style={{ width: "400px" }}>
            <FormControl fullWidth className="mt-1 mb-1">
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                name="status"
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="InProgress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="mt-1 mb-1">
              <TextField
                type="file"
                name="image"
                inputProps={{ multiple: true }}
                onChange={e => setImage(e.target.files)}
              />
            </FormControl>
            <FormControl fullWidth className="mt-1 mb-1">
              <TextField type="date" name="date" value={date} disabled />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AsideContainer>
  );
};

export default Page;
