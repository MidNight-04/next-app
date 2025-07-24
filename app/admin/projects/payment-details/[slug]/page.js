'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import { IoIosArrowBack } from 'react-icons/io';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import AsideContainer from '../../../../../components/AsideContainer';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { SidebarTrigger } from '../../../../../components/ui/sidebar';
import { Separator } from '../../../../../components/ui/separator';
import { useQueries, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../../../components/ui/accordion';
import { useProjectPayementStore } from '../../../../../store/useProjectPayementStore';

const selectStyles = {
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
};

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { activeUser, userType } = useAuthStore.getState();
  const isClient = userType?.substring(5).toLowerCase() === 'client';
  const [showPaymentDetails, setShowPaymentDetails] = useState([]);
  const [payBox, setPayBox] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [paymentStage, setPaymentStage] = useState('');
  const [OpenStatus, setOpenStatus] = useState(false);
  const [stage, setStage] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const { activeTab, setActiveTab } = useProjectPayementStore();

  const [projectDetailsQuery, paymentDetailsQuery, stagesQuery] = useQueries({
    queries: [
      {
        queryKey: ['projectDetail', slug],
        queryFn: async () => {
          const res = await api.get(`/project/databyid/${slug}`);
          return res?.data?.data?.[0];
        },
        enabled: !!slug,
      },
      {
        queryKey: ['paymentDetails', slug],
        queryFn: async () => {
          const res = await api.get(`/project/paymentstages/bysiteid/${slug}`);
          return res?.data?.data;
        },
        enabled: !!slug,
      },
      {
        queryKey: ['paymentStages', slug, isClient, activeUser],
        queryFn: async () => {
          if (isClient) {
            const res = await api.post(`/project/paymentstages/forclient`, {
              siteID: slug,
              clientID: activeUser,
            });
            return res?.data?.data;
          } else {
            const res = await api.get(
              `/project/paymentstages/bysiteid/${slug}`
            );
            return res?.data?.data;
          }
        },
        enabled: !!slug && !!userType,
      },
    ],
  });

  const projectDetails = projectDetailsQuery.data;
  const payDetails = paymentDetailsQuery.data;
  const stages = useMemo(() => {
    return stagesQuery.data?.[0]?.stages || [];
  }, [stagesQuery.data]);

  useEffect(() => {
    if (stages.length > 0) {
      setShowPaymentDetails(new Array(stages.length).fill(false));
    }
  }, [stages]);

  const isLoading =
    projectDetailsQuery.isLoading ||
    paymentDetailsQuery.isLoading ||
    stagesQuery.isLoading;

  const isError =
    projectDetailsQuery.isError ||
    paymentDetailsQuery.isError ||
    stagesQuery.isError;

  const isSuccess =
    projectDetailsQuery.isSuccess &&
    paymentDetailsQuery.isSuccess &&
    stagesQuery.isSuccess;

  const handleTabChange = newTab => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setActiveTab(newTab);
  };

  useEffect(() => {
    const handleScroll = () => {
      useProjectPayementStore.getState().setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { scrollY, hasRestoredScroll, setHasRestoredScroll } =
      useProjectPayementStore.getState();

    if (!isSuccess || hasRestoredScroll || scrollY <= 0) return;

    let attempts = 0;
    const interval = setInterval(() => {
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight > scrollY + window.innerHeight) {
        window.scrollTo({
          top: scrollY,
          behavior: 'smooth',
        });
        setHasRestoredScroll(true);
        clearInterval(interval);
      }
      if (attempts > 10) clearInterval(interval);
      attempts++;
    }, 100);

    return () => clearInterval(interval);
  }, [isSuccess]);

  useEffect(() => {
    return () => {
      useProjectPayementStore.getState().setHasRestoredScroll(false);
    };
  }, []);

  useEffect(() => {
    if (stages.length > 0) {
      setShowPaymentDetails(new Array(stages.length).fill(false));
    }
  }, [stages]);

  const updateStatusMutation = useMutation({
    mutationFn: async data => {
      await api.post(`/project/updatepaymentstages/bysiteid/${slug}`, data);
    },
    onSuccess: () => {
      toast.success('Payment status updated!');
      queryClient.invalidateQueries({ queryKey: ['paymentDetails', slug] });
      queryClient.invalidateQueries({ queryKey: ['paymentStages', slug] });
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    },
  });

  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({
      stage,
      status,
      paymentDate,
      remarks,
      amount,
      mode,
    });
    setOpenStatus(false);
  };

  const paymentMutation = useMutation({
    mutationFn: async ({ orderId, amount }) => {
      const callbackUrl = window.location.href;
      const currency = 'INR';
      return api.post(`/project/initiate-payment`, {
        orderId,
        payAmount: amount,
        callbackUrl,
        currency,
        activeUser,
      });
    },
    onSuccess: resp => {
      const result = resp.data.data.body.resultInfo;
      if (result.resultStatus === 'S') {
        const transactionToken = resp.data.data.body.txnToken;
        toast.info('Redirecting to payment...');
        initializePayment(transactionToken);
      } else {
        toast.error('Failed to initiate payment');
      }
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Payment initiation failed');
    },
  });

  const handlePayment = () => {
    if (!payAmount) return toast.error('Enter amount for payment');
    const orderId = `${slug}${Date.now()}`;
    paymentMutation.mutate({ orderId, amount: payAmount });
  };

  const initializePayment = txnToken => {
    const mid = 'WBJIwm08119302462954';
    const orderId = `${slug}${Date.now()}`;
    const amount = payAmount;
    const contactType = 'Project Payment';
    const paymentType = 'Online';

    const config = {
      root: '',
      data: {
        orderId,
        token: txnToken,
        tokenType: 'TXN_TOKEN',
        amount,
      },
      merchant: { mid, redirect: false },
      handler: {
        transactionStatus: async paymentStatus => {
          await api
            .post(`/project/verify-payment`, {
              siteID: slug,
              clientID: activeUser,
              paymentStage,
              amount,
              contactType,
              paymentType,
              projectDetails,
              orderId,
            })
            .then(resp => {
              const result = resp.data.data.paymentInformation.body.resultInfo;
              if (result.resultStatus === 'TXN_SUCCESS') {
                toast.success('Payment successful!');
                queryClient.invalidateQueries({
                  queryKey: ['paymentDetails', slug],
                });
                queryClient.invalidateQueries({
                  queryKey: ['paymentStages', slug],
                });
              } else {
                toast.error(result.resultMsg);
              }
            })
            .catch(() => toast.error('Payment verification failed'));
          setTimeout(() => window.location.reload(), 2000);
        },
      },
    };

    if (window.Paytm?.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(() => window.Paytm.CheckoutJS.invoke())
        .catch(err => console.error('Paytm init error', err));
    }
  };

  const installmentsByStage = useMemo(() => {
    if (!payDetails?.[0]?.stages) return {};
    return payDetails[0].stages.reduce((acc, stageData) => {
      acc[stageData.stage] = stageData.installments || [];
      return acc;
    }, {});
  }, [payDetails]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load data</div>;

  const rupee = new Intl.NumberFormat('en-IN', {
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
            <Accordion
              type="single"
              className="w-full"
              value={activeTab}
              onValueChange={value => handleTabChange(value)}
            >
              {stages?.map((item, index) => {
                const currentInstallments =
                  installmentsByStage[item.stage] || [];
                const totalPaid = currentInstallments.reduce(
                  (acc, installment) =>
                    acc + parseFloat(installment.amount || 0),
                  0
                );

                const totalStageAmount =
                  (item.payment * projectDetails?.cost) / 100;
                const outstandingAmount = totalStageAmount - totalPaid;

                const stageDetails = payDetails[0]?.stages.find(
                  dt => dt.stage === item.stage
                );
                const installments = stageDetails?.installments || [];

                return (
                  <AccordionItem
                    key={index}
                    value={`stage-${index}`}
                    className="bg-gray-300 rounded-3xl mb-4 overflow-hidden"
                  >
                    <div className="bg-secondary flex justify-between items-center p-5 -md:p-3">
                      <div className="text-primary font-semibold">
                        <span>
                          {item?.stage} ({item?.payment}%)
                        </span>
                        <span className="ml-4 px-2 py-1 border border-primary-foreground rounded-md text-secondary-foreground text-sm text-nowrap">
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
                            className="px-3 bg-primary border-2 border-secondary rounded-full font-ubuntu -md:px-2 py-[6px] mx-4 text-nowrap -md:mx-0"
                          >
                            Update Status
                          </button>
                        )}
                    </div>

                    <AccordionTrigger className="flex justify-between bg-primary-foreground px-5 py-4 text-base font-medium hover:no-underline w-full">
                      <div className="flex flex-row justify-between w-full pr-4 -md:pr-2">
                        <span>Payment History</span>
                        <span>₹{rupee.format(totalStageAmount)}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="bg-background p-4">
                      {installments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left border">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-2 font-semibold">
                                  Date
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                  Mode
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                  Amount
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                  Remarks
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.map((detail, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b hover:bg-muted/50 transition-colors"
                                >
                                  <td className="px-4 py-2">
                                    {detail.paymentDate}
                                  </td>
                                  <td className="px-4 py-2">{detail.mode}</td>
                                  <td className="px-4 py-2">
                                    ₹{rupee.format(detail.amount)}
                                  </td>
                                  <td className="px-4 py-2">
                                    {detail.remarks || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No payment details available
                        </p>
                      )}
                    </AccordionContent>

                    <div className="flex justify-between items-center bg-secondary-foreground p-5">
                      <span>
                        {item.paymentStatus !== 'Paid'
                          ? 'Outstanding Amount:'
                          : 'Paid Amount'}
                      </span>
                      <span className="font-medium mr-8 -md:mr-6">
                        ₹
                        {item.paymentStatus !== 'Paid'
                          ? rupee.format(outstandingAmount)
                          : rupee.format(totalPaid)}
                      </span>
                      {/* {userType === 'ROLE_CLIENT' && (
                        <Button
                          variant="outline"
                          onClick={() => payProjectAmount(item.stage)}
                        >
                          Pay Now
                        </Button>
                      )} */}
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>
        </div>
      </div>
      <Modal
        open={OpenStatus}
        onClose={() => {
          setOpenStatus(prev => !prev);
        }}
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
              sx={selectStyles}
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
                handleUpdateStatus();
              }}
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>

      <Dialog open={payBox} onClose={() => setPayBox(false)}>
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
          <Button onClick={() => setPayBox(false)} color="primary">
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
