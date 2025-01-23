"use client";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import NoImage from "../../../../public/assets/no-image-available.png";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const TicketViewClient = () => {
  const { slug } = useParams();
  const activeUser = "";
  const activeUser1 = "";
  const userRole = "";
  // const activeUser = localStorage.getItem("employeeID");
  // const activeUser1 = localStorage.getItem("activeUser");
  // const userRole = localStorage.getItem("role");
  const duration = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);
  const [ticketCreationTime, setTicketCreationTime] = useState(null);
  const [ticketDetails, setTicketDetails] = useState({});
  const [ticketUpdateBoxOpen, setTicketUpdateBoxOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [id, setId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [point, setPoint] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [work, setWork] = useState("");
  const [ticketDate, setTicketDate] = useState(null);
  const router = useRouter();
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/projecttask/viewbyid/${slug}`
      )
      .then(response => {
        // console.log(response?.data.data);
        if (response?.data.status === 200) {
          setTicketDetails(response?.data?.data[0]);
          setTicketCreationTime(new Date(response?.data?.data[0]?.date));
        } else {
          setTicketDetails({});
        }
      })
      .catch(error => {
        console.log(error);
      });
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
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  // Convert milliseconds to hours, minutes, and seconds
  const formatTime = time => {
    const totalSeconds = Math.max(Math.floor(time / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const countdownTime = formatTime(timeLeft);

  const updateTicketBox = ticketDetails => {
    setTicketUpdateBoxOpen(true);
    setDate(formatedtoday);
    setPoint(parseInt(ticketDetails?.point));
    setContent(ticketDetails?.content);
    setName(ticketDetails?.step);
    setTicketId(ticketDetails?._id);
    setId(ticketDetails?.projectId);
    setQuery(ticketDetails?.query);
    setTicketDate(ticketDetails?.date);
    setWork(ticketDetails?.work);
  };

  const handleCancel = () => {
    setTicketUpdateBoxOpen(false);
  };

  const handleUpdateTicket = () => {
    if (!status) {
      toast.error("Status is required", {
        position: "top-center",
      });
    } else if (image?.length === 0) {
      toast.error("Image is required", {
        position: "top-center",
      });
    } else {
      const formData = new FormData();
      formData.append("userRole", userRole?.substring(5)?.toLowerCase());
      formData.append("id", id);
      formData.append("ticketId", ticketId);
      formData.append("name", name);
      formData.append("point", point);
      formData.append("content", content);
      formData.append("query", query);
      formData.append("work", work);
      formData.append("ticketDate", ticketDate);

      formData.append("status", status);
      // formData.append("image", image);
      for (let i = 0; i < image?.length; i++) {
        formData.append("image", image[i]);
      }
      formData.append("date", date);
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/project/ticketupdatemember/byid`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };
      axios
        .request(config)
        .then(resp => {
          // console.log(resp);
          toast.success(resp?.data?.message, {
            position: "top-center",
          });

          axios
            .get(
              `${process.env.REACT_APP_BASE_PATH}/api/projecttask/viewbyid/${slug}`
            )
            .then(response => {
              // console.log(response?.data.data);
              if (response?.data.status === 200) {
                setTicketDetails(response?.data?.data[0]);
                setTicketCreationTime(new Date(response?.data?.data[0]?.date));
              } else {
                setTicketDetails({});
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          toast.error("Error while update ticket status", {
            position: "top-center",
          });
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

    const daysText = days < 10 ? "0" + days : days;
    const hoursText = hours < 10 ? "0" + hours : hours;
    const minutesText = minutes < 10 ? "0" + minutes : minutes;
    const secondsTexts = seconds < 10 ? "0" + seconds : seconds;

    setHours(Math.floor((-time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((-time / (1000 * 60)) % 60));
    setSeconds(Math.floor((-time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(timeLeft), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
  console.log(
    `${days} Days,${hours} Hours,${minutes} Minutes,${seconds} Seconds`
  );

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 items-center my-4">
          <IoIosArrowBack
            className="text-2xl cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Ticket Details
          </h1>
        </div>

        <div className="flex flex-row gap-4 justify-between mb-4 items-center -md:flex-col">
          {/* <div className="grid grid-col-2"> */}
          <div className="flex flex-row gap-4 flex-wrap -md:[&_div]:p-3 -md:gap-2">
            <div className="p-[20px] rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
              <h5 className="font-semibold">Query Point : </h5>
              <p className="card-text">{ticketDetails?.content}</p>
            </div>
            <div className="p-[20px]  rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
              <h5 className="font-semibold">Query : </h5>
              <p className="card-text">{ticketDetails?.query}</p>
            </div>
            <div className="p-[20px]  rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
              <h5 className="font-semibold">Work : </h5>
              <p className="card-text">{ticketDetails?.work}</p>
            </div>
            <div className="p-[20px] rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
              <h5 className="font-semibold">Assign member : </h5>
              {ticketDetails?.assignMember?.map((data, id) => {
                return <span key={id}>{`${data.name} `}</span>;
              })}
            </div>
            <div className="p-[20px] rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
              <h5 className="font-semibold">Ticket Date : </h5>
              <span>{ChangeDateFormat(ticketDetails?.date)}</span>
            </div>
            {ticketDetails?.memberStatus?.length > 0 && (
              <div className="p-[20px] rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap -md:flex-col">
                <h5 className="font-semibold">Member Status : </h5>
                <p
                  className={
                    ticketDetails?.memberStatus[0]?.status === "Pending"
                      ? "card-text card-text-ticket _pending"
                      : ticketDetails?.finalStatus === "Process"
                      ? "card-text card-text-ticket _process"
                      : "card-text card-text-ticket _resolve"
                  }
                >
                  {ticketDetails?.memberStatus[0]?.status}
                </p>
                <p>{ticketDetails?.memberStatus[0]?.date}</p>
              </div>
            )}
            <div className="p-[20px]  rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap">
              <h5 className="font-semibold">Final Status : </h5>
              <p
                className={
                  ticketDetails?.finalStatus === "Pending"
                    ? "card-text card-text-ticket _pending"
                    : ticketDetails?.finalStatus === "Process"
                    ? "card-text card-text-ticket _process"
                    : "card-text card-text-ticket _resolve"
                }
              >
                {ticketDetails?.finalStatus}
              </p>
            </div>
            {ticketDetails?.finalStatus === "Completed" && (
              <div className="p-[20px]  rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white text-nowrap">
                <span className="font-semibold">Completed on : </span>
                <span>
                  {ticketDetails?.finalDate === ""
                    ? ""
                    : ChangeDateFormat(ticketDetails?.finalDate)}
                </span>
              </div>
            )}
          </div>
          <div className="h-40 w-40">
            {isOverdue && ticketDetails?.finalStatus !== "Completed" ? (
              <CircularProgressbar
                value={100 * timeLeft}
                text={countdownTime}
                styles={buildStyles({
                  pathColor: isOverdue ? "red" : "#ff0038",
                  textColor: isOverdue ? "red" : "#ff0038",
                  trailColor: "#d6d6d6",
                })}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {ticketDetails?.assignMember?.some(
        obj => obj.employeeID === activeUser || obj.employeeID === activeUser1
      ) &&
        ticketDetails?.finalStatus !== "Completed" && (
          <div className="row">
            <div className="text-center">
              <span
                className="py-2 card-btn-member md mt-2"
                onClick={e => updateTicketBox(ticketDetails)}
              >
                <span className="label fw-normal">Update Ticket</span>
                <i className="fa fa-arrow-right icon-arrow after" />
              </span>
            </div>
          </div>
        )}
      <div className="p-8 bg-white rounded-2xl w-full -md:p-4">
        <div className="grid gap-2 grid-cols-4 -md:grid-cols-2">
          <div className="mb-4">
            <h2 className="font-ubuntu font-bold text-xl mb-4">Images : </h2>
            <div>
              {ticketDetails?.image?.length > 0
                ? ticketDetails?.image?.map((dt, id) => {
                    return <img key={id} src={dt} alt={dt} width={200} />;
                  })
                : // <img src={NoImage} alt="no" width={250} />
                  ""}
            </div>
          </div>
        </div>
        {ticketDetails?.memberStatus?.length > 0 && (
          <div>
            {ticketDetails?.memberStatus[0].image?.length > 0
              ? ticketDetails?.memberStatus[0].image?.map((dt, id) => {
                  return <img key={id} src={dt} alt={dt} width={200} />;
                })
              : // <img src={NoImage} alt="no" width={250} />
                ""}
          </div>
        )}
        {ticketDetails?.finalStatus === "Completed" && (
          <div>
            <h5 className="font-ubuntu font-bold text-xl mb-4 -md:text-lg">
              Final Complete Image :
            </h5>
            <div>
              {ticketDetails?.finalImage?.length > 0
                ? ticketDetails?.finalImage?.map((dt, id) => {
                    return <img key={id} src={dt} alt={dt} />;
                  })
                : // <img src={NoImage} alt="no" width={250} />
                  ""}
            </div>
          </div>
        )}
      </div>

      {/* update ticket status by member assign */}
      <Dialog open={ticketUpdateBoxOpen} onClose={handleCancel}>
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent style={{ width: "400px" }}>
          <FormControl fullWidth className="mt-1 mb-1">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Process">Process</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            <TextField
              type="file"
              name="image"
              inputProps={{ multiple: true }}
              onChange={e => setImage(e.target.files)}
            />
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            <TextField
              type="date"
              name="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTicket} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default TicketViewClient;
