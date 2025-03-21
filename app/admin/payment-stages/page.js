"use client";
import { useEffect, useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { toast } from "sonner";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Link from "next/link";
import { ExpandMore } from "@mui/icons-material";
import AsideContainer from "../../../components/AsideContainer";
import { RiBuilding4Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import {
  Accordion as Saccordian,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { cn } from "../../../lib/utils";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";

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
  const [data, setData] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [Id, setId] = useState("");
  const [payment, setPayment] = useState("");
  const [stage, setStage] = useState("");
  const [prevPayment, setPrevPayment] = useState("");
  const [prevStage, setPrevStage] = useState("");
  const [showContent, setShowContent] = useState([]);
  const [status, setStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [name, setName] = useState("");
  const [index, setIndex] = useState("");
  const userType = useAuthStore(state => state.userType);
  // const userType = "ROLE_ADMIN";
  const router = useRouter();

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (data?.stages) {
      setShowContent(new Array(data?.stages?.length).fill(false));
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
    getAllPaymentStage();
    // setData(pStage);
  }, []);

  const getAllPaymentStage = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/paymentstages/getall`)
      .then(response => {
        setData(response?.data?.data);
        // console.log(response?.data?.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDeletePoint = () => {
    if (deleteStatus === "point") {
      const data = {
        id: Id,
        payment: payment,
        stage: stage,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/paymentstages/deletestage`,
          data
        )
        .then(response => {
          if (response) {
            toast(response.data.message, {
              position: "top-right",
            });
            getAllPaymentStage();
            setPayment("");
            setStage("");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (deleteStatus === "stage") {
      axios
        .delete(
          `${process.env.REACT_APP_BASE_PATH}/api/paymentstages/delete/${Id}`
        )
        .then(response => {
          if (response) {
            toast(response.data.message, {
              position: "top-right",
            });
            getAllPaymentStage();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    setDeleteOpen(false);
  };

  const handleConfirmUpdate = () => {
    const total = data[index]?.stages.reduce(
      (acc, curr) => acc + curr.payment,
      0
    );
    if (!payment) {
      toast("Payment % is required", {
        position: "top-center",
      });
    } else if (!stage) {
      toast("Payment Stage is required", {
        position: "top-center",
      });
    } else if (total + +payment - prevPayment > 100) {
      toast("Payment % cannot exceed 100.");
    } else {
      const data = {
        id: Id,
        payment: payment,
        stage: stage,
        prevPayment: prevPayment,
        prevStage: prevStage,
      };
      if (status === "edit") {
        axios
          .put(
            `${process.env.REACT_APP_BASE_PATH}/api/paymentstages/stageupdatebyid`,
            data
          )
          .then(response => {
            if (response) {
              getAllPaymentStage();
              toast(response.data.message, {
                position: "top-right",
              });
              setPrevPayment("");
              setPrevStage("");
              // Close the confirmation dialog
              setUpdateOpen(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (status === "add") {
        axios
          .put(
            `${process.env.REACT_APP_BASE_PATH}/api/paymentstages/addnewstage`,
            data
          )
          .then(response => {
            if (response) {
              getAllPaymentStage();
              toast(response.data.message, {
                position: "top-right",
              });
              setUpdateOpen(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
        setUpdateOpen(false);
      }
    }
  };

  const handleUpdateOpen = (id, pay, stge, index) => {
    setPayment(pay);
    setStage(stge);
    setPrevPayment(pay);
    setPrevStage(stge);
    setStatus("edit");
    setUpdateOpen(true);
    setId(id);
    setIndex(index);
  };
  const handleAddOpen = (id, name, index) => {
    setId(id);
    setPayment("");
    setStage("");
    setName(name);
    setStatus("add");
    setUpdateOpen(true);
    setIndex(index);
  };
  const handleConfirmDelete = (id, delPayment, deleteStage) => {
    setDeleteStatus("point");
    setId(id);
    setDeleteOpen(true);
    setPayment(delPayment);
    setStage(deleteStage);
  };
  const confirmDelete = id => {
    setDeleteStatus("stage");
    setId(id);
    setDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };
  const handleUpdateCancel = () => {
    // Close the confirmation dialog
    setUpdateOpen(false);
  };

  return (
    <AsideContainer>
      <>
        <div className="flex flex-row justify-between items-center p-4">
          <h1 className="text-xl font-semibold">Payment Stages</h1>
          {userType === "ROLE_ADMIN" && (
            <div className="mb-3 flex flex-row items-center justify-end">
              <button
                className="flex flex-row items-center p-2 pr-4 font-semibold bg-secondary border-[1px] border-secondary text-primary rounded-full cursor-pointer"
                onClick={() => router.push("/admin/payment-stages/add")}
              >
                <IoMdAdd className="text-2xl mr-1" />
                Add Payment Stages
              </button>
            </div>
          )}
        </div>
        <div className="container mt-2">
          <Saccordian type="single" collapsible>
            {data?.map((item, index) => {
              return (
                <AccordionItem
                  key={index}
                  value={item._id}
                  className="bg-white rounded-2xl mb-4"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex flex-row justify-between px-4 w-full">
                      <div className="flex flex-row items-center gap-4">
                        <div className="flex flex-row items-center p-2 text-xl bg-primary-foreground border-[1px] border-primary text-primary rounded-full">
                          <RiBuilding4Line />
                        </div>
                        <div className="text-lg font-bold text-secondary">
                          {item?.floor === "G" ? `Ground ` : `${item.floor} `}
                          Floor
                        </div>
                      </div>
                      {userType === "ROLE_ADMIN" && (
                        <div
                          className="flex flex-row items-center p-2 text-xl bg-primary-foreground border-[1px] border-primary text-primary rounded-full"
                          onClick={() => confirmDelete(item?._id)}
                        >
                          <MdDeleteOutline />
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="py-0">
                    <div className="bg-[#efefef] pt-4">
                      {userType === "ROLE_ADMIN" && (
                        <div className="mb-3 flex flex-row items-center justify-end">
                          <button
                            className="flex flex-row items-center p-2 pr-3 font-semibold bg-primary-foreground border-[1px] border-secondary text-secondary rounded-full cursor-pointer"
                            onClick={() =>
                              handleAddOpen(item?._id, item?.floor, index)
                            }
                          >
                            <IoMdAdd className="text-xl mr-1" />
                            Add New
                          </button>
                        </div>
                      )}

                      <table className="w-full">
                        <thead>
                          <tr className="flex flex-row justify-evenly bg-secondary text-primary text-lg font-semibold rounded-t-3xl py-3">
                            <th className="w-full text-center" scope="col">
                              Payment %
                            </th>
                            <th className="w-full text-center" scope="col">
                              Stages
                            </th>
                            {userType === "ROLE_ADMIN" && (
                              <th className="w-full text-center" scope="col">
                                Action
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {item?.stages?.map((itm, idx) => {
                            return (
                              <tr
                                key={itm.stage}
                                className={cn(
                                  "flex flex-row justify-evenly h-14",
                                  idx % 2
                                    ? "bg-secondary-foreground"
                                    : "bg-primary-foreground",
                                  item?.stages?.length - 1 === idx
                                    ? "rounded-b-3xl"
                                    : ""
                                )}
                              >
                                <td
                                  className={cn(
                                    "p-4 text-secondary text-sm font-semibold w-full text-center"
                                  )}
                                >
                                  {console.log(
                                    item?.stages?.length - 1 === idx
                                  )}
                                  {itm.payment}
                                </td>
                                <td
                                  className={cn(
                                    "p-4 text-secondary text-sm font-semibold w-full text-center"
                                  )}
                                >
                                  {itm.stage}
                                </td>
                                {userType === "ROLE_ADMIN" && (
                                  <td
                                    className={cn(
                                      "p-4 text-secondary text-sm font-semibold text-center w-full flex flex-row gap-4 justify-center items-center",
                                      item?.stages?.length - 1 === idx
                                        ? "rounded-br-3xl"
                                        : ""
                                    )}
                                  >
                                    <div
                                      className="flex flex-row items-center p-2 text-xl bg-primary-foreground border-[1px] border-primary text-primary rounded-full cursor-pointer"
                                      onClick={() =>
                                        handleUpdateOpen(
                                          item?._id,
                                          itm.payment,
                                          itm.stage,
                                          index
                                        )
                                      }
                                    >
                                      <FiEdit className="text-lg" />
                                    </div>
                                    <div
                                      className="flex flex-row items-center p-2 text-xl bg-primary-foreground border-[1px] border-primary text-primary rounded-full cursor-pointer"
                                      onClick={() =>
                                        handleConfirmDelete(
                                          item?._id,
                                          itm?.payment,
                                          itm.stage
                                        )
                                      }
                                    >
                                      <MdDeleteOutline />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Saccordian>
        </div>
        <Modal
          open={updateOpen}
          onClose={handleUpdateCancel}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="p-10 rounded-3xl shadow-xl bg-white w-1/3 -lg:w-2/4 -md:w-3/4 ">
            <div>
              <h3 className="text-2xl font-ubuntu text-secondary">
                {status === "edit" ? "Update" : "Add"} Payment Stages
              </h3>
              <hr className=" my-4" />
            </div>
            <div>
              <div className="flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label>Payment %</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="payment"
                  type="text"
                  name="payment"
                  value={payment}
                  onChange={e => setPayment(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="mt-2 font-semibold">Stage Point</label>
                <input
                  id="stage"
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  type="text"
                  name="stage"
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-2 justify-end">
              <button
                onClick={handleUpdateCancel}
                className="p-2  font-semibold bg-primary-foreground text-center border-[1px] border-secondary text-secondary rounded-full cursor-pointer w-[84px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="p-2  font-semibold bg-secondary text-center border-[1px] border-secondary text-primary rounded-full cursor-pointer w-[84px]"
              >
                {status === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Dialog for payment stage point delete */}
        <Dialog
          open={deleteOpen}
          onClose={handleCloseDelete}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent sx={{ width: "30rem" }}>
            <h3 className="text-lg font-semibold text-secondary">
              Are you sure want to delete ?
            </h3>
          </DialogContent>
          <DialogActions>
            <button
              className="p-2 font-semibold bg-primary-foreground text-center border-[1px] border-secondary text-secondary rounded-full cursor-pointer w-[84px]"
              onClick={handleCloseDelete}
            >
              Cancel
            </button>
            <button
              className="p-2  font-semibold bg-secondary text-center border-[1px] border-secondary text-primary rounded-full cursor-pointer w-[84px]"
              onClick={handleDeletePoint}
            >
              Delete
            </button>
          </DialogActions>
        </Dialog>
      </>
    </AsideContainer>
  );
};
export default Page;
{
  /* <div className="container mt-2">
{data?.map((item, index) => {
  return (
    <Accordion key={index}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel1bh-content`}
        id={`panel1bh-header`}
      >
        <div className="flex flex-row justify-between px-4 w-full">
          <div>
            {item?.floor === "0" ? `Ground ` : `G+${item.floor} `}
            Floor
          </div>
          <div>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => confirmDelete(item?._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleAddOpen(item?._id, item?.floor, index)}
        >
          Add
        </Button>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Payment %</th>
              <th scope="col">Stages</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {item?.stages?.map((itm, idx) => {
              return (
                <tr
                  key={idx}
                  className="flex flex-row justify-between"
                >
                  <td className="data">{itm.payment}</td>
                  <td className="data data-stage">{itm.stage}</td>
                  <td className="data-action">
                    <Button
                      color="secondary"
                      size="small"
                      variant="contained"
                      onClick={() =>
                        handleUpdateOpen(
                          item?._id,
                          itm.payment,
                          itm.stage,
                          index
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      variant="contained"
                      onClick={() =>
                        handleConfirmDelete(
                          item?._id,
                          itm?.payment,
                          itm.stage
                        )
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
})}
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick={false}
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
</div> */
}
