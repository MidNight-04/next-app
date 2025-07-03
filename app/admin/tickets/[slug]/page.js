'use client';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../../../../lib/api';
import NoImage from '../../../../public/assets/no-image-available.png';
import { FormControl, TextField } from '@mui/material';
import { toast } from 'sonner';
import Modal from '@mui/material/Modal';
import { useParams } from 'next/navigation';
import AsideContainer from '../../../../components/AsideContainer';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/useAuthStore';
import { cn } from '../../../../lib/utils';
import { MdChecklist } from 'react-icons/md';
import { HiOutlineLockOpen } from 'react-icons/hi2';
import { RiProgress3Line } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import { IoLockClosedOutline } from 'react-icons/io5';
import Image from 'next/image';
import { FiDownload } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let formatedtoday = yyyy + '-' + mm + '-' + dd;

const TicketViewClient = () => {
  const { slug } = useParams();
  const userId = useAuthStore(state => state.userId);
  const userRole = useAuthStore(state => state.userType);
  const duration = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);
  const [ticketCreationTime, setTicketCreationTime] = useState(null);
  const [ticketDetails, setTicketDetails] = useState({});
  const [ticketUpdateBoxOpen, setTicketUpdateBoxOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [openComment, setOpenComment] = useState(false);
  const [type, setType] = useState(null);
  const [comment, setComment] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(null);

  const router = useRouter();

  const fetchTicketData = () => {
    const data = api
      .get(
        `/projecttask/viewbyid/${slug}`
      )
      .then(response => {
        // console.log(response?.data.data);
        if (response?.data.status === 200) {
          setTicketDetails(response?.data?.data);
          setTicketCreationTime(new Date(response?.data?.data?.ticket?.date));
        } else {
          setTicketDetails({});
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchTicketData();
  }, []);

  useEffect(() => {
    if (ticketCreationTime) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        const elapsedTime = now - ticketCreationTime.getTime();
        const remainingTime = duration - elapsedTime;

        setTimeLeft(remainingTime);

        if (remainingTime <= 0) {
          setIsOverdue(true);
          clearInterval(intervalId);
        }
      }, 1000);

      // Initialize timeLeft to the correct value
      const initialRemainingTime =
        duration - (Date.now() - ticketCreationTime.getTime());
      setTimeLeft(Math.max(initialRemainingTime, 0)); // Ensure it's not negative

      return () => clearInterval(intervalId);
    }
  }, [ticketCreationTime]);

  const ChangeDateFormat = dates => {
    const timestamp = dates;
    const date = new Date(timestamp);

    // Format the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const toggleShowImage = () => {
    setShowImage(prev => !prev);
  };

  // Convert milliseconds to hours, minutes, and seconds
  const formatTime = time => {
    const totalSeconds = Math.max(Math.floor(time / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const countdownTime = formatTime(timeLeft);

  const handleCancel = () => {
    setTicketUpdateBoxOpen(false);
  };

  const handleUpdateTicket = () => {
    if (!comment) {
      toast('Please add a comment before updating the ticket.');
    } else {
      setOpenComment(prev => !prev);
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('ticketId', slug);
      formData.append('type', type);
      for (let i = 0; i < image?.length; i++) {
        formData.append('image', image[i]);
      }
      formData.append('comment', comment);
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `/project/ticketupdatemember/byid`,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      };
      api
        .request(config)
        .then(resp => {
          toast(resp?.data?.message);
          fetchTicketData();
        })
        .catch(err => {
          toast('Error while update ticket status');
          console.log(err);
        });
      setTicketUpdateBoxOpen(false);
    }
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = time => {
    const days = Math.floor(-time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((-time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((-time / (1000 * 60)) % 60);
    const seconds = Math.floor((-time / 1000) % 60);

    const daysText = days < 10 ? '0' + days : days;
    const hoursText = hours < 10 ? '0' + hours : hours;
    const minutesText = minutes < 10 ? '0' + minutes : minutes;
    const secondsTexts = seconds < 10 ? '0' + seconds : seconds;

    setHours(Math.floor((-time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((-time / (1000 * 60)) % 60));
    setSeconds(Math.floor((-time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(timeLeft), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const downloadImage = url => {
    saveAs(url, 'ticket_image.jpg');
  };

  return (
    <AsideContainer>
      <div>
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
            Ticket Details
          </h1>
        </div>
        <div className="p-5 rounded-2xl bg-white flex flex-col gap-4 mb-4 ">
          <div className="flex flex-row w-full gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Query Point : </h5>
                <p className="card-text">{ticketDetails?.ticket?.content}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Query : </h5>
                <p className="card-text">{ticketDetails?.ticket?.query}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Work : </h5>
                <p className="card-text">{ticketDetails?.ticket?.work}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Assign member : </h5>
                {ticketDetails?.ticket?.assignMember?.name}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Ticket Date : </h5>
                <span>{ChangeDateFormat(ticketDetails?.ticket?.date)}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <h5 className="font-semibold">Status : </h5>
                <p
                  className={
                    ticketDetails?.finalStatus === 'Pending'
                      ? 'card-text card-text-ticket _pending'
                      : ticketDetails?.finalStatus === 'Process'
                      ? 'card-text card-text-ticket _process'
                      : 'card-text card-text-ticket _resolve'
                  }
                >
                  {ticketDetails?.ticket?.status}
                </p>
                {timeLeft <= 0 && (
                  <p className="text-red-500 font-semibold">(Overdue)</p>
                )}
              </div>
              {ticketDetails?.finalStatus === 'Completed' && (
                <div>
                  <span className="font-semibold">Completed on : </span>
                  <span>
                    {ticketDetails?.finalDate === ''
                      ? ''
                      : ChangeDateFormat(ticketDetails?.ticket?.completedOn)}
                  </span>
                </div>
              )}
            </div>
            <div className="h-40 w-40">
              {!isOverdue && ticketDetails?.finalStatus !== 'Completed' ? (
                <CircularProgressbar
                  value={100 * (timeLeft / duration)}
                  text={countdownTime}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    textSize: '16px',
                    pathTransitionDuration: 0.5,
                    textColor: isOverdue ? 'red' : 'green',
                    trailColor: '#e5e5e5',
                  })}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          {ticketDetails?.ticket?.status !== 'Closed' && (
            <div className="flex flex-row gap-4 mt-4">
              {ticketDetails?.ticket?.assignMember?._id === userId &&
                ticketDetails?.ticket?.status !== 'Complete' && (
                  <button
                    className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                    onClick={() => {
                      setType('In Progress');
                      setOpenComment(prev => !prev);
                    }}
                  >
                    <RiProgress3Line className="text-xl" />
                    In Progress
                  </button>
                )}
              {ticketDetails?.ticket?.status === 'Complete' &&
                ticketDetails?.ticket?.assignedBy?._id === userId && (
                  <button
                    className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                    onClick={() => {
                      setType('Reopened');
                      setOpenComment(prev => !prev);
                    }}
                  >
                    <HiOutlineLockOpen className="text-xl" />
                    Re-open
                  </button>
                )}
              {ticketDetails?.ticket?.assignMember?._id === userId &&
                ticketDetails?.ticket?.status !== 'Complete' && (
                  <button
                    className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                    onClick={() => {
                      setType('Complete');
                      setOpenComment(prev => !prev);
                    }}
                  >
                    <FaCheck className="text-xl" />
                    Complete
                  </button>
                )}
              {ticketDetails?.ticket?.assignedBy?._id === userId &&
                ticketDetails?.ticket?.status !== 'Complete' && (
                  <button
                    className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                    onClick={() => {
                      setType('Closed');
                      setOpenComment(prev => !prev);
                    }}
                  >
                    <IoLockClosedOutline className="text-xl" />
                    Close
                  </button>
                )}
              {/* {data.data.assignedBy?._id === userId &&
                      data.data.status !== "Complete" && (
                        <button className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center">
                          <MdEdit className="text-xl" />
                          Edit
                        </button>
                      )} */}
              {/* {ticketDetails?.ticket?.status !== "Complete" && (
                <button
                  className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                  onClick={() => toggleDelete()}
                >
                  <MdDeleteOutline className="text-xl" />
                  Delete
                </button>
              )} */}
              {ticketDetails?.ticket?.assignMember?._id === userId ||
              ticketDetails?.ticket?.assignedBy?._id === userId
                ? ticketDetails?.ticket?.status !== 'Complete' &&
                  ticketDetails?.ticket?.status !== 'Closed' && (
                    <button
                      className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center"
                      onClick={() => {
                        setType('Comment');
                        setOpenComment(prev => !prev);
                      }}
                    >
                      <MdOutlineInsertComment className="text-xl" />
                      Comment
                    </button>
                  )
                : ''}
            </div>
          )}
          {ticketDetails?.ticket?.image?.length > 0 && (
            <div>
              <h2 className="font-ubuntu text-lg font-semibold mb-2">
                Images:
              </h2>
              {ticketDetails?.ticket?.image?.map((dt, id) => (
                <div
                  className="relative cursor-pointer [&_span]:hover:block w-40"
                  key={id}
                  onClick={() => {
                    setShowImageUrl(dt);
                    toggleShowImage(dt);
                  }}
                >
                  {!showImage && (
                    <span className="w-full rounded h-full bg-black bg-opacity-30 absolute hidden text-primary-foreground text-center">
                      <p className="mt-10 font-semibold">View</p>
                    </span>
                  )}
                  <Image
                    src={dt}
                    alt="ticket image"
                    width={100}
                    height={120}
                    className="rounded w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {ticketDetails?.ticket?.comments?.length > 0 && (
          <>
            <div className="flex flex-row gap-2 my-4">
              <MdChecklist className="text-3xl text-primary" />
              <h3 className="text-xl font-bold font-ubuntu">Ticket Updates</h3>
            </div>
            <div className="flex flex-col gap-4">
              {ticketDetails?.ticket?.comments?.map(item => (
                <div key={item._id} className="bg-white rounded-xl p-5 ">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                      <Image
                        src={'/assets/profile-placeholder.png'}
                        alt="profile image"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="text-sm flex flex-col">
                        <span className="font-semibold">
                          {item?.createdBy?.name}
                        </span>
                        <span>
                          At{' '}
                          {new Date(item?.createdAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'font-ubuntu text-sm text-white p-1 rounded',
                        item.type === 'In Progress' && 'bg-yellow-500',
                        item.type === 'Complete' && 'bg-green-600',
                        item.type === 'Comment' && 'bg-gray-600',
                        item.type === 'Reopened' && 'bg-blue-600',
                        item.type === 'Closed' && 'bg-red-600'
                      )}
                    >
                      {item?.type}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between items-center mt-4">
                    <p>{item?.comment}</p>
                    {item?.image?.length > 0 && (
                      <>
                        {item?.image?.map((img, id) => (
                          <div
                            key={img}
                            className="relative cursor-pointer [&_span]:hover:block w-40"
                            onClick={() => {
                              setShowImageUrl(img);
                              toggleShowImage(img);
                            }}
                          >
                            {!showImage && (
                              <span className="w-full rounded-xl h-full bg-black bg-opacity-30 absolute hidden text-primary-foreground text-center">
                                <p className="mt-16 font-semibold">View</p>
                              </span>
                            )}
                            <div className="flex flex-row gap-2">
                              <Image
                                src={img}
                                alt="ticket image"
                                width={100}
                                height={120}
                                className="rounded w-full"
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Modal
        open={showImage}
        onClose={toggleShowImage}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <div className="bg-white rounded-3xl h-5/6 flex flex-col ">
          {/* <Image
                                                      src={img}
                                                      alt="alt"
                                                      width={400}
                                                      height={400}
                                                    /> */}
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={showImageUrl}
              alt={showImageUrl}
              className="w-auto h-5/6 bg-center"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" /> */}
          </div>
          <div className="flex flex-row gap-4 justify-evenly p-4 -md:flex-wrap">
            <button
              className="py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap"
              onClick={() => {
                downloadImage(showImageUrl);
              }}
            >
              <FiDownload className="text-xl" />
              Download Image
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={openComment}
        onClose={() => setOpenComment(prev => !prev)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="bg-white 2xl:w-1/3 p-8 rounded-3xl outline-none -md:w-3/4 -lg:w-2/4 -xl:4/6 -2xl:3/6">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Ticket Update
            </h3>
            <p>Please add a note before marking the Ticket as Comment</p>
            <hr className="my-3" />
          </div>
          <div className="w-full">
            <textarea
              type="text"
              id="comment"
              onChange={e => setComment(e.target.value)}
              maxLength="250"
              className="w-full resize-none outline-primary border border-gray-400 rounded-lg p-2"
              rows={6}
            />
            <p className="text-xs text-red-500">
              Should be not more than 250 Charactors.
            </p>
          </div>
          <FormControl fullWidth className="mt-1 mb-1">
            <TextField
              type="file"
              name="image"
              onChange={e => setImage(e.target.files)}
            />
          </FormControl>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row items-center"
              onClick={() => setOpenComment(prev => !prev)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={handleUpdateTicket}
            >
              Add Comment
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default TicketViewClient;
