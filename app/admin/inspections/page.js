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
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa6";
// import { Tooltip } from "react-tooltip";
import { TiArrowSortedDown, TiArrowSortedUp, TiMinus } from "react-icons/ti";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import AsideContainer from "../../../components/AsideContainer";
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

const Page = () => {
  const [point, setPoint] = useState("");
  const [pointAddOpen, setPointAddOpen] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [showContent, setShowContent] = useState([]);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [newField, setNewField] = useState("");
  const [heading, setHeading] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkName, setCheckName] = useState("");
  const [checkNameAdd, setCheckNameAdd] = useState(false);
  const [uniqueStep, setUniqueStep] = useState([]);
  const [checklistItems, setChecklistItems] = useState([
    { heading: "", points: [{ point: "" }] },
  ]);

  const handleAddChecklistItem = () => {
    setChecklistItems([
      ...checklistItems,
      { heading: "", points: [{ point: "" }] },
    ]);
  };

  // Function to handle removing a checklist item
  const handleRemoveChecklistItem = indexToRemove => {
    setChecklistItems(
      checklistItems.filter((item, index) => index !== indexToRemove)
    );
  };

  const handleAddChecklistPoint = idx => {
    const newItems = [...checklistItems];
    newItems[idx].points.push({ point: "" });
    setChecklistItems(newItems);
  };

  const handleRemoveChecklistPoint = (idx, pointIdx) => {
    const newItems = [...checklistItems];
    newItems[idx].points = newItems[idx].points.filter(
      (_, index) => index !== pointIdx
    );
    setChecklistItems(newItems);
  };

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (data?.checkList) {
      setShowContent(new Array(data?.checkList?.length).fill(false));
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
    getAllCheckList();
  }, []);

  const filterUniqueNames = array => {
    const seen = new Set();
    return array.filter(item => {
      if (seen.has(item.checkListStep)) {
        return false;
      }
      seen.add(item.checkListStep);
      return true;
    });
  };

  const getAllCheckList = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/checklist/all`)
      .then(response => {
        setData(response?.data?.data);
        var uniqueData = filterUniqueNames(response?.data?.data);
        setUniqueStep(uniqueData);
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
        `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/delete/${id}`
      )
      .then(response => {
        if (response) {
          toast.warning("Record deleted successfully", {
            position: "top-right",
          });
          getAllCheckList();
          setOpen(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const AddNewField = (itemId, heading, name) => {
    setId(itemId);
    setHeading(heading);
    setCheckName(name);
    setPointAddOpen(true);
  };
  const AddNewCheckName = (itemId, name) => {
    setCheckNameAdd(true);
    setId(itemId);
    setCheckName(name);
    setAddFieldOpen(true);
    setNewField("");
    setChecklistItems([{ heading: "", points: [{ point: "" }] }]);
  };
  const confirmDeleteField = (itemId, heading, checkName, checkPoint) => {
    setId(itemId);
    setHeading(heading);
    setCheckName(checkName);
    setNewField(checkPoint);
    setDeleteDialogOpen(true);
  };
  const DeleteField = () => {
    const data = {
      id: id,
      heading: heading,
      name: checkName,
      point: newField,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/deletepoint`,
        data
      )
      .then(response => {
        if (response) {
          toast.success(response.data.message, {
            position: "top-right",
          });
          setDeleteDialogOpen(false);
          getAllCheckList();
        }
      })
      .catch(error => {
        toast.error("Error while delete checklist point", {
          position: "top-right",
        });
        console.log(error);
      });
  };
  const handleFieldCancel = () => {
    setAddFieldOpen(false);
  };
  const handlePointAddCancel = () => {
    setPointAddOpen(false);
  };
  const handleUpdateNewField = () => {
    const isAnyHeadingEmpty = checklistItems.some(item => !item.heading.trim());
    if (isAnyHeadingEmpty) {
      toast.error("Checklist heading is required", {
        position: "top-center",
      });
      return; // Exit early if any heading is empty
    }
    // Check if any checklist item point is empty
    const isAnyPointEmpty = checklistItems.some(item =>
      item.points.some(point => !point.point.trim())
    );
    if (isAnyPointEmpty) {
      toast.error("Checklist point is required", {
        position: "top-center",
      });
      return; // Exit early if any point is empty
    } else {
      const data = {
        id: id,
        name: checkName,
        checkList: checklistItems,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/addpoint`,
          data
        )
        .then(response => {
          if (response) {
            toast.success(response.data.message, {
              position: "top-right",
            });
            setAddFieldOpen(false);
            getAllCheckList();
            setChecklistItems([{ heading: "", points: [{ point: "" }] }]);
          }
        })
        .catch(error => {
          toast.error("Error while add checklist", {
            position: "top-right",
          });
          console.log(error);
        });
    }
  };
  const handleSubmitPoint = () => {
    if (!point) {
      toast.error("Point is required", {
        position: "top-right",
      });
    } else {
      const data = {
        id: id,
        name: checkName,
        heading: heading,
        point: point,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/addextrapoint`,
          data
        )
        .then(response => {
          if (response) {
            toast.success(response.data.message, {
              position: "top-right",
            });
            setPointAddOpen(false);
            getAllCheckList();
            setPoint("");
          }
        })
        .catch(error => {
          toast.error("Error while add checklist", {
            position: "top-right",
          });
          console.log(error);
        });
    }
  };
  return (
    <>
      <AsideContainer>
        <div className="datatableTitle detail-heading">
          <p className="project-list-client">Check List</p>
          {/* <NavLink to="/admin/project/checklist/add">
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#fec20e",
                fontWeight: "600",
                marginTop: "-15px",
              }}
            >
              Add CheckList
            </Button>
          </NavLink> */}
        </div>
        <div className="row mt-4">
          {uniqueStep?.map((itm, idx) => {
            return (
              <>
                <p key={idx} className="project-list-client">
                  {itm.checkListStep}
                  {` Checklist`}
                </p>
                {data
                  ?.filter(dt => dt.checkListStep === itm.checkListStep)
                  ?.map((item, index) => {
                    return (
                      <div key={index} className="col-lg-12">
                        <div className="v-progress">
                          <div className="project-step-heading">
                            <span className="head">{item.name}</span>
                            <span>
                              {showContent[index] ? (
                                <TiArrowSortedUp
                                  className="icon fs-2 "
                                  onClick={() => toggleContent(index)}
                                />
                              ) : (
                                <TiArrowSortedDown
                                  className="icon fs-2 "
                                  onClick={() => toggleContent(index)}
                                />
                              )}
                              {/* <span
                                className="process-delete"
                                onClick={() => confirmDelete(item?._id)}
                              >
                                Delete
                              </span> */}
                            </span>
                          </div>
                          {showContent[index] && (
                            <>
                              {" "}
                              <span
                                className="float-end text-light fw-bold mb-2"
                                style={{
                                  backgroundColor: "#fec20e",
                                  padding: "0px 4px",
                                }}
                              >
                                <FaPlus
                                  className="icon fs-5"
                                  onClick={() =>
                                    AddNewCheckName(item?._id, item?.name)
                                  }
                                  data-tooltip-id="my-tooltipname"
                                  data-tooltip-content="Add Point"
                                  data-tooltip-place="top"
                                />
                                {/* <Tooltip
                                  id="my-tooltipname"
                                  className="bg-success p-1"
                                  style={{ fontSize: "12px" }}
                                /> */}
                              </span>
                              <ul>
                                {item.checkList?.map((itm, idx) => {
                                  return (
                                    <div key={idx}>
                                      <div className="mb-3 mt-4">
                                        {itm.heading}
                                        <FaPlus
                                          className="icon mx-2"
                                          onClick={() =>
                                            AddNewField(
                                              item?._id,
                                              itm?.heading,
                                              item?.name
                                            )
                                          }
                                          data-tooltip-id="my-tooltip1"
                                          data-tooltip-content="Add new point"
                                          data-tooltip-place="top"
                                        />
                                        {/* <Tooltip id="my-tooltip1" /> */}
                                      </div>
                                      {itm?.points?.map((dt, pointIdx) => {
                                        return (
                                          <li
                                            key={pointIdx}
                                            className="v-progress-item inprogress"
                                          >
                                            {dt?.point}
                                            <TiMinus
                                              className="icon mx-2 "
                                              onClick={() =>
                                                confirmDeleteField(
                                                  item?._id,
                                                  itm?.heading,
                                                  item?.name,
                                                  dt?.point
                                                )
                                              }
                                              data-tooltip-id="my-tooltip2"
                                              data-tooltip-content="Delete point"
                                              data-tooltip-place="top"
                                            />
                                            {/* <Tooltip id="my-tooltip2" /> */}
                                          </li>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </>
            );
          })}
          {uniqueStep?.length === 0 && (
            <p className="text-center mt-5">No record available</p>
          )}
        </div>
      </AsideContainer>
      {/* Dialog for  delete */}
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
        <DialogTitle>Add Inspection Point</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          {checklistItems.map((item, index) => (
            <FormControl
              fullWidth
              key={index}
              className="p-2 rounded-1 mb-2 check-container mt-1"
            >
              <Typography>
                <span>
                  Heading
                  <span className="text-danger">*</span>
                </span>
                {index === checklistItems.length - 1 && (
                  <span onClick={handleAddChecklistItem}>
                    <FaPlus className="fs-5 fw-bold text-success float-end m-1" />
                  </span>
                )}
                {index !== 0 && (
                  <span onClick={() => handleRemoveChecklistItem(index)}>
                    <FaMinus className="fs-5 fw-bold text-danger float-end m-1" />
                  </span>
                )}
              </Typography>
              <TextField
                placeholder="Enter Heading"
                name="heading"
                value={item.heading}
                onChange={e => {
                  const newItems = [...checklistItems];
                  newItems[index].heading = e.target.value;
                  setChecklistItems(newItems);
                }}
              />
              {item?.points?.map((itm, idx) => {
                return (
                  <FormControl fullWidth key={idx} className="mt-2">
                    <Typography>
                      <span>
                        Point {` ${idx + 1}`}
                        <span className="text-danger">*</span>
                      </span>
                      {idx === item.points?.length - 1 && (
                        <span onClick={() => handleAddChecklistPoint(index)}>
                          <FaPlus className="fs-5 fw-bold text-success float-end m-1" />
                        </span>
                      )}
                      {idx !== 0 && (
                        <span
                          onClick={() => handleRemoveChecklistPoint(index, idx)}
                        >
                          <FaMinus className="fs-5 fw-bold text-danger float-end m-1" />
                        </span>
                      )}
                    </Typography>
                    <TextField
                      placeholder="Enter checklist point ..."
                      name="point"
                      value={itm.point}
                      onChange={e => {
                        const newItems = [...checklistItems];
                        newItems[index].points[idx].point = e.target.value;
                        setChecklistItems(newItems);
                      }}
                    />
                  </FormControl>
                );
              })}
            </FormControl>
          ))}
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

      {/* dialog for add point */}
      <Dialog open={pointAddOpen} onClose={handlePointAddCancel}>
        <DialogTitle>Add New Point</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="role"
              type="text"
              fullWidth
              name="point"
              value={point}
              onChange={e => setPoint(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePointAddCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitPoint} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
