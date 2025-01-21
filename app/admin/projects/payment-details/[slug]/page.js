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
import "react-toastify/dist/ReactToastify.css";
import { FaCalendar, FaMinus, FaPlus, FaRegCalendar } from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaRegCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useParams } from "next/navigation";
import AsideContainer from "../../../../../components/AsideContainer";

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
  const userRole = "client";
  const activeUser = localStorage.getItem("activeUser");
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [payDetails, setPayDetails] = useState([]);
  const [payBox, setpayBox] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [paymentStage, setPaymentStage] = useState("");
  const [pay, setPay] = useState(0);

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (data[0]?.stages) {
      setShowPaymentDetails(new Array(data[0]?.stages.length).fill(false));
    }
  }, [data]);

  const toggleContent = index => {
    setShowPaymentDetails(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(
          `${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`
        );
        setProjectDetails(projectResponse?.data?.data[0]);

        const paymentDetailsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_PATH}/api/project/paydetailbysiteid/${slug}`
        );
        setPayDetails(paymentDetailsResponse?.data?.data);

        const stagesResponse =
          userRole?.substring(5).toLowerCase() === "client"
            ? await axios.post(
                `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/forclient`,
                { siteID: slug, clientID: activeUser }
              )
            : await axios.get(
                `${process.env.REACT_APP_BASE_PATH}/api/project/paymentstages/bysiteid/${slug}`
              );

        setData(stagesResponse?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [slug, userRole, activeUser]);

  const payProjectAmount = stage => {
    setpayBox(true);
    setPaymentStage(stage);
  };

  const handleClosePayBox = () => {
    setpayBox(false);
  };

  const handlePayment = () => {
    // Sandbox Credentials
    let mid = "WBJIwm08119302462954"; // Merchant ID
    let orderId = slug + new Date().getTime();
    let currency = "INR";
    let contactType = "Project Payment";
    let paymentType = "Online";
    const callbackUrl = window.location.href;
    if (payAmount) {
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/project/initiate-payment`,
          {
            orderId,
            payAmount,
            callbackUrl,
            currency,
            activeUser,
          }
        )
        .then(resp => {
          // console.log("transaction token", resp.data.data)
          if (resp.data.data.body.resultInfo.resultStatus == "S") {
            setpayBox(false);
            const transactionToken = resp.data.data.body.txnToken;
            initialize(
              mid,
              orderId,
              payAmount,
              transactionToken,
              contactType,
              paymentType,
              slug
            );
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      toast.error("Enter amount for payment", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const initialize = (
    mid,
    orderId,
    amount,
    token,
    contactType,
    paymentType,
    siteID
  ) => {
    var config = {
      root: "",
      style: {
        bodyBackgroundColor: "#fafafb",
        bodyColor: "",
        themeBackgroundColor: "#0FB8C9",
        themeColor: "#ffffff",
        headerBackgroundColor: "#284055",
        headerColor: "#ffffff",
        errorColor: "",
        successColor: "",
        card: {
          padding: "",
          backgroundColor: "",
        },
      },
      data: {
        orderId: orderId,
        token: token,
        tokenType: "TXN_TOKEN",
        amount: amount /* update amount */,
      },
      payMode: {
        labels: {},
        filter: {
          exclude: [],
        },
        order: ["CC", "DC", "NB", "UPI", "PPBL", "PPI", "BALANCE"],
      },
      website: "DEFAULT",
      flow: "DEFAULT",
      merchant: {
        mid: mid,
        redirect: false,
      },
      handler: {
        transactionStatus: async function (paymentStatus) {
          // console.log("paymentStatus handler function called");
          const data = {
            siteID: siteID,
            clientID: activeUser,
            paymentStage: paymentStage,
            amount: amount,
            contactType: contactType,
            paymentType: paymentType,
            projectDetails: projectDetails,
            orderId: orderId,
          };
          // console.log(data);
          await axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}/api/project/verify-payment`,
              data
            )
            .then(resp => {
              console.log("transaction token", resp.data);
              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "TXN_SUCCESS"
              ) {
                toast.success(
                  `Congratulations, Your payment has been successfully done for siteID ${siteID}`,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );

                const payNotification = {
                  clientID: activeUser,
                  message: `Payment done Successfully for siteID ${siteID}`,
                  url: window.location.href,
                };
                // console.log(payNotification);
                axios
                  .post(
                    `${process.env.REACT_APP_BASE_PATH}/api/payproject/notification/createNotification`,
                    payNotification
                  )
                  .then(resp1 => {
                    // console.log(resp1.data);
                    toast.success(resp1?.data?.message, {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                  })
                  .catch(err => {
                    console.error(err);
                  });
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "TXN_FAILURE"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "PENDING"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "NO_RECORD_FOUND"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }
            })
            .catch(err => {
              console.error(err);
              toast.error("Something went wrong. Please try again!", {
                position: toast.POSITION.TOP_RIGHT,
              });
            });
          setTimeout(() => window.location.reload(), 2000);
          console.log(paymentStatus);
        },
        notifyMerchant: function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        },
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("Error => ", error);
        });
    }
  };

  const totalPaymentAmount = stage => {
    return payDetails
      .filter(dt => dt.payStage === stage)
      .reduce(
        (total, detail) => total + parseFloat(detail.paymentAmount || 0),
        0
      );
  };

  return (
    <AsideContainer>
      <div className="datatable">
        <div className="flex flex-row pl-4 my-4 justify-between">
          <h1 className="text-2xl font-semibold font-ubuntu">
            Project Payment Details
          </h1>
        </div>
        <div className="row mt-4">
          <div className="bg-white rounded-3xl p-5 text-secondary font-semibold text-lg text-center flex flex-row w-full justify-between mb-6">
            <span className="project-payment-stages">Stages</span>
            <div className="flex flex-row text-nowrap items-center justify-center">
              <span className="mr-2">Project Cost -</span>
              <span>
                <FaRupeeSign />
              </span>
              <span>{projectDetails?.cost}</span>
            </div>
          </div>
          <section>
            {data[0]?.stages?.map((item, index) => {
              return (
                <div key={index} className="bg-gray-300 rounded-3xl mb-4">
                  <div className="bg-secondary rounded-t-3xl font-semibold">
                    <p className="text-primary p-5">
                      {item?.stage}
                      {` (${item?.payment}%)`}
                    </p>
                    {/* <p className="date">
                    <FaRegCalendarAlt className="fs-5" />
                    <span className="mx-2">27 july 2024</span>
                  </p> */}
                  </div>
                  <div className="flex flex-row items-center bg-primary-foreground justify-between p-2">
                    <div className="flex flex-row items-center justify-between w-full p-5">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <span>Payment History</span>
                        {showPaymentDetails[index] ? (
                          <span onClick={() => toggleContent(index)}>
                            <IoIosArrowUp />
                          </span>
                        ) : (
                          <span onClick={() => toggleContent(index)}>
                            <IoIosArrowDown />
                          </span>
                        )}
                      </div>
                      <span className="flex flex-row items-center">
                        <span>
                          <FaRupeeSign />
                        </span>
                        <span>
                          {(item.payment * projectDetails.cost) / 100}
                        </span>
                      </span>
                    </div>
                  </div>
                  {showPaymentDetails[index] && (
                    <div className="text-center">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="font-semibold">Mode</th>
                            <th className="font-semibold">Date</th>
                            <th className="font-semibold">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payDetails
                            ?.filter(dt => dt.payStage === item.stage)
                            .map((detail, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    {
                                      detail?.paymentInformation?.body
                                        ?.paymentMode
                                    }
                                  </td>
                                  <td>{detail.createdAt}</td>
                                  <td>
                                    <span>
                                      <FaRupeeSign />
                                      {detail.paymentAmount}
                                    </span>
                                    <span>{/* <FiDownload /> */}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          <tr className="w-full">
                            <td>
                              <strong>Total Amount Pay:</strong>
                            </td>
                            <td />
                            <td>
                              <span className="flex flex-row justify-center items-center">
                                <FaRupeeSign />
                                {totalPaymentAmount(item.stage)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="flex flex-row items-center bg-secondary-foreground  p-2 w-full rounded-b-3xl">
                    <div className="flex flex-row items-center gap-2 w-full p-5">
                      Outstanding Amount:
                      <span className="flex flex-row items-center gap">
                        <span>
                          <FaRupeeSign />
                        </span>
                        {(item.payment * projectDetails.cost) / 100 -
                          totalPaymentAmount(item.stage)}
                      </span>
                    </div>
                    {userRole === "client" && (
                      <button
                        className="p-[6px] px-3 bg-transparent border-2 border-secondary rounded-full font-ubuntu hover:bg-secondary text-nowrap [&_p]:hover:text-primary [&_svg]:hover:text-primary"
                        onClick={() => payProjectAmount(item.stage)}
                      >
                        <p>Pay Now</p>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      <Dialog open={payBox} onClose={handleClosePayBox}>
        <DialogTitle className="text-uppercase fs-5 text-center">
          Pay Amount
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <FormControl fullWidth>
            <Typography className="fw-bold">Amount</Typography>
            <TextField
              type="number"
              name="payAmount"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePayBox} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePayment} color="primary">
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default Page;
