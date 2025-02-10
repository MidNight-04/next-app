"use client";
import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Modal,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

import { cn } from "../../../lib/utils";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      // .get(`${process.env.REACT_APP_BASE_PATH}/api/constructionstep/getSteps`)
      .get(`${process.env.REACT_APP_BASE_PATH}/api/constructionstep/getAll`)
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

  console.log(data);

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

  console.log(data);

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2 -md:my-3">
          Process List
        </h1>
        <button
          className="bg-secondary text-primary rounded-3xl px-4 pr-5 py-3 flex flex-row gap-1 items-center -md:text-xs -md:px-2 -md:py-[6px] -md:[&_svg]:text-sm"
          onClick={() => router.push("/admin/construction-steps/add")}
        >
          <Add />
          <span>Add Construction Step</span>
        </button>
      </div>
      <Accordion type="single" collapsible>
        {data?.map((item, index) => {
          return (
            <AccordionItem
              key={index}
              value={item.name}
              className="bg-white w-full rounded-2xl mb-4 -md:rounded-md"
            >
              <AccordionTrigger className="flex flex-row justify-between px-4 py-2 gap-4 rounded-3xl items-center">
                <div className="flex flex-row justify-between w-full text-lg text-secondary">
                  <div className="font-semibold flex items-center">
                    {item.name}
                  </div>
                  <div className="p-2 rounded-full text-primary bg-primary-foreground border border-primary">
                    <RiDeleteBin6Line
                      onClick={() => confirmDelete(item?._id)}
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-[#efefef] pb-0">
                <div className="pt-8 w-full">
                  <table className="bg-white rounded-3xl w-full p-5">
                    <thead className="p-5 rounded-3xl">
                      <tr className="bg-secondary text-primary rounded-t-3xl p-5 pl-14">
                        <th className="w-14 text-left md:pl-24 -md:pl-16 text-lg  font-semibold -md:text-sm py-5 rounded-tl-3xl">
                          Step
                        </th>
                        <th className="-md:w-24 text-center text-lg font-semibold -md:text-sm">
                          Issue Member
                        </th>
                        <th className="w-24 text-center text-lg font-semibold -md:text-sm rounded-tr-3xl pr-5">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center px-5">
                      {item.points?.map((itm, idx) => (
                        <tr key={idx} className="px-5 text-center">
                          <td className="pl-5">
                            <span className="flex flex-row items-center gap-2 -md:gap-1 ">
                              <div className="relative -md:w-8">
                                <div className="h-full w-6 flex items-center justify-center">
                                  <span
                                    className={cn(
                                      "w-[2px] bg-secondary pointer-events-none h-10",
                                      idx === 0 ? "mt-[100%] h-5" : "",
                                      idx === item.points.length - 1
                                        ? "mb-[100%] h-5"
                                        : ""
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "w-6 h-6 absolute rounded-full shadow-xl text-center border border-dashed border-primary p-[3px]"
                                      // "before:block before:py-3 before:x-3 before:mx-3 before:border before:border-dashed before:border-red-500"
                                    )}
                                  ></span>
                                  <span className="w-4 absolute h-4 -ml-[1px] rounded-full bg-primary shadow-xl text-center" />
                                </div>
                              </div>
                              <span className="py-3 -md:p-1 truncate -md:w-24">
                                {itm.content}
                              </span>
                            </span>
                          </td>
                          <td>
                            {itm.issueMember?.map((mem, ids) => (
                              <span key={ids}>{`${mem}${
                                ids === itm.issueMember?.length - 1 ? "" : "/"
                              }`}</span>
                            ))}
                          </td>
                          <td>
                            <span className="flex flex-row items-center gap-2 -md:w-24 pr-5 justify-end">
                              <span className="p-2 rounded-full text-primary bg-primary-foreground border border-primary cursor-pointer">
                                <FaPlus
                                  onClick={() =>
                                    AddNewField(item?._id, itm?.point)
                                  }
                                  data-tooltip-id="my-tooltip1"
                                  data-tooltip-content="Add New Field"
                                  data-tooltip-place="top"
                                />
                              </span>
                              <span className="p-2 rounded-full text-primary bg-primary-foreground border border-primary cursor-pointer">
                                <TiMinus
                                  onClick={e => {
                                    e.stopPropagation();
                                    confirmDeleteField(item?._id, itm?.point);
                                  }}
                                  data-tooltip-id="my-tooltip2"
                                  data-tooltip-content="Delete Field"
                                  data-tooltip-place="top"
                                />
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {data?.length === 0 && (
        <p className="text-center mt-5">No record available</p>
      )}
      {/* <div className="w-full h-full">
        <SortableList data={data} />
      </div> */}
      {/* Dialog for process delete */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Delete Process
            </h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Add new work field Dialog */}
      <Modal
        open={addFieldOpen}
        onClose={handleFieldCancel}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white w-2/3 p-8 rounded-3xl outline-none -lg:w-4/5 -md:w-11/12">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Add New Process
            </h3>
            <hr className="my-4" />
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4 -md:grid-cols-1">
              <div className="flex flex-col gap-2 [&_label]:font-semibold ">
                <label>Step</label>
                <input
                  className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  value={newField}
                  type="text"
                  id="step"
                  placeholder="Enter Step"
                  name="step"
                  min={1}
                  onChange={e => setNewField(e.target.value)}
                />
              </div>
              <FormControl fullWidth className="mt-1 mb-1">
                <label className="font-semibold mb-2">CheckList</label>
                <Select
                  labelId="checklist-select-label"
                  id="checklist-simple-select"
                  value={checkList}
                  name="checkList"
                  onChange={e => setCheckList(e.target.value)}
                  sx={{
                    "borderRadius": "7px",
                    "background": "#f3f4f6",
                    "outline": "none",
                    "& :hover": {
                      outline: "none",
                    },
                    "& .MuiInputBase-root": {
                      "outline": "none",
                      "background": "#cfcfcf",
                      "& :hover": {
                        outline: "none",
                      },
                    },
                    "color": "#4b5563",
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #93bfcf",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #93bfcf",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #93bfcf",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "#93bfcf !important",
                    },
                  }}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>

              {checkList === "yes" && (
                <div className="flex flex-col gap-2 [&_label]:font-semibold">
                  <label>CheckList Name</label>
                  <input
                    className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                    value={checkListName}
                    type="text"
                    id="checkListName"
                    placeholder="Enter Checklist Name"
                    name="checkListName"
                    min={1}
                    onChange={e => setCheckListName(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 [&_label]:font-semibold">
                <label>Duration (In days)</label>
                <input
                  className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  value={duration}
                  type="number"
                  id="duration"
                  placeholder="Enter Duration"
                  name="duration"
                  min={1}
                  onChange={e => setCheckListName(e.target.value)}
                />
              </div>
            </div>
            <FormControl fullWidth sx={{ marginTop: "8px" }}>
              <label className="font-semibold">Issue Member</label>
              <div className="grid grid-cols-4 w-3/5 -2xl:w-full -lg:grid-cols-3 -md:grid-cols-2">
                <FormControlLabel
                  value="admin"
                  control={<Checkbox />}
                  label="Admin"
                  sx={{
                    "& svg": {
                      fill: "#93bfcf",
                    },
                  }}
                  onChange={e => memberChange(e.target.value, e.target.checked)}
                />
                {memberList?.map((data, id) => {
                  return (
                    <FormControlLabel
                      key={data.role}
                      value={data.role}
                      control={<Checkbox />}
                      label={data.role}
                      sx={{
                        "& svg": {
                          fill: "#93bfcf",
                        },
                      }}
                      onChange={e =>
                        memberChange(e.target.value, e.target.checked)
                      }
                    />
                  );
                })}
              </div>
            </FormControl>
          </div>
          <div className="flex flex-row gap-2 justify-end mt-4 font-semibold">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleFieldCancel}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleUpdateNewField}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Dialog for field delete */}
      <Modal
        open={deleteDialogOpen}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">Delete Step</h3>
            <hr className="my-4" />
          </div>
          <h5>Are your sure you want to delete ?</h5>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={DeleteField}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default ConstructionStepTable;
