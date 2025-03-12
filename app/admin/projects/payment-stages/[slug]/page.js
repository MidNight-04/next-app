"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useAuthStore } from "../../../../../store/useAuthStore";
import { useParams } from "next/navigation";
import AsideContainer from "../../../../../components/AsideContainer";
import { cn } from "../../../../../lib/utils";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { MdAdd, MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const Page = () => {
  const userRole = useAuthStore(state => state.userType);
  const router = useRouter();
  const activeUser = useAuthStore(state => state.userId);
  const userName = useAuthStore(state => state.username);
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
          toast(`${response.data.message}`);
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
      toast("Payment % is required");
    } else if (!stage) {
      toast("Payment Stage is required");
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
              toast("Event has been created.");
            } else {
              axios
                .put(
                  `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/stageupdatebyid`,
                  data
                )
                .then(response => {
                  if (response) {
                    getAllPaymentStage();
                    toast(`${response.data.message}`);
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
              toast(`${response.data.message}`);
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
          toast("Overall payment percent exceed 100%");
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
        <div className="mb-6">
          {data?.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  <div>
                    <div className="bg-white rounded-3xl p-5 text-secondary font-semibold text-lg text-center">
                      {item?.floor === "0" ? `Ground ` : `${item.floor} `}
                      Floor
                    </div>
                  </div>
                  <>
                    {userRole === "ROLE_ADMIN" && (
                      <div className="flex flex-row items-center justify-end">
                        <span
                          className="p-2 bg-primary-foreground border border-primary rounded-full cursor-pointer mt-2 [&_svg]:text-primary"
                          onClick={() => handleAddOpen(item?._id, item?.floor)}
                        >
                          <MdAdd />
                        </span>
                      </div>
                    )}
                    <div className="bg-white rounded-3xl mt-2">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-secondary my-5 text-primary rounded-t-3xl">
                            <th className="p-5 rounded-tl-3xl" scope="col">
                              Payment %
                            </th>
                            <th
                              className={cn(
                                "p-5",
                                userRole !== "ROLE_ADMIN" && "rounded-tr-3xl"
                              )}
                              scope="col"
                            >
                              Stages
                            </th>
                            {userRole === "ROLE_ADMIN" ? (
                              <th
                                scope="col"
                                className={cn(
                                  "p-5",
                                  userRole === "ROLE_ADMIN" && "rounded-tr-3xl"
                                )}
                              >
                                Action
                              </th>
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
                                {userRole === "ROLE_ADMIN" ? (
                                  <td className="flex flex-row gap-2 items-center justify-center h-[52px]">
                                    <span
                                      className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
                                      onClick={() =>
                                        handleUpdateOpen(
                                          item?._id,
                                          itm.payment,
                                          itm.stage
                                        )
                                      }
                                    >
                                      <FiEdit className="text-xl" />
                                    </span>
                                    <span
                                      className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
                                      onClick={() =>
                                        handleConfirmDelete(
                                          item?._id,
                                          itm?.payment,
                                          itm.stage
                                        )
                                      }
                                    >
                                      <MdOutlineDelete className="text-xl" />
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
