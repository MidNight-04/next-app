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
  MenuItem,
  Select,
} from "@mui/material";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp, TiMinus } from "react-icons/ti";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import AsideContainer from "../../../../../components/AsideContainer";
import { useAuthStore } from "../../../../../store/useAuthStore";
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

const SingleProjectChecklistView = () => {
  const { slug } = useParams();
  const router = useRouter();
  const isAuth = useAuthStore(state => state.isAuth);
  const activeUser = useAuthStore(state => state.userId);
  const userName = useAuthStore(state => state.username);
  const [point, setPoint] = useState("");
  const [status, setStatus] = useState("");
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
  const [step, setStep] = useState("");
  const [number, setNumber] = useState(0);
  const [checklistItems, setChecklistItems] = useState([
    { heading: "", points: [{ point: "", check: false, status: "" }] },
  ]);

  const handleAddChecklistItem = () => {
    setChecklistItems([
      ...checklistItems,
      { heading: "", points: [{ point: "", check: false, status: "" }] },
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
    newItems[idx].points.push({ point: "", check: false, status: "" });
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
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        setData(response?.data?.data[0]?.inspections);
        var uniqueData = filterUniqueNames(
          response?.data?.data[0]?.inspections
        );
        setUniqueStep(uniqueData);
        // console.log(response?.data?.data[0]);
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
          toast("Record deleted successfully");
          getAllCheckList();
          setOpen(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const AddNewField = (step, heading, name, number) => {
    setId(slug);
    setStep(step);
    setHeading(heading);
    setCheckName(name);
    setNumber(number);
    setPointAddOpen(true);
  };
  const AddNewCheckName = (step, name, number) => {
    setCheckNameAdd(true);
    setId(slug);
    setStep(step);
    setCheckName(name);
    setNumber(number);
    setAddFieldOpen(true);
    setNewField("");
    setChecklistItems([
      { heading: "", points: [{ point: "", check: false, status: "" }] },
    ]);
  };
  const confirmDeleteField = (step, heading, name, number, point) => {
    setId(slug);
    setStep(step);
    setHeading(heading);
    setCheckName(name);
    setNumber(number);
    setNewField(point);
    setDeleteDialogOpen(true);
  };
  const DeleteField = () => {
    const data = {
      id: id,
      checkListStep: step,
      heading: heading,
      name: checkName,
      number: number,
      point: newField,
      siteID: slug,
      date: formatedtoday,
      userName: userName,
      activeUser: activeUser,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/singleproject/checklist/deletepoint`,
        data
      )
      .then(response => {
        if (response.data.status === 200) {
          toast(`${response.data.message}`);
          setDeleteDialogOpen(false);
          getAllCheckList();
        }
      })
      .catch(error => {
        toast("Error while delete checklist point", {
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
      toast("Inspection heading is required", {
        position: "top-center",
      });
      return; // Exit early if any heading is empty
    }
    // Check if any checklist item point is empty
    const isAnyPointEmpty = checklistItems.some(item =>
      item.points.some(point => !point.point.trim())
    );
    if (isAnyPointEmpty) {
      toast("Inspection point is required", {
        position: "top-center",
      });
      return; // Exit early if any point is empty
    }
    // Check if any checklist item status is empty
    const isAnyStatusEmpty = checklistItems.some(item =>
      item.points.some(point => !point.status.trim())
    );
    if (isAnyStatusEmpty) {
      toast("Inspection status is required", {
        position: "top-center",
      });
      return; // Exit early if any point is empty
    } else {
      const data = {
        id: id,
        checkListStep: step,
        name: checkName,
        number: number,
        checkList: checklistItems,
        siteID: slug,
        date: formatedtoday,
        userName: userName,
        activeUser: activeUser,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/singleproject/checklist/addpoint`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message, {
              position: "top-right",
            });
            setAddFieldOpen(false);
            getAllCheckList();
            setChecklistItems([
              {
                heading: "",
                points: [{ point: "", check: false, status: "" }],
              },
            ]);
          }
        })
        .catch(error => {
          toast("Error while add Inspection");
          console.log(error);
        });
    }
  };
  const handleSubmitPoint = () => {
    if (!point) {
      toast("Point is required", {
        position: "top-right",
      });
    } else if (!status) {
      toast("Status is required", {
        position: "top-right",
      });
    } else {
      const data = {
        id: id,
        checkListStep: step,
        name: checkName,
        heading: heading,
        number: number,
        point: point,
        status: status,
        siteID: slug,
        date: formatedtoday,
        userName: userName,
        activeUser: activeUser,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/singleproject/checklist/addextrapoint`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message, {
              position: "top-right",
            });
            setPointAddOpen(false);
            getAllCheckList();
            setPoint("");
            setStatus("");
          }
        })
        .catch(error => {
          toast("Error while add Inspection");
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      <div className="flex flex-col my-4 -md:flex-col -md:pl-0 -md:my-2">
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Project Details
          </h1>
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
        <div className="flex flex-row gap-2 items-center justify-center">
          {uniqueStep?.map((itm, idx) => {
            return (
              <>
                <p key={idx} className="project-list-client">
                  {itm.checkListStep}
                  {` Inspections`}
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
                                    AddNewCheckName(
                                      item?.checkListStep,
                                      item?.name,
                                      item?.checkListNumber
                                    )
                                  }
                                  data-tooltip-id="my-tooltipname"
                                  data-tooltip-content="Add Point"
                                  data-tooltip-place="top"
                                />
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
                                              item?.checkListStep,
                                              itm?.heading,
                                              item?.name,
                                              item?.checkListNumber
                                            )
                                          }
                                          data-tooltip-id="my-tooltip1"
                                          data-tooltip-content="Add new point"
                                          data-tooltip-place="top"
                                        />
                                      </div>
                                      {itm?.points?.map((dt, pointIdx) => {
                                        return (
                                          <li
                                            key={pointIdx}
                                            className="v-progress-item inprogress"
                                            style={{ marginBottom: "20px" }}
                                          >
                                            <span style={{ display: "flex" }}>
                                              <p style={{ marginTop: "1px" }}>
                                                {dt?.point}
                                                {dt?.status?.toLowerCase() ===
                                                "mandatory" ? (
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </p>
                                              <TiMinus
                                                className="icon mx-2 "
                                                onClick={() =>
                                                  confirmDeleteField(
                                                    item?.checkListStep,
                                                    itm?.heading,
                                                    item?.name,
                                                    item?.checkListNumber,
                                                    dt?.point
                                                  )
                                                }
                                                data-tooltip-id="my-tooltip2"
                                                data-tooltip-content="Delete point"
                                                data-tooltip-place="top"
                                              />
                                            </span>
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
            <p className="text-warning text-center mt-5">
              No inspections available in project...
            </p>
          )}
        </div>
      </div>
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
                    <div className="border p-2 rounded-1 border-warning">
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
                            onClick={() =>
                              handleRemoveChecklistPoint(index, idx)
                            }
                          >
                            <FaMinus className="fs-5 fw-bold text-danger float-end m-1" />
                          </span>
                        )}
                      </Typography>
                      <TextField
                        placeholder="Enter inspection point ..."
                        name="point"
                        value={itm.point}
                        onChange={e => {
                          const newItems = [...checklistItems];
                          newItems[index].points[idx].point = e.target.value;
                          setChecklistItems(newItems);
                        }}
                        className="w-100 mb-2"
                      />
                      <span>
                        Status <span className="text-danger">*</span>
                      </span>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={itm.status}
                        name="status"
                        onChange={e => {
                          const newItems = [...checklistItems];
                          newItems[index].points[idx].status = e.target.value;
                          setChecklistItems(newItems);
                        }}
                        className="w-100"
                      >
                        <MenuItem value="mandatory">Mandatory</MenuItem>
                        <MenuItem value="optional">Optional</MenuItem>
                      </Select>
                      {/* <TextField
                        placeholder="Enter inspection point ..."
                        name="status"
                        value={itm.status}
                        onChange={(e) => {
                          const newItems = [...checklistItems];
                          newItems[index].points[idx].status = e.target.value;
                          setChecklistItems(newItems);
                        }}
                        className="w-100"
                      /> */}
                    </div>
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
            <span>
              Point <span className="text-danger">*</span>
            </span>
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
            <span>
              Status <span className="text-danger">*</span>
            </span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
              className="w-100"
            >
              <MenuItem value="mandatory">Mandatory</MenuItem>
              <MenuItem value="optional">Optional</MenuItem>
            </Select>
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
    </AsideContainer>
  );
};
export default SingleProjectChecklistView;
