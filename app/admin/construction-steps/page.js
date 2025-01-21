"use client";
import React, { useEffect, useState, useRef } from "react";
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
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa6";
// import { Tooltip } from "react-tooltip";
import { TiMinus } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";
import AsideContainer from "../../../components/AsideContainer";
import { DndContext, useDraggable } from "@dnd-kit/core";
import SortableList from "../../../components/DND/List";

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

const ConstructionStepTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [showContent, setShowContent] = useState([]);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState("");
  const [point, setPoint] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [issueMember, setIssueMember] = useState([]);
  const [checkList, setCheckList] = useState("");
  const [checkListName, setCheckListName] = useState("");
  const [duration, setDuration] = useState("");
  const [currentRotate, setCurrentRotate] = useState(0);

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (data?.points) {
      setShowContent(new Array(data?.points?.length).fill(false));
    }
  }, [data]);

  const toggleContent = index => {
    setShowContent(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    getAllConstructionStep();
  }, []);

  const getAllConstructionStep = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/constructionstep/getSteps`)
      .then(response => {
        setData(response?.data?.data);
        // setData(response?.data?.data?.sort((a, b) => a.priority - b.priority));
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
        setData([]);
      });
  };

  const confirmDelete = id => {
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setDeleteDialogOpen(false);
  };
  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/constructionstep/delete/${id}`
      )
      .then(response => {
        if (response) {
          toast.warning("Record deleted successfully", {
            position: "top-right",
          });
          getAllConstructionStep();
          setOpen(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const AddNewField = (itemId, point) => {
    setId(itemId);
    setPoint(point);
    setAddFieldOpen(true);
    setNewField("");
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        if (response) {
          const uniqueRoles = response.data.data.filter(
            (user, index, self) =>
              index === self.findIndex(u => u.role === user.role)
          );
          setMemberList(uniqueRoles);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const confirmDeleteField = (itemId, point) => {
    setId(itemId);
    setPoint(point);
    setDeleteDialogOpen(true);
  };
  const DeleteField = () => {
    const data = {
      id: id,
      point: point,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/constructionstep/deletefield`,
        data
      )
      .then(response => {
        if (response) {
          toast.success("Construction field deleted successfully", {
            position: "top-right",
          });
          setDeleteDialogOpen(false);
          getAllConstructionStep();
        }
      })
      .catch(error => {
        toast.error("Error while delete construction field", {
          position: "top-right",
        });
        console.log(error);
      });
  };
  const handleFieldCancel = () => {
    setAddFieldOpen(false);
    setIssueMember([]);
    setNewField("");
    setCheckList("");
    setCheckListName("");
    setDuration("");
  };
  const handleUpdateNewField = () => {
    if (!newField) {
      toast.error("New field is required", {
        position: "top-center",
      });
    } else if (!checkList) {
      toast.error("Check List status is required", {
        position: "top-center",
      });
    } else if (checkList === "yes" && !checkListName) {
      toast.error("CheckList name is required", {
        position: "top-center",
      });
    } else if (!duration) {
      toast.error("Duration is required", {
        position: "top-center",
      });
    } else if (issueMember?.length === 0) {
      toast.error("Issue member is required", {
        position: "top-center",
      });
    } else {
      const data = {
        id: id,
        previousPoint: point,
        newField: newField,
        checkList: checkList,
        checkListName: checkListName,
        duration: parseInt(duration),
        issueMember: issueMember,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/constructionstep/addnewfield`,
          data
        )
        .then(response => {
          if (response) {
            toast.success("New construction field added successfully", {
              position: "top-right",
            });
            getAllConstructionStep();
            setAddFieldOpen(false);
          }
        })
        .catch(error => {
          toast.error("Error while add new construction field", {
            position: "top-right",
          });
          console.log(error);
        });
    }
  };

  const memberChange = (value, isChecked) => {
    if (isChecked) {
      // Add role if checked
      if (!issueMember.includes(value)) {
        setIssueMember(prev => [...prev, value]);
      }
    } else {
      // Remove role if unchecked
      setIssueMember(prev =>
        prev.filter(selectedRole => selectedRole !== value)
      );
    }
  };

  return (
    <AsideContainer>
      <div className="datatableTitle detail-heading">
        <h1 className="font-ubuntu font-bold text-[25px] leading-7">
          Process List
        </h1>
        <span>
          <Link href="/admin/construction-steps/add">
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#fec20e",
                fontWeight: "600",
                marginTop: "-15px",
              }}
            >
              Add Process
            </Button>
          </Link>
        </span>
      </div>
      {/* {data?.map((item, index) => {
        return (
          <div key={index} className="bg-white w-full ">
            <div className="flex flex-row justify-between p-3 gap-4">
              <span className="head">{item.name}</span>
              {showContent[index] ? (
                <FaMinus
                  className="icon"
                  onClick={() => toggleContent(index)}
                />
              ) : (
                <FaPlus className="icon" onClick={() => toggleContent(index)} />
              )}
              <RiDeleteBin6Line
                className="me-2 fs-5 text-danger"
                onClick={() => confirmDelete(item?._id)}
                style={{ cursor: "pointer" }}
              />
            </div>
            {showContent[index] && (
              <ul>
                {item.points?.map((itm, idx) => {
                  return (
                    <li key={idx} className="bg-white w-full">
                      {`${itm.content} (`}
                      <span className="fw-bold">{`Issue Member - `}</span>
                      {itm.issueMember?.map((mem, ids) => {
                        return (
                          <>
                            <span key={ids} style={{ color: "#fec20e" }}>
                              {mem}
                            </span>
                            {ids === itm.issueMember?.length - 1 ? "" : "/"}
                          </>
                        );
                      })}
                      {`)`}
                      <FaPlus
                        className="icon mx-2"
                        onClick={() => AddNewField(item?._id, itm?.point)}
                        data-tooltip-id="my-tooltip1"
                        data-tooltip-content="Add New Field"
                        data-tooltip-place="top"
                      />
                      <TiMinus
                        className="icon"
                        onClick={() =>
                          confirmDeleteField(item?._id, itm?.point)
                        }
                        data-tooltip-id="my-tooltip2"
                        data-tooltip-content="Delete Field"
                        data-tooltip-place="top"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      {data?.length === 0 && (
        <p className="text-center mt-5">No record available</p>
      )} */}
      <div className="w-full h-full">
        <SortableList data={data} />
      </div>
      {/* Dialog for process delete */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Are you sure want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add new work field Dialog */}
      <Dialog open={addFieldOpen} onClose={handleFieldCancel}>
        <DialogTitle>Add New Step</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <FormControl fullWidth>
            <label style={{ fontSize: "18px", color: "#fec20e" }}>Step</label>
            <TextField
              name="newField"
              value={newField}
              onChange={e => setNewField(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">CheckList</InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              CheckList
            </label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={checkList}
              name="checkList"
              onChange={e => setCheckList(e.target.value)}
            >
              <MenuItem value="">-Select-</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
          {checkList === "yes" && (
            <FormControl fullWidth className="mt-1 mb-1">
              {/* <InputLabel id="demo-simple-select-label">
                CheckList Name
              </InputLabel> */}
              <label style={{ fontSize: "18px", color: "#fec20e" }}>
                CheckList Name
              </label>
              <TextField
                type="text"
                name="checkListName"
                value={checkListName}
                onChange={e => setCheckListName(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">
              Duration (In days)
            </InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Duration (In days)
            </label>
            <TextField
              type="number"
              name="duration"
              value={duration}
              min={1}
              onChange={e => {
                if (e.target.value >= 1) {
                  setDuration(e.target.value);
                } else {
                  setDuration(1);
                }
              }}
            />
          </FormControl>
          <FormControl fullWidth className="mt-3">
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Issue Member
            </label>
            <FormControlLabel
              value="admin"
              control={<Checkbox />}
              label="Admin"
              onChange={e => memberChange(e.target.value, e.target.checked)}
            />
            {memberList?.map((data, id) => {
              return (
                <FormControlLabel
                  key={id}
                  value={data.role}
                  control={<Checkbox />}
                  label={data.role}
                  onChange={e => memberChange(e.target.value, e.target.checked)}
                />
              );
            })}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFieldCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateNewField} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for field delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Are you sure want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={DeleteField} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default ConstructionStepTable;
