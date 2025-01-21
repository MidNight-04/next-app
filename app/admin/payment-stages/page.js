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
import { toast, ToastContainer } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Link from "next/link";
import { ExpandMore } from "@mui/icons-material";
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
            toast.warning(response.data.message, {
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
            toast.warning(response.data.message, {
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
      toast.error("Payment % is required", {
        position: "top-center",
      });
    } else if (!stage) {
      toast.error("Payment Stage is required", {
        position: "top-center",
      });
    } else if (total + +payment - prevPayment > 100) {
      toast.error("Payment % cannot exceed 100.");
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
              toast.success(response.data.message, {
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
              toast.success(response.data.message, {
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
      <div className="container px-4 py-2">
        <div className="flex flex-row justify-between items-center p-4">
          <p className="text-xl font-semibold">Payment Stages</p>
          <Link href="/admin/payment-stages/add">
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#fec20e",
                fontWeight: "600",
                marginTop: "-15px",
              }}
            >
              Add Payment Stages
            </Button>
          </Link>
        </div>
        <div className="container mt-2">
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
        </div>
        <Dialog open={updateOpen} onClose={handleUpdateCancel}>
          <DialogTitle>
            {status === "edit" ? "Update" : "Add"} Payment Stages
          </DialogTitle>
          <DialogContent style={{ width: "500px" }}>
            <Typography>Payment %</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="role"
              type="text"
              fullWidth
              name="payment"
              value={payment}
              onChange={e => setPayment(e.target.value)}
            />
            <Typography className="mt-2">Stage Point</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="role"
              type="text"
              fullWidth
              name="stage"
              value={stage}
              onChange={e => setStage(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdate} color="primary">
              {status === "edit" ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for payment stage point delete */}
        <Dialog
          open={deleteOpen}
          onClose={handleCloseDelete}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>Are you sure want to delete ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button onClick={handleDeletePoint} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AsideContainer>
  );
};
export default Page;
