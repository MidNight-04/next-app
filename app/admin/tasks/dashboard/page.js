"use client";
import React, { useState } from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import {
  AccessTimeFilled,
  Adjust,
  CheckCircle,
  FiberManualRecord,
} from "@mui/icons-material";
import { RiProgress6Fill } from "react-icons/ri";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
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
import AsideContainer from "../../../../components/AsideContainer";
import { cn } from "../../../../lib/utils";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/useAuthStore";
// import ProgressBar from "../ProgressBar/ProgressBar";

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [filteredtasks, setFilteredTasks] = useState([]);
  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(formatedtoday);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState(1);
  const [searchTerm, setSearchTerm] = useState(null);
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const router = useRouter();
  const url =
    userType === "ROLE_ADMIN"
      ? `${process.env.REACT_APP_BASE_PATH}/api/task/getall`
      : `${process.env.REACT_APP_BASE_PATH}/api/task/employeeID/${userId}`;
  const { data, isFetched, isError, isPreviousData } = useQuery({
    queryKey: ["tasks", currentPage],
    queryFn: async () => {
      const response = await axios.post(url, {
        page: currentPage,
      });
      return response.data.data;
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000,
  });

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = weekdays[date.getUTCDay()];
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const formattedTime = date.toLocaleTimeString();
    return `${weekday}, ${month} ${day} ${year} ${formattedTime}`;
  }

  function getCurrentWeekRange() {
    const now = new Date();
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);

    // Set startOfWeek to the beginning of the week (Sunday)
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0); // Start of day

    // Set endOfWeek to the end of the week (Saturday)
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999); // End of day

    return { startOfWeek, endOfWeek };
  }

  const updateTaskStatus = id => {
    setId(id);
    setUpdateTaskOpen(true);
    setStatus("");
    setImage("");
    setDate(formatedtoday);
  };

  const handleCancel = () => {
    // setViewTaskOpen(false);
    setUpdateTaskOpen(false);
  };

  const handleUpdate = () => {
    if (!status) {
      toast.error("Status is required", {
        position: "top-center",
      });
    } else if (!image) {
      toast.error("Image is required", {
        position: "top-center",
      });
    } else {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", status);
      // formData.append("image", image);
      for (let i = 0; i < image?.length; i++) {
        formData.append("image", image[i]);
      }
      formData.append("date", date);
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/task/update/admin`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };
      axios
        .request(config)
        .then(resp => {
          if (resp.data.status === 200) {
            toast.success(resp?.data?.message, {
              position: "top-center",
            });
            // Close the confirmation dialog
            setUpdateTaskOpen(false);

            getAllTask();
          } else {
            toast.error(resp?.data?.message, {
              position: "top-center",
            });
          }
        })
        .catch(err => {
          toast.error("Error while update daily task", {
            position: "top-center",
          });
          console.log(err);
        });
    }
  };

  const handleButtonClick = filter => {
    setActiveFilter(filter);
    let filteredData;

    switch (filter) {
      case "All Time":
        filteredData = data;
        break;

      case "Today":
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return createdAt >= todayStart && createdAt <= todayEnd;
        });
        break;

      case "Yesterday":
        const yesterdayStart = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).setHours(23, 59, 59, 999);
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return createdAt >= yesterdayStart && createdAt <= yesterdayEnd;
        });
        break;

      case "This Week":
        const { startOfWeek, endOfWeek } = getCurrentWeekRange();
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= startOfWeek.getTime() &&
            createdAt <= endOfWeek.getTime()
          );
        });
        break;

      // Add cases for "Last Week", "This Month", "Last Month", "This Year"
      case "Last Week":
        const lastWeekStart = new Date();
        lastWeekStart.setDate(
          lastWeekStart.getDate() - lastWeekStart.getDay() - 7
        );
        lastWeekStart.setHours(0, 0, 0, 0);
        const lastWeekEnd = new Date();
        lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= lastWeekStart.getTime() &&
            createdAt <= lastWeekEnd.getTime()
          );
        });
        break;

      case "This Month":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= startOfMonth.getTime() &&
            createdAt <= endOfMonth.getTime()
          );
        });
        break;

      case "Last Month":
        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= startOfLastMonth.getTime() &&
            createdAt <= endOfLastMonth.getTime()
          );
        });
        break;

      case "This Year":
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(
          today.getFullYear(),
          11,
          31,
          23,
          59,
          59,
          999
        );
        filteredData = data.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= startOfYear.getTime() &&
            createdAt <= endOfYear.getTime()
          );
        });
        break;

      default:
        filteredData = tasks;
    }

    setFilteredTasks(filteredData);
  };

  const filters = [
    "All Time",
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
  ];

  const searchTask = e => {
    const searchValue = e.target.value.toLowerCase();
    const data = axios.post(
      `${process.env.REACT_APP_BASE_PATH}/api/task/search/${searchValue}`
    );
    setTasks(data);
    console.log(searchValue);
  };

  return (
    <AsideContainer>
      <div>
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5">
          Ticket List
        </h1>
        <div>
          {/* <div className="flex gap-4 p-4 pt-0 flex-col items-center ">
            <h2 className="font-ubuntu text-xl font-semibold">
              Ticket Summary
            </h2>
            <div className="flex flex-row gap-2 w-full justify-center items-center my-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 rounded-lg border border-primary focus:outline-none focus:ring-[1px] focus:ring-secondary"
                onChange={e => searchTask(e)}
              />
            </div>
            <div className="flex flex-row gap-2 w-full justify-evenly items-center my-4">
              <div className="flex flex-row gap-2 px-4 py-2 text-red-600 rounded-full border-[1px] border-red-600 [&_svg]:text-red-600 [&_svg]:text-2xl">
                <span className="name">
                  <FiberManualRecord className="text-danger" /> Overdue
                </span>
                <span className="overdue">
                  {
                    filteredtasks
                      ?.filter(
                        itm =>
                          itm.adminStatus.status === "Pending" ||
                          itm.adminStatus.status === "InProgress"
                      )
                      ?.filter(
                        dt => new Date(formatedtoday) > new Date(dt.dueDate)
                      )?.length
                  }
                </span>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                <span className="name">
                  <Adjust className="text-warning" /> Pending
                </span>
                <span className="pending">
                  {filteredtasks?.filter(
                    itm => itm.adminStatus.status === "Pending"
                  )?.length > 0
                    ? filteredtasks?.filter(
                        itm => itm.adminStatus.status === "Pending"
                      )?.length
                    : 0}
                </span>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                <RiProgress6Fill />
                In Progress
                <div className="inProgress">
                  {filteredtasks?.filter(
                    itm => itm.adminStatus.status === "InProgress"
                  )?.length > 0
                    ? filteredtasks?.filter(
                        itm => itm.adminStatus.status === "InProgress"
                      )?.length
                    : 0}
                </div>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 items-center text-green-600 rounded-full border-[1px] border-green-600 [&_svg]:text-green-600 [&_svg]:text-2xl">
                <span className="name">
                  <CheckCircle className="fs-5 text-success" /> Completed
                </span>
                <span className="completed">
                  {filteredtasks?.filter(
                    itm => itm.adminStatus.status === "Completed"
                  )?.length > 0
                    ? filteredtasks?.filter(
                        itm => itm.adminStatus.status === "Completed"
                      )?.length
                    : 0}
                </span>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 items-center text-green-600 rounded-full border-[1px] border-green-600 [&_svg]:text-green-600 [&_svg]:text-2xl">
                <span className="name">
                  <AccessTimeFilled className="fs-5 text-success" /> In Time
                </span>
                <span className="inTime">
                  {
                    filteredtasks
                      ?.filter(itm => itm.adminStatus.status === "Completed")
                      ?.filter(
                        dt =>
                          new Date(dt.adminStatus.date) <= new Date(dt.dueDate)
                      )?.length
                  }
                </span>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2 text-red-600 rounded-full border-[1px] border-red-600 [&_svg]:text-red-600 [&_svg]:text-2xl">
                <span className="name">
                  <AccessTimeFilled className="fs-5 text-danger" /> Delayed
                </span>
                <span className="delayed">
                  {
                    filteredtasks
                      ?.filter(itm => itm.adminStatus.status === "Completed")
                      ?.filter(
                        dt =>
                          new Date(dt.adminStatus.date) > new Date(dt.dueDate)
                      )?.length
                  }
                </span>
              </div>
            </div>
          </div> */}
          {/* <div className="flex flex-row justify-evenly p-4 items-center">
            <p className="font-ubuntu font-semibold text-lg">Filters :</p>
            {filters.map(filter => (
              <div
                key={filter}
                className={cn(
                  "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
                  activeFilter === filter
                    ? "text-green-800 bg-green-200 border-green-800"
                    : ""
                )}
                onClick={() => handleButtonClick(filter)}
              >
                {filter}
              </div>
            ))}
          </div> */}
          <div>
            <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
              {isFetched &&
                data.map((employee, index) => (
                  <div
                    key={index}
                    className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
                    onClick={() => router.push(`/admin/tasks/${employee._id}`)}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-row gap-4">
                        {/* {employee?.issueMember?.map((dts, id) => {
                          return (
                            <div key={id} className="flex flex-row gap-4">
                              <span className="h-16 rounded-full w-1 bg-primary" />
                              <div className="flex flex-col [&_span]:leading-7 font-ubuntu font-bold text-base text-[#565656]">
                                <span className="font-bold text-lg">
                                  {dts.name}
                                </span>
                                {dts.name === "ThikedaarDotCom" ? (
                                  <span className="font-semibold text-sm">
                                    Admin
                                  </span>
                                ) : (
                                  <span className="font-semibold text-sm">
                                    {dts.employeeID}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })} */}
                        <div className="flex flex-row gap-4">
                          <span className="h-16 rounded-full w-1 bg-primary" />
                          <div className="flex flex-col [&_span]:leading-7 font-ubuntu font-bold text-base text-[#565656]">
                            <span className="font-bold text-lg">
                              {employee.issueMember?.name}
                            </span>
                            {employee.issueMember?.name ===
                            "ThikedaarDotCom" ? (
                              <span className="font-semibold text-sm">
                                Admin
                              </span>
                            ) : (
                              <>
                                {employee.assignedBy?.name ===
                                "ThikedaarDotCom" ? (
                                  <span className="font-semibold text-sm">
                                    Admin
                                  </span>
                                ) : (
                                  <span>{employee.assignedBy?.name}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {data?.length > 0 && (
              <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="flex flex-row gap-2 items-center bg-secondary text-primary px-3 py-2 rounded-3xl"
                  disabled={currentPage === 1}
                >
                  <MdSkipPrevious />
                  Last Page
                </button>
                <span className="text-secondary font-semibold">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    if (!isPreviousData && data.hasMore) {
                    }
                  }}
                  className="flex flex-row gap-2 items-center bg-secondary text-primary px-3 py-2 rounded-3xl"
                  // disabled={isPreviousData || !data?.hasMore}
                >
                  Next Page
                  <MdSkipNext />
                </button>
              </div>
            )}
          </div>
          {!isFetched ||
            (data?.length < 1 && (
              <p
                className="text-center text-secondary"
                style={{ marginTop: "200px", fontSize: "18px" }}
              >
                No Task Assign ...
              </p>
            ))}
        </div>
      </div>

      {/* update task status */}
      <Dialog open={updateTaskOpen} onClose={handleCancel}>
        <DialogTitle>Update Task Status</DialogTitle>
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
              <MenuItem value="InProgress">In Progress</MenuItem>
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
            <TextField type="date" name="date" value={date} disabled />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default Page;
