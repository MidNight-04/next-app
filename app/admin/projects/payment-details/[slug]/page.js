'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../../../../lib/api';
import {
  Button,
  Modal,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'sonner';
import { FaRupeeSign } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useParams } from 'next/navigation';
import AsideContainer from '../../../../../components/AsideContainer';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { SidebarTrigger } from '../../../../../components/ui/sidebar';
import { Separator } from '../../../../../components/ui/separator';

const Page = () => {
  const userType = useAuthStore(state => state.userType);
  const activeUser = useAuthStore(state => state.userId);
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [payDetails, setPayDetails] = useState([]);
  const [payBox, setpayBox] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [paymentStage, setPaymentStage] = useState('');
  const [OpenStatus, setOpenStatus] = useState(false);
  const [stage, setStage] = useState(null);
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [amount, setAmount] = useState(null);
  const [mode, setMode] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [pay, setPay] = useState(0);
  const router = useRouter();

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
  const fetchData = async () => {
    try {
      const projectResponse = await api.get(
        `/project/databyid/${slug}`
      );
      setProjectDetails(projectResponse?.data?.data[0]);

      const paymentDetailsResponse = await api.get(
        `/project/paymentstages/bysiteid/${slug}`
        // `project/paydetailbysiteid/${slug}`
      );
      setPayDetails(paymentDetailsResponse?.data?.data);

      const stagesResponse =
        userType?.substring(5).toLowerCase() === 'client'
          ? await api.post(
              `/project/paymentstages/forclient`,
              { siteID: slug, clientID: activeUser }
            )
          : await api.get(
              `/project/paymentstages/bysiteid/${slug}`
            );

      setData(stagesResponse?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [slug, userType, activeUser]);

  const payProjectAmount = stage => {
    setpayBox(true);
    setPaymentStage(stage);
  };

  const handleClosePayBox = () => {
    setpayBox(false);
  };

  const updatePaymentStatus = () => {
    const fetch = api
      .post(
        `/project/updatepaymentstages/bysiteid/${slug}`,
        { stage, status, paymentDate, remarks, amount, mode }
      )
      .then(() => fetchData());
  };

  const handlePayment = () => {
    // Sandbox Credentials
    let mid = 'WBJIwm08119302462954'; // Merchant ID
    let orderId = slug + new Date().getTime();
    let currency = 'INR';
    let contactType = 'Project Payment';
    let paymentType = 'Online';
    const callbackUrl = window.location.href;
    if (payAmount) {
      api
        .post(`/project/initiate-payment`, {
          orderId,
          payAmount,
          callbackUrl,
          currency,
          activeUser,
        })
        .then(resp => {
          // console.log("transaction token", resp.data.data)
          if (resp.data.data.body.resultInfo.resultStatus == 'S') {
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
      toast('Enter amount for payment');
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
      root: '',
      style: {
        bodyBackgroundColor: '#fafafb',
        bodyColor: '',
        themeBackgroundColor: '#0FB8C9',
        themeColor: '#ffffff',
        headerBackgroundColor: '#284055',
        headerColor: '#ffffff',
        errorColor: '',
        successColor: '',
        card: {
          padding: '',
          backgroundColor: '',
        },
      },
      data: {
        orderId: orderId,
        token: token,
        tokenType: 'TXN_TOKEN',
        amount: amount /* update amount */,
      },
      payMode: {
        labels: {},
        filter: {
          exclude: [],
        },
        order: ['CC', 'DC', 'NB', 'UPI', 'PPBL', 'PPI', 'BALANCE'],
      },
      website: 'DEFAULT',
      flow: 'DEFAULT',
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
          await api
            .post(
              `/project/verify-payment`,
              data
            )
            .then(resp => {
              console.log('transaction token', resp.data);
              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == 'TXN_SUCCESS'
              ) {
                toast(
                  `Congratulations, Your payment has been successfully done for siteID ${siteID}`
                );

                const payNotification = {
                  clientID: activeUser,
                  message: `Payment done Successfully for siteID ${siteID}`,
                  url: window.location.href,
                };
                // console.log(payNotification);
                api
                  .post(
                    `/payproject/notification/createNotification`,
                    payNotification
                  )
                  .then(resp1 => {
                    // console.log(resp1.data);
                    toast(resp1?.data?.message);
                  })
                  .catch(err => {
                    console.error(err);
                  });
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == 'TXN_FAILURE'
              ) {
                toast(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == 'PENDING'
              ) {
                toast(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == 'NO_RECORD_FOUND'
              ) {
                toast(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg
                );
              }
            })
            .catch(err => {
              console.error(err);
              toast('Something went wrong. Please try again!');
            });
          setTimeout(() => window.location.reload(), 2000);
          console.log(paymentStatus);
        },
        notifyMerchant: function (eventName, data) {
          console.log('notifyMerchant handler function called');
          console.log('eventName => ', eventName);
          console.log('data => ', data);
        },
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log('Error => ', error);
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

  let rupee = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });

  return (
    <AsideContainer>
      <div className="datatable">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <IoIosArrowBack
            onClick={() => router.back()}
            className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
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
              <span>{rupee.format(projectDetails?.cost)}</span>
            </div>
          </div>
          <section>
            {data[0]?.stages?.map((item, index) => {
              return (
                <div key={index} className="bg-gray-300 rounded-3xl mb-4">
                  <div className="bg-secondary rounded-t-3xl font-semibold flex flex-row items-center justify-between">
                    <div className="text-primary p-5">
                      <span>
                        {item?.stage}
                        {` (${item?.payment}%)`}
                      </span>
                      <span className="p-1 border border-primary-foreground rounded-md ml-4 text-secondary-foreground font-ubuntu text-sm">
                        {item?.paymentStatus}
                      </span>
                    </div>
                    {userType !== 'ROLE_CLIENT' &&
                      userType !== 'ROLE_SITE ENGINEER' &&
                      item.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => {
                            setStage(item.stage);
                            setOpenStatus(true);
                          }}
                          className="px-3 bg-primary border-2 border-secondary rounded-full font-ubuntu -md:px-2 py-[6px] mx-4"
                        >
                          Update Status
                        </button>
                      )}
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
                          {rupee.format(
                            (item.payment * projectDetails.cost) / 100
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                  {showPaymentDetails[index] && (
                    <>
                      {payDetails[0]?.stages.filter(
                        dt => dt.stage === item.stage
                      )[0]?.installments.length > 0 ? (
                        <div className="text-center">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="font-semibold">Date</th>
                                <th className="font-semibold">Mode</th>
                                <th className="font-semibold">Amount</th>
                                <th className="font-semibold">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {payDetails[0]?.stages
                                .filter(dt => dt.stage === item.stage)[0]
                                ?.installments.map((detail, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{detail.paymentDate}</td>
                                      <td>{detail.mode}</td>
                                      <td>
                                        <span>
                                          {/* <FaRupeeSign /> */}
                                          {rupee.format(detail.amount)}
                                        </span>
                                      </td>
                                      <td>{detail.remarks}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center p-4">
                          No payment details available
                        </p>
                      )}
                    </>
                  )}
                  <div className="flex flex-row items-center bg-secondary-foreground  p-2 w-full rounded-b-3xl">
                    <div className="flex flex-row items-center gap-2 w-full p-5 justify-between">
                      {item.paymentStatus !== 'Paid'
                        ? ' Outstanding Amount:'
                        : 'Paid Amount'}
                      <span className="flex flex-row items-center gap">
                        <span>
                          <FaRupeeSign />
                        </span>
                        {rupee.format(
                          (item.payment * projectDetails.cost) / 100 -
                            payDetails[0]?.stages
                              .filter(dt => dt.stage === item.stage)[0]
                              ?.installments.reduce(
                                (acc, item) =>
                                  acc + parseFloat(item.amount || 0),
                                0
                              )
                        )}
                      </span>
                    </div>
                    {/* {userType === "ROLE_CLIENT" && (
                      <button
                        className="p-[6px] px-3 bg-transparent border-2 border-secondary rounded-full font-ubuntu hover:bg-secondary text-nowrap [&_p]:hover:text-primary [&_svg]:hover:text-primary"
                        onClick={() => payProjectAmount(item.stage)}
                      >
                        <p>Pay Now</p>
                      </button>
                    )} */}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
      <Modal
        open={OpenStatus}
        onClose={() => {}}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Update Payment Status
            </h3>
            <hr className="my-4" />
          </div>
          <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
            <label htmlFor="name">Amount</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="amount"
              type="number"
              name="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
            <label htmlFor="mode">Mode</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="mode"
              type="text"
              name="mode"
              value={mode}
              onChange={e => setMode(e.target.value)}
            />
          </div>
          <div className="w-full [&_label]:font-semibold">
            <label htmlFor="status">Status</label>
            <Select
              labelId="status-simple-select-label"
              id="status-simple-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
              sx={{
                width: '100%',
                borderRadius: '7px',
                background: '#f3f4f6',
                outline: 'none',
                '& :hover': {
                  outline: 'none',
                },
                '& .MuiInputBase-root': {
                  outline: 'none',
                  background: '#cfcfcf',
                  '& :hover': {
                    outline: 'none',
                  },
                },
                color: '#4b5563',
                '.MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #93bfcf',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #93bfcf',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #93bfcf',
                },
                '.MuiSvgIcon-root ': {
                  fill: '#93bfcf !important',
                },
              }}
            >
              <MenuItem value="Not Due Yet">Not Due Yet</MenuItem>
              <MenuItem value="Due">Due</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </div>
          <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
            />
          </div>
          <div className="w-full">
            <label htmlFor="comment" className="font-semibold">
              Remarks
            </label>
            <textarea
              type="text"
              id="comment"
              onChange={e => setRemarks(e.target.value)}
              maxLength="250"
              className="w-full resize-none outline-primary border border-primary rounded-lg p-2 bg-gray-100"
              rows={6}
            />
            <p className="text-xs text-red-500">
              Should not be more than 250 Charactors.
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={() => setOpenStatus(false)}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={() => {
                setOpenStatus(false);
                updatePaymentStatus();
              }}
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>

      <Dialog open={payBox} onClose={handleClosePayBox}>
        <DialogTitle className="text-uppercase fs-5 text-center">
          Pay Amount
        </DialogTitle>
        <DialogContent style={{ width: '500px' }}>
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
