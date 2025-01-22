"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Accordion as MUIaccordian,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  ImageListItem,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  styled,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaMinus, FaPlus } from "react-icons/fa6";
import {
  IoCallOutline,
  IoCallSharp,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { BsCalendar4Event } from "react-icons/bs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useParams } from "next/navigation";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoaderSpinner from "../../../../components/loader/LoaderSpinner";
import Image from "next/image";
import { cn } from "../../../../lib/utils";
import { Check, PriorityHigh } from "@mui/icons-material";
import AsideContainer from "../../../../components/AsideContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { useAuthStore } from "../../../../store/useAuthStore";

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let formatedtoday = yyyy + "-" + mm + "-" + dd;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ClientProjectView = () => {
  const linkRef = useRef(null);
  const { slug } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [log, setLog] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [id, setId] = useState("");
  const [point, setPoint] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [workDetailOpen, setWorkDetailOpen] = useState(false);
  const [workDetails, setWorkDetails] = useState([]);
  const [showContent, setShowContent] = useState([]);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [totalInspection, setTotalInspection] = useState(0);
  const [singleInspection, setSingleInspection] = useState(0);
  const [step, setStep] = useState("");
  const [pointList, setPointList] = useState([]);
  const [assignMember, setAssignMember] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailsIsloading, setDetailsIsLoading] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState(false);
  // const [expandedItems, setExpandedItems] = useState(false);

  const userType = useAuthStore(state => state.userType);

  // const handleItemsChange = panel => (event, isExpanded) => {
  //   setExpandedItems(isExpanded ? panel : false);
  // };

  const handleDetailsChange = (panel, isExpanded) => {
    setExpandedDetails(isExpanded ? panel : false);
  };

  useEffect(() => {
    // Initialize showContent state based on the number of project steps
    if (projectDetails?.project_status) {
      setShowContent(
        new Array(projectDetails?.project_status.length).fill(false)
      );
    }
  }, [projectDetails]);

  const toggleContent = index => {
    setShowContent(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        setProjectDetails(response?.data?.data[0]);
        // console.log(response?.data?.data);
        setTotalInspection(response?.data?.data[0]?.inspections?.length);

        const durationInMonths = parseInt(response?.data?.data[0]?.duration);
        const initialDate = new Date(response?.data?.data[0]?.date);
        const newDate1 = new Date(initialDate.setMonth(initialDate.getMonth()));
        const newDate = new Date(
          initialDate.setMonth(initialDate.getMonth() + durationInMonths)
        );

        // Format the date as dd/mm/yyyy
        const day = String(newDate.getDate()).padStart(2, "0");
        const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = newDate.getFullYear();

        //
        // Format the date as dd/mm/yyyy
        const day1 = String(newDate1.getDate()).padStart(2, "0");
        const month1 = String(newDate1.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year1 = newDate1.getFullYear();

        const formattedDate1 = `${day1}/${month1}/${year1}`;
        const formattedDate = `${day}/${month}/${year}`;
        setStartDate(formattedDate1);
        setEndDate(formattedDate);
      })
      .then(res => setDetailsIsLoading(false))
      .catch(error => {
        console.log(error);
      });
  }, [slug]);

  // Set initial value based on pointList if available
  useEffect(() => {
    if (pointList && pointList.length > 0) {
      const initialValue = `${pointList[0].point}-${pointList[0].content}`;
      setPoint(pointList[0].point);
      setContent(pointList[0].content);
    }
  }, [pointList]);

  const getPointListByStep = step => {
    const filter = projectDetails?.project_status?.filter(
      obj => obj.name === step
    );
    // console.log(filter)
    setPointList(filter[0]?.step);
  };

  const handleStepChange = async value => {
    // const { value } = e.target;
    console.log(value);
    const pt = value?.split("$")[1];
    setPoint(parseInt(pt));
    if (step) {
      const filtered = projectDetails?.project_status?.find(
        obj => obj.name === step
      )?.step;

      if (filtered) {
        const selectedStep = filtered.find(dt => dt.point === parseInt(pt));
        if (selectedStep) {
          // setContent(selectedStep.content);
          const member = selectedStep.issueMember;
          console.log(member);
          let issue = [];
          for (let i = 0; i < member?.length; i++) {
            switch (member[i]?.toLowerCase()) {
              case "admin":
                issue.push({
                  name: "ThikedaarDotCom",
                  employeeID: "65362fba3ffa1cad30f53bac",
                });
                break;
              case "project admin":
                projectDetails?.project_admin?.forEach(dt => issue.push(dt));
                break;
              case "project manager":
                projectDetails?.project_manager?.forEach(dt => issue.push(dt));
                break;
              case "sr. engineer":
                projectDetails?.sr_engineer?.forEach(dt => issue.push(dt));
                break;
              case "site engineer":
                projectDetails?.site_engineer?.forEach(dt => issue.push(dt));
                break;
              case "accountant":
                projectDetails?.accountant?.forEach(dt => issue.push(dt));
                break;
              case "operation":
                projectDetails?.operation?.forEach(dt => issue.push(dt));
                break;
              case "sales":
                projectDetails?.sales?.forEach(dt => issue.push(dt));
                break;
              default:
                break;
            }
          }
          setAssignMember(issue);
        }
      }
    }
  };

  const updateStatus = () => {
    setPoint("");
    setPointList([]);
    setContent("");
    setStep("");
    setConfirmationOpen(true);
    setImage("");
    setStatus("");
    setLog("");
    setDate(formatedtoday);
  };

  const showWorkData = (point, content, name) => {
    setDetailsIsLoading(true);
    // setWorkDetailOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        setWorkDetails(
          response?.data?.data[0]?.project_status
            ?.filter(item => item.name === name)[0]
            ?.step?.filter(
              dt => dt.point === point && dt.content === content
            )[0]?.finalStatus
        );
      })
      .then(res => {
        setDetailsIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const documentDialogFunction = () => {
    setDocumentOpen(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/client/project-document/bysiteid/${slug}`
      )
      .then(response => {
        setDocumentList(response?.data?.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const workDetailCancel = () => {
    setWorkDetailOpen(false);
  };

  const handleUpdate = () => {
    // console.log(status);
    if (!status) {
      toast.error("Work is required", {
        position: "top-center",
      });
    } else if (!step) {
      toast.error("Query step log is required", {
        position: "top-center",
      });
    } else if (!content) {
      toast.error("Query content is required", {
        position: "top-center",
      });
    } else if (!date) {
      toast.error("Date is required", {
        position: "top-center",
      });
    } else {
      // console.log(assignMember);
      const formData = new FormData();
      formData.append("id", slug);
      formData.append("name", step);
      formData.append("point", parseInt(point));
      formData.append("content", content?.split("$")[0]);
      // Serialize the entire array as a JSON string
      formData.append("assignMember", JSON.stringify(assignMember));
      // for (let i = 0; i < assignMember?.length; i++) {
      //   formData.append("assignMember", JSON.stringify(assignMember[i]));
      // }
      formData.append("status", status);
      for (let i = 0; i < image?.length; i++) {
        formData.append("image", image[i]);
      }
      formData.append("log", log);
      formData.append("date", date);

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/project/client-query`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      };
      axios
        .request(config)
        .then(resp => {
          toast.success(resp.data.message, {
            position: "top-center",
          });
        })
        .catch(err => {
          toast.error("Error while raise query by client", {
            position: "top-center",
          });
          console.log(err);
        });

      // Close the confirmation dialog
      setConfirmationOpen(false);
    }
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setConfirmationOpen(false);
  };
  const teamOpenCancel = () => {
    setTeamOpen(false);
  };
  const documentOpenCancel = () => {
    setDocumentOpen(false);
  };
  const handleOpenInspectionDialog = async name => {
    setInspectionDialogOpen(true);
    var count = 0;
    var filterData = await projectDetails?.inspections?.filter(
      itm => itm.checkListStep === name
    );
    setSingleInspection(filterData);
  };
  const handleInspectionDialog = () => {
    setInspectionDialogOpen(false);
  };

  return (
    <AsideContainer>
      <div className="flex flex-row pl-4 my-4 justify-between -md:flex-col -md:pl-0 -md:my-2">
        <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
          Project Details
        </h1>
        <div className="flex flex-row gap-4 -md:gap-2 ">
          <Link href={`/admin/projects/payment-stages/${slug}`}>
            <button className="px-[15px] py-[12px] bg-transparent border-2 border-primary rounded-full font-ubuntu -md:px-2 -md:py-[6px]">
              <div className="text-primary flex flex-row">
                <p className="text-[13px] font-bold leading-none -md:text-xs">
                  Payment Stages
                </p>
              </div>
            </button>
          </Link>
          <Link href={`/admin/projects/payment-details/${slug}`}>
            <button className="px-[15px] py-[12px] bg-transparent border-2 border-primary rounded-full font-ubuntu -md:px-2 -md:py-[6px]">
              <div className="text-primary flex flex-row">
                <p className="text-[13px] font-bold leading-none -md:text-xs">
                  Payment Details
                </p>
              </div>
            </button>
          </Link>
          {userType === "ROLE_ADMIN" && (
            <>
              <Link href={`/admin/projects/payment-details/${slug}`}>
                <button className="px-[15px] py-[12px] bg-transparent border-2 border-primary rounded-full font-ubuntu -md:px-2 -md:py-[6px]">
                  <div className="text-primary flex flex-row">
                    <p className="text-[13px] font-bold leading-none -md:text-xs">
                      Project Inspections
                    </p>
                  </div>
                </button>
              </Link>
              <Link href={`/admin/projects/payment-details/${slug}`}>
                <button className="px-[15px] py-[12px] bg-transparent border-2 border-primary rounded-full font-ubuntu">
                  <div className="text-primary flex flex-row">
                    <p className="text-[13px] font-bold leading-none">
                      Add Documents
                    </p>
                  </div>
                </button>
              </Link>
            </>
          )}
          <button
            className="px-[15px] py-[12px] bg-transparent border-2 border-red-500 rounded-full font-ubuntu -md:px-2 -md:py-[6px] cursor-pointer"
            onClick={() => updateStatus()}
          >
            <div className="text-red-500 flex flex-row">
              <p className="text-[13px] font-bold leading-none -md:text-xs">
                Raise Ticket
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="grid grid-row grid-cols-5 gap-4 -lg:gap-2 -xl:grid-cols-4 -lg:grid-cols-3 -md:grid-cols-2 justify-evenly -2xl:[&>div]:h-[88px] -lg:[&>div]:p-[10px] -md:[&>div]:h-14 -lg:text-xs ">
        <div
          className="p-[20px]  w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white cursor-pointer"
          onClick={() => documentDialogFunction()}
        >
          <div className="font-semibold">Documents</div>
          <IoDocumentsOutline className="text-[20px]" />
        </div>
        <div
          className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white cursor-pointer"
          onClick={() => setTeamOpen(true)}
        >
          <div className="font-semibold">Teams</div>
          <GoPeople className="text-[20px]" />
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <span className="font-semibold">
            Site ID - {projectDetails?.siteID}
          </span>
          <MdLockOutline className="text-[20px]" />
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <div>
            <span className="font-semibold">Start Date -</span>
            <span> {startDate}</span>
          </div>
          <BsCalendar4Event className="text-[20px]" />
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <div>
            <span className="font-semibold">End Date -</span>
            <span> {endDate}</span>
          </div>
          <BsCalendar4Event className="text-[20px]" />
        </div>
        <div className="px-[20px] py-[14px] flex w-full flex-auto items-center self-center justify-center bg-white rounded-[14px]">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No. of Inspections" />
            </SelectTrigger>
            <SelectContent>
              {projectDetails?.project_status
                ?.sort((a, b) => a.priority - b.priority)
                ?.map((item, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={item.name}
                      onClick={() => handleOpenInspectionDialog(item?.name)}
                    >
                      {item.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <span className="font-semibold">Pending Inspection</span>
          <span className="px-[10px] py-[3px] font-semibold rounded-full border-[1px] border-primary bg-primary-foreground text-primary">
            {
              projectDetails?.inspections?.filter(itm => itm.passed === true)
                ?.length
            }
          </span>
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <span className="font-semibold">Passed Inspection</span>
          <span className="px-[10px] py-[3px] font-semibold rounded-full border-[1px] border-primary bg-primary-foreground text-primary">
            {
              projectDetails?.inspections?.filter(itm => itm.passed === true)
                ?.length
            }
          </span>
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <span className="font-semibold">Total Tickets</span>
          <span className="px-[10px] py-[3px] font-semibold rounded-full border-[1px] border-primary bg-primary-foreground text-primary">
            {projectDetails?.openTicket?.length}
          </span>
        </div>
        <div className="p-[20px] w-full rounded-[14px] [&_svg]:text-primary font-ubuntu flex flex-row gap-2 items-center self-center justify-between bg-white">
          <span className="font-semibold">Pending Tickets</span>
          <span className="px-[10px] py-[3px] font-semibold rounded-full border-[1px] border-primary bg-primary-foreground text-primary">
            {
              projectDetails?.openTicket?.filter(
                dt => dt.finalStatus !== "Completed"
              )?.length
            }
          </span>
        </div>
      </div>
      <section className="inspection-box mt-2">
        <div className="row mx-0">
          <div className="flex flex-row gap-4 items-center justify-between mb-4 w-full">
            {/* <p className="number">{totalInspection}</p> */}
          </div>
        </div>
      </section>
      <div className="mb-4">
        {projectDetails?.project_status
          ?.sort((a, b) => a.priority - b.priority)
          .map((item, index) => {
            var totalPoint = 0;
            var completePoint = 0;
            for (let j = 0; j < item?.step?.length; j++) {
              totalPoint += 1;
              if (item?.step[j]?.finalStatus[0]?.status === "Completed") {
                completePoint += 1;
              }
            }
            var percent = ((completePoint * 100) / totalPoint).toFixed(0);
            return (
              <Accordion type="single" collapsible key={item.name}>
                <AccordionItem
                  value={item.name}
                  className="bg-white rounded-[14px]"
                >
                  <AccordionTrigger className="px-4 ">
                    <div className="flex flex-row justify-between w-full pr-8">
                      <div className="flex text-lg font-ubuntu justify-center items-center font-bold">
                        {item.name}
                      </div>
                      <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar
                          value={percent}
                          text={`${percent}%`}
                          strokeWidth={14}
                          styles={buildStyles({
                            backgroundColor: "#3e98c7",
                            textColor: "black",
                            pathColor: "#93BFCF",
                            trailColor: "#d6d6d6",
                          })}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#efefef] h-24 pt-4">
                      <div className=" bg-secondary text-primary h-20 flex flex-row justify-evenly items-center rounded-t-3xl flex-auto text-base font-semibold -md:justify-between">
                        <span className="font-semibold w-24 -sm:hidden" />
                        <span className="font-semibold w-[140px] -md:w-16 -md:ml-8 -sm:ml-16">
                          Point
                        </span>
                        <span className="font-semibold w-[140px] flex self-center justify-center -md:w-20 text-center">
                          Member Issue
                        </span>
                        <span className="font-semibold w-[200px] -md:w-24 -md:mr-16">
                          Schedule Time
                        </span>
                      </div>
                    </div>
                    {item.step?.map((itm, idx) => {
                      let initialDate = new Date(projectDetails?.date);
                      const dur = itm.duration ? parseInt(itm.duration) : 0;
                      // Add duration days
                      initialDate.setDate(initialDate.getDate() + dur);
                      // Get the final date
                      let finalDate = initialDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
                      return (
                        <MUIaccordian
                          key={idx}
                          expanded={
                            expandedDetails === `${itm.content}-${itm.point}`
                          }
                          onChange={(e, isExpanded) => {
                            handleDetailsChange(
                              `${itm.content}-${itm.point}`,
                              isExpanded
                            );
                            showWorkData(itm.point, itm.content, item.name);
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel1bh-${item.name}-item-content`}
                            id={`panel1bh-${item.name}-item-header`}
                            sx={{
                              height: "56px",
                            }}
                          >
                            <div className="flex flex-row justify-evenly w-full">
                              <div className="relative w-[120px] -md:w-8">
                                <div className="h-full w-6 flex items-center justify-center">
                                  <div
                                    className={cn(
                                      "w-[2px] bg-green-500 pointer-events-none h-full",
                                      idx === 0 ? "mt-[100%] h-7" : "",
                                      idx === item.step.length - 1
                                        ? "mb-[100%] h-7"
                                        : "",
                                      itm.finalStatus[0].status !== "Completed"
                                        ? "bg-yellow-500"
                                        : ""
                                    )}
                                  />
                                </div>
                                <div
                                  className={cn(
                                    "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center",
                                    itm.finalStatus[0].status !== "Completed"
                                      ? "bg-yellow-500"
                                      : ""
                                  )}
                                >
                                  {itm.finalStatus[0].status === "Pending" ? (
                                    <PriorityHigh
                                      sx={{
                                        fontSize: "16px",
                                        color: "red",
                                      }}
                                    />
                                  ) : (
                                    <Check
                                      sx={{
                                        fontSize: "16px",
                                        color: "white",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="w-[200px] flex items-center -md:w-16">
                                <div className="text-sm font-semibold">
                                  {itm.content}
                                  {itm.checkList?.toLowerCase() === "yes" && (
                                    <div>inspections</div>
                                  )}
                                </div>
                              </div>
                              <div className="w-[200px] flex self-center justify-center -md:w-16">
                                {itm.issueMember?.map((mem, id) => {
                                  return (
                                    <div
                                      key={id}
                                      className="text-sm font-semibold"
                                    >
                                      {mem}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="w-[200px] -md:w-28">
                                <div className="flex flex-row mb-2">
                                  <div className="text-sm font-semibold">
                                    Date :
                                  </div>
                                  <div className="text-sm"> {finalDate}</div>
                                </div>
                                <div className="flex flex-row">
                                  <div className="text-sm font-semibold">
                                    Final :
                                  </div>
                                  <div className="text-sm">
                                    {itm.finalStatus[0].date}{" "}
                                    {/* {itm.finalStatus[0].date ? (
                                      new Date(itm.finalStatus[0].date) >
                                      new Date(finalDate) ? (
                                        <div>
                                          {`(-`}
                                          {(new Date(itm.finalStatus[0].date) -
                                            new Date(finalDate)) /
                                            (1000 * 3600 * 24)}
                                          {` days)`}
                                        </div>
                                      ) : (
                                        <div className="ontime-task">{`(OnTime)`}</div>
                                      )
                                    ) : (
                                      ""
                                    )} */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="p-5 shadow-lg rounded-3xl border-[1px] border-primary mx-6">
                              <h5 className="text-lg font-bold mb-4">
                                Details :
                              </h5>
                              <div>
                                <div>{workDetails[0]?.date}</div>
                                <div>
                                  {workDetails[0]?.image?.map(img => (
                                    <img
                                      src={img}
                                      alt={img}
                                      key={img}
                                      className="w-80 h-full"
                                    />
                                  ))}
                                </div>
                                <div className="font-semibold">
                                  Status:{workDetails[0]?.status}
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </MUIaccordian>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
      </div>

      {/* Team list open dialog */}
      <Dialog open={teamOpen} onClose={teamOpenCancel}>
        <DialogTitle
          className="text-center"
          sx={{
            fontSize: "18px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          Team Members
        </DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <div className="rounded-3xl">
            <div className="row">
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Project Admin</span>
                {projectDetails?.project_admin?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">
                  Project Manager
                </span>
                {projectDetails?.project_manager?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Sr. Engineer</span>
                {projectDetails?.sr_engineer?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Site Engineer</span>
                {projectDetails?.site_engineer?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Contractor</span>
                {projectDetails?.contractor?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Operation</span>
                {projectDetails?.operation?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Sales</span>
                {projectDetails?.sales?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <span className="pdm-name mt-1">{item.name}</span>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {" "}
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={teamOpenCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project document dialog */}
      <Dialog open={documentOpen} onClose={documentOpenCancel}>
        <DialogTitle
          className="text-center"
          style={{
            fontSize: "18px",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          Documents
        </DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <div className="mt-2">
            <div>
              {documentList?.map((item, index) => {
                return (
                  <div
                    className="flex flex-col gap-4 w-full p-5 rounded-3xl mb-2 border-[1px]"
                    key={index}
                  >
                    <div className="flex flex-row justify-between">
                      <span className="font-ubuntu text-lg font-semibold">
                        {item?.name}
                      </span>
                      {item?.status === "Pending" ? (
                        <span className="bg-primary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By You
                        </span>
                      ) : item?.status === "Accepted" ? (
                        <span className="bg-primary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By You
                        </span>
                      ) : (
                        <span className="bg-primary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By You
                        </span>
                      )}
                    </div>
                    <div className="flex flex-row justify-between">
                      <span
                        className="pdm-name"
                        style={{ fontSize: "12px" }}
                      >{`${new Date(item?.updatedAt).getDate()} ${
                        monthNames[new Date(item.updatedAt).getMonth()]
                      }, ${new Date(item.updatedAt).getFullYear()}`}</span>
                      <a ref={linkRef} style={{ display: "none" }}></a>
                      <span
                        className="bg-green-600 p-2 rounded-full cursor-pointer"
                        onClick={() => {
                          const pdfUrl = item?.document[0];
                          linkRef.current.href = pdfUrl;
                          linkRef.current.download = "document.pdf";
                          linkRef.current.click();
                        }}
                      >
                        <FaDownload className="text-white" />
                      </span>
                    </div>
                    <hr />
                    <span className="pdm-name">
                      <span className="font-ubuntu font-semibold">
                        Uploaded by :{" "}
                      </span>
                      <span className="pteam-member-uploaded">
                        {item.uploadingUserName}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={documentOpenCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={confirmationOpen}
        onClose={handleCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="w-[40%] bg-white p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-center font-ubuntu mb-4">
            Raise Ticket
          </h2>
          <div className="flex flex-col gap-6 mb-4">
            <FormControl fullWidth>
              <InputLabel id="Work-simple-select-label">Work</InputLabel>
              <MUISelect
                labelId="Work-simple-select-label"
                id="Work-simple-select"
                label="Work"
                value={status}
                name="status"
                variant="outlined"
                onChange={e => setStatus(e.target.value)}
                sx={{ borderRadius: "16px", background: "#f3f4f6" }}
              >
                <MenuItem value="Rework">Rework</MenuItem>
                <MenuItem value="Extra Work">Extra Work</MenuItem>
                <MenuItem value="Correction">Correction</MenuItem>
                <MenuItem value="Approval">Approval</MenuItem>
              </MUISelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="Step-simple-select-label">Step</InputLabel>
              <MUISelect
                labelId="Step-simple-select-label"
                id="Step-simple-select"
                value={step}
                label="Step"
                name="step"
                onChange={e => {
                  setStep(e.target.value);
                  getPointListByStep(e.target.value);
                }}
                sx={{ borderRadius: "16px", background: "#f3f4f6" }}
              >
                {projectDetails?.project_status?.map((data, id) => {
                  return (
                    <MenuItem key={id} value={data.name}>
                      {data.name}
                    </MenuItem>
                  );
                })}
              </MUISelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="content-simple-select-label">Content</InputLabel>
              <MUISelect
                labelId="content-simple-select-label"
                id="content-simple-select"
                label="Content"
                value={content} // Adjust value to reflect state
                name="content"
                onChange={async e => {
                  setContent(e.target.value);
                  handleStepChange(e.target.value);
                }}
                sx={{ borderRadius: "16px", background: "#f3f4f6" }}
              >
                {pointList?.map((data, id) => {
                  return (
                    <MenuItem key={id} value={`${data.content}$${data.point}`}>
                      {data.content}
                    </MenuItem>
                  );
                })}
              </MUISelect>
            </FormControl>
            <FormControl
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "16px",
                  background: "#f3f4f6",
                },
              }}
            >
              <TextField
                type="text"
                name="log"
                value={log}
                placeholder="Queries"
                onChange={e => setLog(e.target.value)}
                sx={{ borderRadius: "16px", background: "#f3f4f6" }}
              />
            </FormControl>
            {/* <FormControl fullWidth className="mt-1 mb-1">
            <TextField
              type="file"
              name="image"
              inputProps={{ multiple: true }}
              onChange={e => setImage(e.target.files)}
            />
          </FormControl> */}
            <div className="w-full">
              {/* <label className="text-base text-[#565656] font-semibold mb-2 block text-center">
              Image
            </label> */}
              <input
                type="file"
                name="image"
                onChange={e => setImage(e.target.files)}
                className="w-full rounded-3xl text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-4 file:px-6 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500"
              />
            </div>
            <FormControl
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "16px",
                  background: "#f3f4f6",
                },
              }}
            >
              <TextField
                type="date"
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                inputProps={{ readOnly: true }}
              />
            </FormControl>
          </div>
          <div>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* Work details view dialog */}
      <Dialog open={workDetailOpen} onClose={workDetailCancel}>
        <DialogTitle>Work Details</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          {workDetails?.map((item, index) => {
            return (
              <div key={index}>
                <InputLabel className="text-dark fw-bold">Status</InputLabel>
                <Typography className="mx-1" style={{ fontSize: "14px" }}>
                  {item.status}
                </Typography>
                <InputLabel className="text-dark fw-bold mt-3">
                  Work Image
                </InputLabel>
                {item?.image?.map((dt, idx) => {
                  return (
                    <ImageListItem
                      key={idx}
                      style={{ display: "flex", margin: "10px 0px" }}
                    >
                      <img
                        src={dt}
                        alt="task"
                        loading="lazy"
                        style={{ width: "525px" }}
                      />
                    </ImageListItem>
                  );
                })}
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={workDetailCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for show checklist/inspection */}
      <Dialog open={inspectionDialogOpen} onClose={handleInspectionDialog}>
        <DialogTitle className="text-uppercase fs-5 text-center">
          Inspection Details
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <div className="row">
            <div className="col-lg-12 col-md-12 inspection-box-col">
              <p className="text">No. of inspections:</p>
              <p className="number">
                {singleInspection?.length}
                <span></span>
              </p>
            </div>
            <div className="col-lg-12 col-md-12 inspection-box-col">
              <p className="text">Pending Inspection:</p>
              <p className="number">
                {projectDetails?.inspections?.length > 0
                  ? projectDetails?.inspections?.filter(
                      itm => itm.passed === false
                    )?.length
                  : 0}
                <span></span>
              </p>
            </div>
            <div className="col-lg-12 col-md-12 inspection-box-col">
              <p className="text">Passed Inspection:</p>
              <p className="number">
                {singleInspection?.length > 0
                  ? singleInspection.filter(itm => itm.passed === true)?.length
                  : 0}
                <span></span>
              </p>
            </div>
            {/* <div className="col-lg-12 col-md-12 inspection-box-col">
              <p className="text">Closed Tickets:</p>
              <p className="number">
                0<span></span>
              </p>
            </div>
            <div className="col-lg-12 col-md-12 inspection-box-col">
              <p className="text">Open Tickets:</p>
              <p className="number">
                0<span></span>
              </p>
            </div> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInspectionDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default ClientProjectView;

{
  /* <Accordion
                  sx={{ background: "#e5e5e5" }}
                  key={item.name}
                  expanded={expandedItems === `${item.name}`}
                  onChange={handleItemsChange(`${item.name}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel1bh-${item.name}-content`}
                    id={`panel1bh-${item.name}-header`}
                  >
                    <div className="flex flex-row justify-between w-full pr-8">
                      <div className="flex justify-center items-center font-semibold">
                        {item.name}
                      </div>
                      <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar
                          value={percent}
                          text={`${percent}%`}
                          styles={{
                            path: {
                              stroke: `#fec20e`,
                              strokeWidth: "10px",
                              strokeLinecap: "butt",
                              transition: "stroke-dashoffset 0.5s ease 0s",
                              transformOrigin: "center center",
                            },
                            text: {
                              fill: "black",
                              fontSize: "25px",
                              fontWeight: "800",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className=" flex flex-row justify-evenly flex-auto mb-2">
                      <span className="font-semibold w-24" />
                      <span className="font-semibold w-[140px]">Point</span>
                      <span className="font-semibold w-[140px] flex self-center justify-center">
                        Member Issue
                      </span>
                      <span className="font-semibold w-[200px]">
                        Schedule Time
                      </span>
                    </div>

                    {item.step?.map((itm, idx) => {
                      let initialDate = new Date(projectDetails?.date);
                      const dur = itm.duration ? parseInt(itm.duration) : 0;
                      // Add duration days
                      initialDate.setDate(initialDate.getDate() + dur);
                      // Get the final date
                      let finalDate = initialDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
                      return (
                        <Accordion
                          key={idx}
                          expanded={
                            expandedDetails === `${itm.content}-${itm.point}`
                          }
                          onChange={(e, isExpanded) => {
                            handleDetailsChange(
                              `${itm.content}-${itm.point}`,
                              isExpanded
                            );
                            showWorkData(itm.point, itm.content, item.name);
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel1bh-${item.name}-item-content`}
                            id={`panel1bh-${item.name}-item-header`}
                            sx={{
                              height: "56px",
                            }}
                          >
                            <div className="flex flex-row justify-evenly w-full">
                              <div className="relative w-[120px]">
                                <div className="h-full w-6 flex items-center justify-center">
                                  <div
                                    className={cn(
                                      "w-[2px] bg-green-500 pointer-events-none h-full",
                                      idx === 0 ? "mt-[100%] h-7" : "",
                                      idx === item.step.length - 1
                                        ? "mb-[100%] h-7"
                                        : "",
                                      itm.finalStatus[0].status !== "Completed"
                                        ? "bg-yellow-500"
                                        : ""
                                    )}
                                  />
                                </div>
                                <div
                                  className={cn(
                                    "w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-green-500 shadow text-center",
                                    itm.finalStatus[0].status !== "Completed"
                                      ? "bg-yellow-500"
                                      : ""
                                  )}
                                >
                                  {itm.finalStatus[0].status === "Pending" ? (
                                    <PriorityHigh
                                      sx={{
                                        fontSize: "16px",
                                        color: "red",
                                      }}
                                    />
                                  ) : (
                                    <Check
                                      sx={{
                                        fontSize: "16px",
                                        color: "white",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="w-[200px] flex items-center">
                                <div className="text-sm font-semibold">
                                  {itm.content}
                                  {itm.checkList?.toLowerCase() === "yes" && (
                                    <span
                                      className="inspection-button mx-3"
                                      // onClick={() =>
                                      //   handleOnClickInspection(
                                      //     itm?.point,
                                      //     itm?.checkListName,
                                      //     item?.name
                                      //   )
                                      // }
                                    >
                                      inspections
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-[200px] flex self-center justify-center">
                                {itm.issueMember?.map((mem, id) => {
                                  return (
                                    <span
                                      key={id}
                                      className="text-sm font-semibold"
                                    >
                                      {mem}
                                    </span>
                                  );
                                })}
                              </div>
                              <div className="w-[200px]">
                                <span className="float-start">
                                  <span className="text-sm font-semibold">
                                    Date:{" "}
                                  </span>
                                  <span className="text-sm">{finalDate}</span>
                                </span>
                                <br />
                                <span className="float-start">
                                  <span className="text-sm font-semibold">
                                    Final:{" "}
                                  </span>
                                  <span className="text-sm">
                                    {itm.finalStatus[0].date}{" "}
                                    {itm.finalStatus[0].date ? (
                                      new Date(itm.finalStatus[0].date) >
                                      new Date(finalDate) ? (
                                        <span className="delay-task">
                                          {`(-`}
                                          {(new Date(itm.finalStatus[0].date) -
                                            new Date(finalDate)) /
                                            (1000 * 3600 * 24)}
                                          {` days)`}
                                        </span>
                                      ) : (
                                        <span className="ontime-task">{`(OnTime)`}</span>
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div>
                              <h5>Details</h5>
                              <div>
                                <div>{workDetails[0]?.date}</div>
                                <div>
                                  {workDetails[0]?.image?.map(img => (
                                    <img
                                      src={img}
                                      alt={img}
                                      key={img}
                                      className="w-80 h-full"
                                    />
                                  ))}
                                </div>
                                <div>{workDetails[0]?.status}</div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </AccordionDetails>
                </Accordion> */
}
