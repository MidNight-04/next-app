"use client";
import React, { useEffect, useState } from "react";
import { FaShieldVirus, FaUser, FaUsers } from "react-icons/fa6";
import {
  MdCategory,
  MdOutlineAccessAlarm,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import { TiTick } from "react-icons/ti";
import {
  AccessTimeFilled,
  Adjust,
  Category,
  CheckCircle,
  FiberManualRecord,
} from "@mui/icons-material";
import { RiProgress6Fill } from "react-icons/ri";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
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
// import ProgressBar from "../ProgressBar/ProgressBar";

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const Page = () => {
  const [activeTab, setActiveTab] = useState("EmployeeWise");
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(formatedtoday);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    getAllTask();
  }, []);

  // For EmployeeWise tab
  // For EmployeeWise tab
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalEmployeePages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // For CategoryWise tab
  const indexOfLastCategory = currentCategoryPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredEmployees.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  ); // Modify as necessary for categories
  const totalCategoryPages = Math.ceil(filteredEmployees.length / itemsPerPage); // Modify for category count if needed

  const handlePageChange = pageNumber => {
    if (activeTab === "EmployeeWise") {
      setCurrentPage(pageNumber);
    } else {
      setCurrentCategoryPage(pageNumber);
    }
  };
  const handleNext = () => {
    if (activeTab === "EmployeeWise" && currentPage < totalEmployeePages) {
      setCurrentPage(currentPage + 1);
    } else if (
      activeTab === "CategoryWise" &&
      currentCategoryPage < totalCategoryPages
    ) {
      setCurrentCategoryPage(currentCategoryPage + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab === "EmployeeWise" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (activeTab === "CategoryWise" && currentCategoryPage > 1) {
      setCurrentCategoryPage(currentCategoryPage - 1);
    }
  };

  // Function to get the visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const page =
      activeTab === "EmployeeWise" ? currentPage : currentCategoryPage;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(startPage + 4, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(endPage - 4, 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  };

  // Reset pagination when the active tab changes
  useEffect(() => {
    if (activeTab === "EmployeeWise") {
      setCurrentPage(1);
    } else {
      setCurrentCategoryPage(1);
    }
  }, [activeTab]);

  const getAllTask = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/task/getall`)
      .then(response => {
        setEmployees(response?.data?.data);
        setFilteredEmployees(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  function formatDate(isoDateString) {
    // Parse the ISO date string into a Date object
    const date = new Date(isoDateString);

    // Array of weekday names
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get date components
    const weekday = weekdays[date.getUTCDay()]; // Short name of the weekday
    const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
    const day = date.getUTCDate(); // Day of the month
    const year = date.getUTCFullYear(); // Full year

    // Construct the formatted time string
    const formattedTime = date.toLocaleTimeString();
    // Construct the final formatted date string
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

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const updateTaskStatus = id => {
    setId(id);
    setUpdateTaskOpen(true);
    setStatus("");
    setImage("");
    setDate(formatedtoday);
  };

  const handleCancel = () => {
    // Close the confirmation dialog
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
        filteredData = employees;
        break;

      case "Today":
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        filteredData = employees.filter(data => {
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
        filteredData = employees.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return createdAt >= yesterdayStart && createdAt <= yesterdayEnd;
        });
        break;

      case "This Week":
        const { startOfWeek, endOfWeek } = getCurrentWeekRange();
        filteredData = employees.filter(data => {
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
        filteredData = employees.filter(data => {
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
        filteredData = employees.filter(data => {
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
        filteredData = employees.filter(data => {
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
        filteredData = employees.filter(data => {
          const createdAt = new Date(data.createdAt).getTime();
          return (
            createdAt >= startOfYear.getTime() &&
            createdAt <= endOfYear.getTime()
          );
        });
        break;

      default:
        filteredData = employees;
    }

    setFilteredEmployees(filteredData);
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
  return (
    <AsideContainer>
      <div>
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5">
          Ticket List
        </h1>
        <div className="bg-white rounded-2xl py-4">
          <div className="flex gap-4 p-4 pt-0 flex-col items-center ">
            <h2 className="font-ubuntu text-xl font-semibold">
              Ticket Summary
            </h2>
            <div className="flex flex-row gap-2 w-full justify-evenly items-center my-4">
              <div className="flex flex-row gap-2 px-4 py-2 text-red-600 rounded-full border-[1px] border-red-600 [&_svg]:text-red-600 [&_svg]:text-2xl">
                <span className="name">
                  <FiberManualRecord className="text-danger" /> Overdue
                </span>
                <span className="overdue">
                  {
                    filteredEmployees
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
                  {filteredEmployees?.filter(
                    itm => itm.adminStatus.status === "Pending"
                  )?.length > 0
                    ? filteredEmployees?.filter(
                        itm => itm.adminStatus.status === "Pending"
                      )?.length
                    : 0}
                </span>
              </div>
              <div className="flex flex-row gap-2 px-4 py-2  text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                <RiProgress6Fill />
                In Progress
                <div className="inProgress">
                  {filteredEmployees?.filter(
                    itm => itm.adminStatus.status === "InProgress"
                  )?.length > 0
                    ? filteredEmployees?.filter(
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
                  {filteredEmployees?.filter(
                    itm => itm.adminStatus.status === "Completed"
                  )?.length > 0
                    ? filteredEmployees?.filter(
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
                    filteredEmployees
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
                    filteredEmployees
                      ?.filter(itm => itm.adminStatus.status === "Completed")
                      ?.filter(
                        dt =>
                          new Date(dt.adminStatus.date) > new Date(dt.dueDate)
                      )?.length
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-evenly p-4 items-center">
            <p className="font-ubuntu font-semibold text-lg">Filters :</p>
            {filters.map(filter => (
              <div
                key={filter}
                // className={`buttons ${
                //   activeFilter === filter ? "active-filter" : ""
                // }`}
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
          </div>
          <div className="flex flex-row border-b-[1px] border-gray-200 my-4 pt-4 px-10">
            <div
              className={cn(
                "border-[1px] border-gray-200 p-4 flex flex-row items-center cursor-pointer",
                activeTab === "EmployeeWise"
                  ? "text-green-700 bg-green-200 border-green-800"
                  : ""
              )}
              onClick={() => handleTabChange("EmployeeWise")}
            >
              <FaUsers className="me-1" />
              Employee Wise
            </div>
            <div
              className={cn(
                "border-[1px] border-gray-200 p-4 flex flex-row items-center cursor-pointer",
                activeTab === "CategoryWise"
                  ? "text-green-800 bg-green-200 border-green-800"
                  : ""
              )}
              onClick={() => handleTabChange("CategoryWise")}
            >
              <MdCategory className="me-1" />
              Category Wise
            </div>
            {/* <button
              className={activeTab === "MyReport" ? "active-tab button" : ""}
              onClick={() => handleTabChange("MyReport")}
            >
              <TiTick className="me-1" /> My Report
            </button> */}
            {/* <button
            className={activeTab === "Delegated" ? "active-tab" : ""}
            onClick={() => handleTabChange("Delegated")}
          >
            Delegated
          </button> */}
          </div>
          {activeTab === "EmployeeWise" ? (
            <>
              <div className="flex flex-col gap-6">
                {currentEmployees
                  .filter(
                    (item, index, self) =>
                      // Check if 'data' array is not empty, and compare based on 'id' inside the 'data' array
                      item.issueMember.length === 0 || // Allow items with empty 'data' arrays
                      index ===
                        self.findIndex(
                          obj =>
                            obj.issueMember.length > 0 &&
                            obj.issueMember[0].employeeID ===
                              item.issueMember[0].employeeID
                        )
                  )
                  .map((employee, index) => {
                    var total = filteredEmployees?.filter(itm =>
                      itm.issueMember?.some(obj =>
                        employee?.issueMember.some(
                          empObj => empObj.employeeID === obj.employeeID
                        )
                      )
                    );
                    var over = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) &&
                        (itm.adminStatus.status === "Pending" ||
                          itm.adminStatus.status === "InProgress") &&
                        new Date(formatedtoday) > new Date(itm.dueDate)
                    );
                    var inTime = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) &&
                        itm.adminStatus.status === "Completed" &&
                        new Date(itm.adminStatus.date) <= new Date(itm.dueDate)
                    );
                    var delay = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) &&
                        itm.adminStatus.status === "Completed" &&
                        new Date(itm.adminStatus.date) > new Date(itm.dueDate)
                    );
                    var pen = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) && itm.adminStatus.status === "Pending"
                    );
                    var inp = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) && itm.adminStatus.status === "InProgress"
                    );
                    var comp = filteredEmployees?.filter(
                      itm =>
                        itm.issueMember?.some(obj =>
                          employee?.issueMember.some(
                            empObj => empObj.employeeID === obj.employeeID
                          )
                        ) && itm.adminStatus.status === "Completed"
                    );
                    var performance =
                      inTime?.length > 0
                        ? parseInt((inTime?.length * 100) / total?.length)
                        : 0;
                    // console.log(performance)
                    return (
                      <div
                        key={index}
                        className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md"
                      >
                        <div className="flex flex-col gap-6">
                          {/* <div className="employee-initials">{employee.initials}</div> */}
                          <div className="flex flex-row gap-4">
                            {employee?.issueMember?.map((dts, id) => {
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
                            })}
                          </div>
                          <div className="flex flex-row gap-2 ">
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                              <FaShieldVirus className="text-danger" /> Total
                              Task:{" "}
                              <span className="overdue">
                                {total?.length > 0 ? total?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-red-200 rounded-full border-[1px] border-red-600 [&_svg]:text-red-600 [&_svg]:text-2xl">
                              <FiberManualRecord className="text-danger" />{" "}
                              Overdue:{" "}
                              <span className="overdue">
                                {over?.length > 0 ? over?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                              <Adjust className="text-warning" /> Pending:{" "}
                              <span className="pending">
                                {pen?.length > 0 ? pen?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                              <RiProgress6Fill className="fs-5 text-warning" />{" "}
                              In Progress:{" "}
                              <span className="inProgress">
                                {inp?.length > 0 ? inp?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-green-200 rounded-full border-[1px] border-green-600 [&_svg]:text-green-600 [&_svg]:text-2xl">
                              <CheckCircle className="fs-5 text-success" />{" "}
                              Completed:{" "}
                              <span className="completed">
                                {comp?.length > 0 ? comp?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-green-200 rounded-full border-[1px] border-green-600 [&_svg]:text-green-600 [&_svg]:text-2x">
                              <AccessTimeFilled className="fs-5 text-success" />{" "}
                              In Time:{" "}
                              <span className="inTime">
                                {inTime?.length > 0 ? inTime?.length : 0}
                              </span>
                            </span>
                            <span className="flex gap-2 justify-center items-center px-4 py-2 bg-red-200 rounded-full border-[1px] border-red-600 [&_svg]:text-red-600 [&_svg]:text-2xl">
                              <AccessTimeFilled className="fs-5 text-danger" />{" "}
                              Delayed:{" "}
                              <span className="delayed" s>
                                {delay?.length > 0 ? delay?.length : 0}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="w-28 h-28 border-[#fec20e] border-[3px] rounded-full flex p-[2px] justify-center items-center">
                          <CircularProgressbar
                            value={performance}
                            text={`${performance}%`}
                            strokeWidth={14}
                            className="font-bold font-ubuntu"
                            styles={buildStyles({
                              backgroundColor: "#3e98c7",
                              textColor: "black",
                              pathColor:
                                performance < 50
                                  ? "red"
                                  : performance > 50 && performance < 70
                                  ? "#fec20e"
                                  : "green",
                              trailColor: "#d6d6d6",
                            })}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex flex-row gap-2 items-center w-full justify-center mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <MdSkipPrevious />
                </button>
                {getVisiblePages(totalEmployeePages).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "px-2 border-[1px] border-gray-300 bg-gray-100 rounded-sm",
                      currentPage === page
                        ? "bg-green-200 border-green-800 text-green-800"
                        : ""
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalEmployeePages}
                >
                  <MdSkipNext />
                </button>
              </div>
            </>
          ) : activeTab === "CategoryWise" ? (
            <>
              <div className="w-full">
                {currentCategories.map((employee, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between items-center shadow-md mb-4 text-[#565656]"
                    >
                      <div className="flex flex-row gap-6 w-full">
                        <span className="h-20 rounded-full w-1 bg-primary" />
                        <div className="w-full">
                          <div className="flex flex-row gap-4 my-2">
                            <div className="font-ubuntu font-semibold text-lg">
                              {employee.title}
                            </div>
                            <span
                              className={cn(
                                employee.adminStatus?.status === "Pending" &&
                                  "py-1 px-2 border-[1px] border-red-600 text-red-600 bg-red-200 rounded-md",
                                employee.adminStatus?.status === "InProgress" &&
                                  "py-1 px-2 border-[1px] border-[#fec20e] text-[#fec20e] bg-primary-foreground rounded-md",
                                employee.adminStatus?.status === "Completed" &&
                                  "py-1 px-2 border-[1px] border-green-800 text-green-800 bg-green-200 rounded-md"
                              )}
                            >
                              {employee.adminStatus?.status}
                            </span>
                          </div>
                          <div>
                            <div>
                              Assigned By{" "}
                              <span className="text-sm font-semibold ">
                                {employee?.assignedBy?.name}
                              </span>
                            </div>
                            <div className="flex flex-row mt-8 gap-4">
                              <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                                <MdOutlineAccessAlarm className="text-secondary fs-5" />
                                <span className="date mx-1 text-success">
                                  {formatDate(employee?.createdAt)}
                                </span>
                              </span>
                              <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                                <FaUser className="text-secondary" />
                                <span className="mx-1">
                                  {employee?.issueMember[0]?.name}
                                </span>
                              </span>
                              <span className="flex gap-2 justify-center items-center px-4 py-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl">
                                <Category className="fs-5 text-secondary" />{" "}
                                {employee?.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        {filteredEmployees?.filter(itm =>
                          itm.issueMember.some(obj =>
                            employee?.issueMember.some(
                              empObj => empObj.employeeID === obj.employeeID
                            )
                          )
                        )?.length > 0 && employee.category !== "project" ? (
                          <div>
                            <button
                              className="p-[6px] px-3 bg-transparent text-sm text-nowrap border-2 border-primary rounded-full font-ubuntu text-primary"
                              onClick={() => updateTaskStatus(employee?._id)}
                            >
                              Update Status
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-row gap-2 items-center w-full justify-center mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentCategoryPage === 1}
                >
                  <MdSkipPrevious />
                </button>
                {getVisiblePages(totalCategoryPages).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "px-2 border-[1px] border-gray-300 bg-gray-100 rounded-sm",
                      currentPage === page
                        ? "bg-green-200 border-green-800 text-green-800"
                        : ""
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentCategoryPage === totalCategoryPages}
                >
                  <MdSkipNext />
                </button>
              </div>
            </>
          ) : null}

          {filteredEmployees?.length === 0 && (
            <p
              className="text-center text-secondary "
              style={{ marginTop: "200px", fontSize: "18px" }}
            >
              No Task Assign ...
            </p>
          )}
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
