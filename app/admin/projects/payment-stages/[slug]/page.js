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
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useAuthStore } from "../../../../../store/useAuthStore";
import { useParams } from "next/navigation";
import AsideContainer from "../../../../../components/AsideContainer";
import { cn } from "../../../../../lib/utils";
import { IoIosArrowBack } from "react-icons/io";
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

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const Page = () => {
  // const userRole = useAuthStore(state => state.userType);
  const userRole = "client";
  const router = useRouter();
  const activeUser = useAuthStore(state => state.userId[0]);
  const userName = useAuthStore(state => state.username[0]);
  const { slug } = useParams();
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
  const [name, setName] = useState("");
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
    if (userRole?.substring(5).toLowerCase() === "client") {
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/forclient`,
          {
            siteID: slug,
            clientID: activeUser,
          }
        )
        .then(response => {
          setData(response?.data?.data);
          // console.log(response?.data?.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios
        .get(
          `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/bysiteid/${slug}`
        )
        .then(response => {
          setData(response?.data?.data);
          // console.log(response?.data?.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleDeletePoint = () => {
    console.log(Id, stage);
    const data = {
      id: Id,
      payment: payment,
      stage: stage,
      siteID: slug,
      date: formatedtoday,
      userName: userName,
      activeUser: activeUser,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/deletestage`,
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
    setDeleteOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (!payment) {
      toast.error("Payment % is required", {
        position: "top-center",
      });
    } else if (!stage) {
      toast.error("Payment Stage is required", {
        position: "top-center",
      });
    } else {
      const data = {
        id: Id,
        payment: payment,
        stage: stage,
        prevPayment: prevPayment,
        prevStage: prevStage,
        siteID: slug,
        date: formatedtoday,
        userName: userName,
        activeUser: activeUser,
      };
      if (status === "edit") {
        axios
          .get(
            `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/bysiteid/${slug}`
          )
          .then(async response => {
            // console.log(response?.data?.data[0].stages);
            var percent = parseFloat(payment);
            const filters = response?.data?.data[0].stages?.filter(
              dt => dt.stage !== stage
            );
            await filters?.map(itm => {
              percent += itm.payment;
            });
            if (percent > 100) {
              setUpdateOpen(false);
              toast.error("Overall payment percent exceed 100%", {
                position: "top-center",
              });
            } else {
              axios
                .put(
                  `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/stageupdatebyid`,
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
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (status === "add") {
        axios
          .put(
            `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/addnewstage`,
            data
          )
          .then(response => {
            if (response) {
              getAllPaymentStage();
              toast.success(response.data.message, {
                position: "top-right",
              });
              // Close the confirmation dialog
              setUpdateOpen(false);
            }
          })
          .catch(error => {
            console.log(error);
          });
        // Close the confirmation dialog
        setUpdateOpen(false);
      }
    }
  };

  const handleUpdateOpen = (id, pay, stge) => {
    setPayment(pay);
    setStage(stge);
    setPrevPayment(pay);
    setPrevStage(stge);
    setStatus("edit");
    setUpdateOpen(true);
    setId(id);
  };
  const handleAddOpen = (id, name) => {
    setId(id);
    setPayment("");
    setStage("");
    setName(name);
    setStatus("add");
    axios
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/bysiteid/${slug}`
      )
      .then(async response => {
        // console.log(response?.data?.data[0].stages);
        var percent = 0;
        await response?.data?.data[0].stages?.map(itm => {
          percent += itm.payment;
        });
        if (percent === 100) {
          setUpdateOpen(false);
          toast.error("Overall payment percent exceed 100%", {
            position: "top-center",
          });
        } else {
          setUpdateOpen(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleConfirmDelete = (id, delPayment, deleteStage) => {
    setId(id);
    setDeleteOpen(true);
    setPayment(delPayment);
    setStage(deleteStage);
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
      <div className="datatable">
        <div className="flex flex-row justify-between pt-[20px] mb-[20px] items-center">
          <div className="flex flex-row gap-2 items-center">
            <IoIosArrowBack
              className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
              onClick={() => router.back()}
            />
            <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
              Project Payment Stages
            </h1>
          </div>
        </div>
        <div>
          {data?.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  <div>
                    <div className="bg-white rounded-3xl p-5 text-secondary font-semibold text-lg text-center">
                      {item?.floor === "0" ? `Ground ` : `G+${item.floor} `}
                      Floor
                    </div>
                    {/* <p>
                      {showContent[index] ? (
                        <TiArrowSortedUp
                          className="icon fs-3"
                          onClick={() => toggleContent(index)}
                        />
                      ) : (
                        <TiArrowSortedDown
                          className="icon fs-3"
                          onClick={() => toggleContent(index)}
                        />
                      )}
                    </p> */}
                  </div>
                  {/* {showContent[index] && ( */}
                  <>
                    {userRole?.substring(5).toLowerCase() === "admin" && (
                      <span
                        className="add"
                        onClick={() => handleAddOpen(item?._id, item?.floor)}
                      >
                        Add
                      </span>
                    )}
                    <div className="bg-white  rounded-3xl mt-6">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-secondary my-5 text-primary rounded-t-3xl">
                            <th className="p-5 rounded-tl-3xl" scope="col">
                              Payment %
                            </th>
                            <th className="p-5 rounded-tr-3xl" scope="col">
                              Stages
                            </th>
                            {userRole?.substring(5).toLowerCase() ===
                            "admin" ? (
                              <th scope="col">Action</th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>

                        <tbody className="text-center">
                          {item?.stages?.map((itm, idx) => {
                            return (
                              <tr
                                key={idx}
                                className={cn(
                                  idx % 2
                                    ? "bg-secondary-foreground"
                                    : "bg-primary-foreground"
                                )}
                              >
                                <td
                                  className={cn(
                                    "p-4 text-secondary text-sm font-semibold",
                                    item?.stages?.length - 1 === idx
                                      ? "rounded-bl-3xl"
                                      : ""
                                  )}
                                >
                                  {itm.payment}
                                </td>
                                <td
                                  className={cn(
                                    "p-4 text-secondary text-sm font-semibold",
                                    item?.stages?.length - 1 === idx
                                      ? "rounded-br-3xl"
                                      : ""
                                  )}
                                >
                                  {itm.stage}
                                </td>
                                {userRole?.substring(5).toLowerCase() ===
                                "admin" ? (
                                  <td className="data-action">
                                    <span
                                      onClick={() =>
                                        handleUpdateOpen(
                                          item?._id,
                                          itm.payment,
                                          itm.stage
                                        )
                                      }
                                    >
                                      Edit
                                    </span>
                                    <span
                                      className="delete"
                                      onClick={() =>
                                        handleConfirmDelete(
                                          item?._id,
                                          itm?.payment,
                                          itm.stage
                                        )
                                      }
                                    >
                                      Delete
                                    </span>
                                  </td>
                                ) : (
                                  // <td>
                                  //   <Button
                                  //     size="small"
                                  //     variant="contained"
                                  //     color="warning"
                                  //     className="p-0"
                                  //   >
                                  //     <span
                                  //       style={{
                                  //         padding: "0px 5px",
                                  //         fontSize: "12px",
                                  //       }}
                                  //     >
                                  //       Pay Now
                                  //     </span>
                                  //   </Button>
                                  // </td>
                                  ""
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                  {/* )} */}
                </div>
              </div>
            );
          })}
        </div>
        <Dialog open={updateOpen} onClose={handleUpdateCancel}>
          <DialogTitle>
            {status === "edit" ? "Update" : "Add"} Payment Stages
          </DialogTitle>
          <DialogContent style={{ width: "500px" }}>
            <DialogContentText>
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
            </DialogContentText>
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
