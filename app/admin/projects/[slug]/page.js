"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  ImageListItem,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  TextField,
  Typography,
  Modal,
  Dialog,
  Button,
  FormControlLabel,
  Checkbox,
  DialogContentText,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaMinus, FaPlus } from "react-icons/fa6";
import { IoCallSharp } from "react-icons/io5";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { BsCalendar4Event } from "react-icons/bs";
import { TbProgress } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useParams } from "next/navigation";
import Link from "next/link";
import LoaderSpinner from "../../../../components/loader/LoaderSpinner";
import { cn } from "../../../../lib/utils";
import { Check } from "@mui/icons-material";
import { BsClockHistory } from "react-icons/bs";
import { saveAs } from "file-saver";
import { RiDeleteBin6Line, RiLockPasswordLine } from "react-icons/ri";
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
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  const [showInspection, setShowInspection] = useState(null);
  const [checkListName, setCheckListName] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [workStatusOpen, setWorkStatusOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(null);
  const [taskDetails, setTaskDetails] = useState([]);
  const [approveImage, setApproveImage] = useState([]);
  const [logList, setLogList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [fileCount, setFileCount] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [openAcc, setOpenAcc] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [document, setDocument] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [activeTab, setActiveTab] = useState("Send Message");
  const [stepModal, setStepModal] = useState(false);
  const [pointName, setPointName] = useState("");
  const [checkList, setCheckList] = useState("");
  const [duration, setDuration] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [prevContent, setPrevContent] = useState("");
  const [stepName, setStepName] = useState("");
  const [issueMember, setIssueMember] = useState([]);
  const [stepModalDelete, setStepModalDelete] = useState(false);
  const [deleteStepOpen, setDeleteStepOpen] = useState(false);
  const [prevPoint, setPrevPoint] = useState(0);
  const [stepArray, setStepArray] = useState([]);
  const userName = useAuthStore(state => state.username);
  const userId = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);

  const toggleShowImage = () => {
    setShowImage(prev => !prev);
  };

  const handleDetailsChange = (panel, isExpanded) => {
    setExpandedDetails(isExpanded ? panel : false);
  };

  useEffect(() => {
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

  const getprojectDetail = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        setProjectDetails(response?.data?.data[0]);
        // console.log(response?.data?.data[0]);
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
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/log/siteid/${slug}`)
      .then(async response => {
        // console.log(response)
        setLogList(response.data.data);
        // Calculate the total file count
        let totalFileCount = 0;
        response.data?.data?.forEach(data => {
          if (data?.file?.length > 0) {
            totalFileCount += data.file.length; // Increment by the number of files in each entry
          }
        });
        // Set the final count once
        setFileCount(totalFileCount);
      })
      .catch(error => {
        console.log(error);
      });
  }, [activeTab, refresh]);

  useEffect(() => {
    getprojectDetail();
  }, [slug, refresh]);

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
    setPointList(filter[0]?.step);
  };

  const handleStepChange = async value => {
    // const { value } = e.target;
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

  const showWorkData = (content, name) => {
    setDetailsIsLoading(true);
    // setWorkDetailOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        setWorkDetails(
          response?.data?.data[0]?.project_status
            ?.filter(item => item.name === name)[0]
            ?.step?.filter(
              dt => dt.content === content
              // dt => dt.point === point && dt.content === content
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
      // axios
      //   .request(config)
      //   .then(resp => {
      //     toast.success(resp.data.message, {
      //       position: "top-center",
      //     });
      //   })
      //   .catch(err => {
      //     toast.error("Error while raise query by client", {
      //       position: "top-center",
      //     });
      //     console.log(err);
      //   });
      // setConfirmationOpen(false);
    }
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setConfirmationOpen(false);

    // close step add modal
    setStepModal(false);

    // close step delete modal
    setStepModalDelete(false);

    // close step delete modal
    setDeleteStepOpen(false);

    setIssueMember([]);
  };

  const teamOpenCancel = () => {
    setTeamOpen(false);
  };

  const documentOpenCancel = () => {
    setDocumentOpen(false);
  };

  const handleOpenInspectionDialog = () => {
    setInspectionDialogOpen(true);
    var count = 0;
    var filterData = projectDetails?.inspections?.filter(
      itm => itm.checkListStep === showInspection
    );
    setSingleInspection(filterData);
  };

  const handleInspectionDialog = () => {
    setInspectionDialogOpen(false);
  };

  const updateWorkStatus = (point, content, name, checkName) => {
    // console.log(point, content, name, checkName);
    setCheckListName(checkName);
    setCheckedItems([]);
    const lists = projectDetails?.inspections?.filter(
      data =>
        data.checkListStep === name &&
        data.name === checkName &&
        data.checkListNumber === point
    );
    // console.log(lists);
    setInspectionList(lists);
    setPoint(point);
    setContent(content);
    setName(name);
    setWorkStatusOpen(true);
    setImage("");
    setStatus("");
    setDate(formatedtoday);
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`)
      .then(response => {
        // console.log(
        //   response.data.data[0]?.project_status
        //     .filter(item => item.name === name)[0]
        //     .step?.filter(dt => dt.point === point && dt.content === content)[0]
        //     .finalStatus[0]
        // );
        if (response?.data?.status === 200) {
          setCurrentStatus(
            response.data.data[0]?.project_status
              .filter(item => item.name === name)[0]
              .step?.filter(
                dt => dt.point === point && dt.content === content
              )[0].finalStatus[0].status
          );
          setTaskDetails(
            response?.data?.data[0]?.project_status
              ?.filter(item => item.name === name)[0]
              .step?.filter(
                dt => dt.point === point && dt.content === content
              )[0]
              ?.dailyTask?.filter(tdate => tdate.taskDate === formatedtoday)
          );
        } else {
          setTaskDetails([]);
        }
      })
      .catch(error => {
        console.log(error);
        toast.error("Error while showing task update", {
          position: "top-right",
        });
      });
  };

  const updateImageStatus = ({ point, content, name, url }) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/project/updateimagestatusbyid`,
        {
          id: slug,
          name,
          point,
          content,
          userName,
          userId,
          url,
        }
      )
      .then(response => {
        if (response?.data?.status === 200) {
          toast.success("Image Approved Successfully.");
        }
      });
  };

  const workStatusCancel = () => {
    // Close the task dialog
    setWorkStatusOpen(false);
    setCheckListName("");
    setInspectionList([]);
  };

  const handleWorkStatusUpdate = () => {
    setOpenAccordion("");
    setWorkStatusOpen(false);
    setLoading(true);
    // Extract all mandatory points from the checklist
    const mandatoryPoints = inspectionList[0]?.checkList?.flatMap(
      checklistItem =>
        checklistItem.points?.filter(
          point => point.status?.toLowerCase() === "mandatory"
        )
    );

    // Check if any mandatory point is not checked
    const hasUnCheckedMandatory = mandatoryPoints?.some(mandatoryPoint => {
      const checkedPoint = checkedItems?.find(
        point => point.point === mandatoryPoint.point
      );
      return !checkedPoint || !checkedPoint.checked;
    });

    // console.log(status);

    if (!status) {
      toast.error("Status is required", {
        position: "top-center",
      });
    } else if (approveImage?.length === 0) {
      toast.error("Approval Image is required", {
        position: "top-center",
      });
    } else if (
      hasUnCheckedMandatory ||
      (inspectionList?.length > 0 && checkedItems?.length === 0)
    ) {
      toast.error(" Checked all mandatory inspection is required", {
        position: "top-center",
      });
    }
    // else if (!chatLog) {
    //   toast.error("Chat Log is required", {
    //     position: "top-center",
    //   });
    // }
    else {
      const formData = new FormData();
      formData.append("id", slug);
      formData.append("name", name);
      formData.append("point", point);
      formData.append("content", content);
      formData.append("status", status);
      for (let i = 0; i < approveImage?.length; i++) {
        formData.append("image", approveImage[i]);
      }
      formData.append("date", date);
      formData.append("checkListName", checkListName);
      // formData.append("chatLog", chatLog);
      formData.append("userName", userName);
      formData.append("userId", userId);
      if (currentStatus === "Completed") {
        toast.error("You have already completed this point.");
        setWorkStatusOpen(false);
      } else {
        axios
          .put(
            `${process.env.REACT_APP_BASE_PATH}/api/project/updatestatusbyid`,
            formData
          )
          .then(response => {
            setApproveImage([]);
            if (response) {
              axios
                .get(
                  `${process.env.REACT_APP_BASE_PATH}/api/project/databyid/${slug}`
                )
                .then(response => {
                  setProjectDetails(response?.data?.data[0]);
                  // console.log(response?.data?.data);
                  setRefresh(prev => !prev);
                })
                .catch(error => {
                  toast.error("Error while update project status");
                });
              setLoading(false);
              setName("");
              setPoint("");
              setContent("");
              setStatus("");
              setCheckListName("");
              setInspectionList([]);
              setCheckedItems([]);
              toast.success(response.data.message);
            }
          })
          .catch(error => {
            setLoading(false);
            setName("");
            setPoint("");
            setContent("");
            setStatus("");
            setCheckListName("");
            setInspectionList([]);
            setCheckedItems([]);
            setApproveImage([]);
            setWorkStatusOpen(false);
            console.log(error);
            toast.error("Error while update project status");
          });
      }
    }
  };

  const handleWorkStatusChange = e => {
    const { checked, value } = e.target;
    // console.log(value)
    if (checked) {
      // Add checkbox value to array if checked
      setApproveImage([...approveImage, value]);
    } else {
      // Remove checkbox value from array if unchecked
      setApproveImage(approveImage.filter(val => val !== value));
    }
  };

  const downloadImage = url => {
    saveAs(url, "site_image.jpg");
  };

  const deleteStatusImage = async ({ point, content, name }) => {
    setOpenAccordion("");
    toggleShowImage();
    setLoading(true);
    const formData = new FormData();
    formData.append("_id", projectDetails._id);
    formData.append("url", showImageUrl);
    formData.append("name", name);
    formData.append("point", point);
    formData.append("content", content);
    await fetch(
      `${process.env.REACT_APP_BASE_PATH}/api/project/deletestatusimage`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    ).then(res => {
      setLoading(false);
      if (res.ok) {
        toast.success("Image deleted successfully.");
      } else {
        toast.error("Something went wrong while deleting the image.");
      }
    });
  };

  const handleUploadDocument = () => {
    const formData = new FormData();
    formData.append("name", documentName);
    formData.append("client", projectDetails?.client?.id);
    formData.append("siteID", slug);
    formData.append("user", userId);
    formData.append("userName", userName);
    formData.append("date", formatedtoday);
    for (let i = 0; i < document?.length; i++) {
      formData.append("document", document[i]);
    }
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_PATH}/api/admin/project-document/add`,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    };
    axios
      .request(config)
      .then(resp => {
        // console.log(resp);
        setDocumentName("");
        setDocument("");
        toast.success(resp?.data?.message);
        setRefresh(!refresh);
      })
      .catch(err => {
        toast.error("Error while uploading document.");
        console.log(err);
      });
    setDocumentDialogOpen(false);
  };

  const handleDocumentClose = () => {
    setDocumentDialogOpen(false);
  };

  const uploadDocument = () => {
    setDocumentDialogOpen(true);
    setDocumentName("");
    setDocument("");
  };

  const AddProjectStepSubmit = () => {
    // console.log(pointName,checkList,checkListName,duration,prevContent,prevPoint,status,issueMember)
    if (!pointName) {
      toast.error("Point Name is required", {
        position: "top-right",
      });
    } else if (!checkList) {
      toast.error("CheckList is required", {
        position: "top-right",
      });
    } else if (checkList === "yes" && !checkListName) {
      toast.error("CheckList Name is required", {
        position: "top-right",
      });
    } else if (!duration) {
      toast.error("Duration is required", {
        position: "top-right",
      });
    } else if (issueMember?.length === 0) {
      toast.error("Issue member is required", {
        position: "top-right",
      });
    } else if (!prevContent) {
      toast.error("Content is required", {
        position: "top-right",
      });
    } else {
      const data = {
        id: slug,
        stepName: stepName,
        pointName: pointName,
        checkList: checkList,
        checkListName: checkListName,
        duration: duration,
        issueMember: issueMember,
        prevContent: prevContent?.split("$")[0],
        prevPoint: prevPoint,
        activeUser: userId,
        userName: userName,
        uploadData: {
          manager: projectDetails?.project_manager,
          engineer: projectDetails?.site_engineer,
          sr_engineer: projectDetails?.sr_engineer,
          contractor: projectDetails?.contractor,
          operation: projectDetails?.operation,
          sales: projectDetails?.sales,
          admin: projectDetails?.project_admin,
          accountant: projectDetails?.accountant,
        },
        date: formatedtoday,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/project/createnewpoint`,
          data
        )
        .then(response => {
          if (response.data.status == 200) {
            toast.success(response.data.message, {
              position: "top-right",
            });
            setStepModal(false);
            getprojectDetail();
            setPointList([]);
            setRefresh(!refresh);
          }
        })
        .catch(error => {
          toast.error("Error while add new point", {
            position: "top-right",
          });
          console.log(error);
        });
    }
  };

  const AddStepOpenModal = (step, name) => {
    // console.log(step)
    setStepModal(true);
    setStepName(name);
    setPointList(step);
    setIssueMember([]);
    setPrevContent("");
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        if (response) {
          console.log(response.data.data);
          setAllMemberList(response.data.data);
          const uniqueRoles = response.data.data.filter(
            (user, index, self) =>
              index === self.findIndex(u => u.role === user.role)
          );
          setMemberList(uniqueRoles);
        }
      })
      .catch(error => {
        console.log(error);
      });
    setPointName("");
    setCheckList("");
    setCheckListName("");
    setDuration("");
    setContent("");
    setStatus("");
    setPoint("");
  };

  const DeleteStepOpenModal = (step, name) => {
    setStepModalDelete(true);
    setStepName(name);
    setPointList(step);
    setCheckList("");
    setCheckListName("");
  };

  const memberChange = (value, isChecked) => {
    if (isChecked) {
      // Add role if checked
      if (!issueMember.includes(value)) {
        setIssueMember(prev => [...prev, value]); // Use spread operator to add new value
      }
    } else {
      // Remove role if unchecked
      setIssueMember(prev =>
        prev.filter(selectedRole => selectedRole !== value)
      ); // Use filter to remove value
    }
  };

  const getPrevPoint = value => {
    const pt = value?.split("$")[1];
    setPrevPoint(pt);
  };

  const DeleteProjectStepSubmit = () => {
    const data = {
      id: slug,
      name: stepName,
      point: parseInt(point),
      content: content?.split("$")[0],
      checkList: checkList,
      checkListName: checkListName,
      activeUser: userId,
      userName: userName,
      date: formatedtoday,
    };
    axios
      .put(`${process.env.REACT_APP_BASE_PATH}/api/project/deletepoint`, data)
      .then(response => {
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: "top-right",
          });
          setStepModalDelete(false);
          getprojectDetail();
          setRefresh(!refresh);
        }
      })
      .catch(error => {
        toast.error("Error while delete project field", {
          position: "top-right",
        });
        console.log(error);
      });
  };

  const getPoint = value => {
    const pt = value?.split("$")[1];
    setPoint(pt);
    let singlePt = pointList?.filter(dt => dt.point === parseInt(pt));
    // console.log(pointList,singlePt)
    setCheckList(singlePt[0]?.checkList);
    setCheckListName(singlePt[0]?.checkListName);
  };

  const confirmDeleteProjectStep = async (id, name, p_step) => {
    setDeleteStepOpen(true);
    setName(name);
    setStepArray(p_step);
  };

  const DeleteProjectStep = () => {
    const data = {
      id: slug,
      name: name,
      project_step: stepArray,
      // date: formatedtoday,
      userName: userName,
      activeUser: userId,
    };
    console.log(data);
    axios
      .put(`${process.env.REACT_APP_BASE_PATH}/api/project/deletestep`, data)
      .then(response => {
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setDeleteStepOpen(false);
          getprojectDetail();
        }
      })
      .catch(error => {
        toast.error("Error while delete project field", {
          position: "top-right",
        });
        console.log(error);
      });
  };

  return (
    <AsideContainer>
      {Loading && <LoaderSpinner />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex flex-row my-4 justify-between -md:flex-col -md:gap-2 -md:pl-0 -md:my-2">
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Project Details
          </h1>
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          <Link href={`/admin/projects/payment-stages/${slug}`}>
            <button className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] hover:bg-secondary [&_div]:hover:text-primary">
              <div className="text-secondary flex flex-row">
                <p className="text-[13px] font-bold leading-none -md:text-xs">
                  Payment Stages
                </p>
              </div>
            </button>
          </Link>
          <Link href={`/admin/projects/payment-details/${slug}`}>
            <button className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] hover:bg-secondary [&_div]:hover:text-primary">
              <div className="text-secondary flex flex-row">
                <p className="text-[13px] font-bold leading-none -md:text-xs">
                  Payment Details
                </p>
              </div>
            </button>
          </Link>
          {userType === "ROLE_ADMIN" && (
            <>
              <Link href={`/admin/projects/view-checklist/${slug}`}>
                <button
                  // onClick={uploadDocument}
                  className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] hover:bg-secondary [&_div]:hover:text-primary"
                >
                  <div className="text-secondary flex flex-row">
                    <p className="text-[13px] font-bold leading-none -md:text-xs">
                      Project Inspections
                    </p>
                  </div>
                </button>
              </Link>

              <button
                onClick={uploadDocument}
                className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] cursor-pointer hover:bg-secondary [&_div]:hover:text-primary"
              >
                <div className="text-secondary flex flex-row">
                  <p className="text-[13px] font-bold leading-none">
                    Add Documents
                  </p>
                </div>
              </button>
            </>
          )}
          <button
            className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] cursor-pointer hover:bg-secondary [&_div]:hover:text-primary"
            onClick={() => updateStatus()}
          >
            <div className="text-secondary flex flex-row">
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
          <Select
            onValueChange={value => {
              if (value === showInspection) {
                setInspectionDialogOpen(true);
              } else {
                handleOpenInspectionDialog();
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No. of Inspections" />
            </SelectTrigger>
            <SelectContent>
              {projectDetails?.project_status
                ?.sort((a, b) => a.priority - b.priority)
                ?.map((item, index) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
          {/* <div>
            <p className="font-semibold">No. of Inspections</p>
            <ul className="dropdown-menu">
              {projectDetails?.project_status
                ?.sort((a, b) => a.priority - b.priority)
                ?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleOpenInspectionDialog(item?.name)}
                    >
                      <span className="dropdown-item">{item.name}</span>
                    </li>
                  );
                })}
            </ul>
          </div> */}
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
              <Accordion
                type="single"
                collapsible
                key={item.name}
                value={openAcc}
                onValueChange={value => setOpenAcc(value)}
              >
                <AccordionItem
                  value={item.name}
                  className="bg-white rounded-[14px] mb-2"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex flex-row justify-between w-full pr-8">
                      <div className="flex text-lg font-ubuntu justify-center items-center font-bold">
                        {item.name}
                      </div>
                      <div className="flex flex-row gap-4 items-center">
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
                        {userType === "ROLE_ADMIN" && (
                          <span
                            className="p-2 text-lg border border-primary rounded-full font-semibold text-primary cursor-pointer"
                            onClick={() =>
                              confirmDeleteProjectStep(
                                item?.siteID,
                                item?.name,
                                item?.step
                              )
                            }
                          >
                            <RiDeleteBin6Line />
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="py-0">
                    <div className="bg-[#efefef] h-[7rem] pt-2">
                      <div className="flex flex-row justify-end gap-2 mb-2">
                        <span
                          className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer"
                          onClick={() =>
                            AddStepOpenModal(item?.step, item?.name)
                          }
                        >
                          <FaPlus />
                        </span>
                        <span
                          className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer"
                          onClick={() =>
                            DeleteStepOpenModal(item?.step, item?.name)
                          }
                        >
                          <FaMinus />
                        </span>
                      </div>
                      <div className=" bg-secondary text-primary h-16 flex flex-row justify-evenly items-center rounded-t-3xl flex-auto text-base font-semibold -md:justify-between">
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
                    <Accordion
                      type="single"
                      collapsible
                      value={openAccordion}
                      onValueChange={value => {
                        setOpenAccordion(value);
                        if (value) {
                          showWorkData(value.split("_")[0], item.name);
                        }
                      }}
                    >
                      {item.step?.map((itm, idx) => {
                        let initialDate = new Date(projectDetails?.date);
                        const dur = itm.duration ? parseInt(itm.duration) : 0;
                        // Add duration days
                        initialDate.setDate(initialDate.getDate() + dur);
                        // Get the final date
                        let finalDate = initialDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
                        return (
                          <AccordionItem
                            value={itm.content + "_" + +idx}
                            key={itm.content + +idx}
                            className="px-4"
                          >
                            <AccordionTrigger className="py-0 outline-none">
                              <div className="flex flex-row justify-evenly w-full">
                                <div className="relative w-[120px] -md:w-8">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div
                                      className={cn(
                                        "w-[2px] bg-secondary pointer-events-none h-full",
                                        idx === 0 ? "mt-[100%] h-8" : "",
                                        idx === item.step.length - 1
                                          ? "mb-[100%] h-8"
                                          : "",
                                        itm.finalStatus[0].status !==
                                          "Completed"
                                          ? "bg-secondary"
                                          : ""
                                      )}
                                    />
                                  </div>
                                  <div
                                    className={cn(
                                      "w-8 h-8 absolute top-1/2 md:right-[92px] -md:right-1 -mt-4 rounded-full bg-green-500 shadow-xl text-center",
                                      itm.finalStatus[0].status !== "Completed"
                                        ? "bg-primary"
                                        : ""
                                    )}
                                  >
                                    {itm.finalStatus[0].status ===
                                      "Pending" && (
                                      <BsClockHistory className="mt-1 ml-1 text-secondary text-2xl " />
                                    )}
                                    {itm.finalStatus[0].status ===
                                      "Completed" && (
                                      <Check
                                        sx={{
                                          marginTop: "4px",
                                          fontSize: "24px",
                                          color: "white",
                                        }}
                                      />
                                    )}
                                    {itm.finalStatus[0].status ===
                                      "Work in Progress" && (
                                      <TbProgress className="mt-1 ml-1 text-secondary text-2xl " />
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
                                <div className="w-[200px] -md:w-28 my-1">
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
                            </AccordionTrigger>
                            <AccordionContent>
                              {!detailsIsloading && (
                                <div className="p-5 shadow-lg rounded-3xl border-[1px] border-primary mx-6 -lg:mx-2 -md:p-3">
                                  <div className="flex flex-row justify-between items-center">
                                    <h5 className="text-lg font-bold mb-4">
                                      Details :
                                    </h5>
                                    {userType === "ROLE_ADMIN" ||
                                    userType === "ROLE_PROJECT MANAGER" ||
                                    itm.issueMember
                                      .map(item => item.toLowerCase())
                                      .includes(
                                        userType.toLowerCase().split("_")[1]
                                      ) ? (
                                      <button
                                        onClick={() => {
                                          updateWorkStatus(
                                            itm.point,
                                            itm.content,
                                            item.name,
                                            itm?.checkListName
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className="px-3 py-2 font-semibold bg-secondary text-primary rounded-full font-ubuntu -md:px-2 -md:py-[6px]"
                                      >
                                        Update To Client
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div>
                                    <div>
                                      <span className="font-semibold ">
                                        Updated on:{" "}
                                      </span>
                                      {workDetails[0]?.date}
                                    </div>
                                    <div className="relative flex flex-row gap-2 mt-2">
                                      {workDetails[0]?.image?.map(
                                        (imgObj, imgidx) => (
                                          <div key={imgObj.url}>
                                            {imgObj.isApproved ||
                                            userType !== "ROLE_CLIENT" ? (
                                              <div
                                                className="cursor-pointer [&_span]:hover:block"
                                                onClick={() => {
                                                  setShowImageUrl(imgObj.url);
                                                  toggleShowImage(imgObj.url);
                                                }}
                                              >
                                                {!showImage && (
                                                  <span className="w-16 rounded-xl h-full bg-black bg-opacity-30 absolute hidden text-primary-foreground text-center">
                                                    <p className="mt-5 font-semibold">
                                                      View
                                                    </p>
                                                  </span>
                                                )}

                                                <img
                                                  src={imgObj.url}
                                                  alt={imgObj.url}
                                                  className="w-16 h-16 rounded-xl transition-all duration-300 rounded-lg"
                                                />
                                              </div>
                                            ) : (
                                              ""
                                            )}

                                            <Modal
                                              open={showImage}
                                              onClose={toggleShowImage}
                                              sx={{
                                                "display": "flex",
                                                "alignItems": "center",
                                                "justifyContent": "center",
                                                "& .MuiBackdrop-root": {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0.1)",
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
                                                  {userType === "ROLE_ADMIN" ||
                                                  userType ===
                                                    "ROLE_PROJECT MANAGER" ? (
                                                    <>
                                                      <div
                                                        className="py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap cursor-pointer"
                                                        onClick={() => {
                                                          updateImageStatus({
                                                            _id: "id",
                                                            point: itm.point,
                                                            content:
                                                              itm.content,
                                                            name: item.name,
                                                            url: imgObj.url,
                                                          });
                                                        }}
                                                      >
                                                        <FaCheck className="text-xl" />
                                                        <p>Approve Image</p>
                                                      </div>
                                                      <button
                                                        className="py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap"
                                                        onClick={() => {
                                                          deleteStatusImage({
                                                            point: itm.point,
                                                            content:
                                                              itm.content,
                                                            name: item.name,
                                                          });
                                                        }}
                                                      >
                                                        <MdDeleteOutline className="text-xl" />
                                                        Delete Image
                                                      </button>
                                                    </>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <button
                                                    className="py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap"
                                                    onClick={() => {
                                                      downloadImage(
                                                        imgObj.image
                                                      );
                                                    }}
                                                  >
                                                    <FiDownload className="text-xl" />
                                                    Download Image
                                                  </button>
                                                </div>
                                              </div>
                                            </Modal>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div className="font-semibold mt-2">
                                      Status : {workDetails[0]?.status}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
      </div>

      {/* <Modal
        open={showImage}
        onClose={toggleShowImage}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="bg-white rounded-3xl w-2/4 h-4/5">
          <img
            src={showImageUrl}
            alt="site-image"
            className="w-20 h-full rounded-xl transition-all duration-300 rounded-lg"
          />
        </div>
      </Modal> */}

      <Dialog open={workStatusOpen} onClose={workStatusCancel}>
        <DialogTitle>Update Project Work By Admin</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <FormControl fullWidth className="mt-1 mb-1">
            <Typography id="demo-simple-select-label">
              Status<span className="text-danger">*</span>
            </Typography>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Work in Progress">Work in Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </MUISelect>
          </FormControl>
          <FormControl fullWidth>
            {taskDetails?.length > 0 ? (
              taskDetails?.map((item, index) => {
                return (
                  <div key={index}>
                    {item?.taskImage?.map((dt, idx) => {
                      return (
                        <ImageListItem
                          key={idx}
                          style={{ display: "flex", margin: "10px 0px" }}
                        >
                          <input
                            type="checkbox"
                            className="me-3"
                            name="image"
                            value={dt}
                            onChange={handleWorkStatusChange}
                          />
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
              })
            ) : (
              <>
                <Typography>
                  File<span className="text-danger">*</span>
                </Typography>
                <TextField
                  type="file"
                  c
                  className=""
                  name="image"
                  inputProps={{ multiple: true }}
                  onChange={e => setApproveImage(e.target.files)}
                />
              </>
            )}
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            <Typography>
              Date<span className="text-danger">*</span>
            </Typography>
            <TextField
              type="date"
              name="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled
            />
          </FormControl>
          <div className="row mt-2">
            {inspectionList?.length > 0 ? (
              <>
                <span className="heads_inspection text-uppercase">
                  Inspections <span className="text-danger">*</span>
                </span>
                {inspectionList[0]?.checkList?.map((item, id) => {
                  return (
                    <div key={id} className="col-lg-12 col-md-12">
                      <span
                        className="heads_inspection text-warning"
                        style={{ fontSize: "14px" }}
                      >
                        {item?.heading}
                      </span>
                      {item?.points?.map((pt, idx) => {
                        return (
                          <div key={idx} className="inspection-box-col-points">
                            <span className="text text-warning">
                              {idx + 1}
                              {`- `}
                            </span>
                            <span className="number mx-2">
                              <span>
                                {pt.point}
                                {pt?.status?.toLowerCase() === "mandatory" ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span
                                className="mx-2"
                                style={{ marginTop: "3px" }}
                              >
                                <input
                                  type="checkbox"
                                  id="c1s"
                                  name={pt.status}
                                  value={pt.point}
                                  className="inputs"
                                  checked={
                                    !!checkedItems.find(
                                      item => item.point === pt.point
                                    )?.checked
                                  }
                                  onChange={handleInspectionChange}
                                />
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
          {/* <FormControl fullWidth>
            <Typography>
              Log<span className="text-danger">*</span>
            </Typography>
            <TextField
              type="text"
              className=""
              name="chatLog"
              onChange={(e) => setChatLog(e.target.value)}
            />
          </FormControl> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={workStatusCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWorkStatusUpdate} color="primary">
            Update To Client
          </Button>
        </DialogActions>
      </Dialog>

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
                        <span className="bg-secondary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By You
                        </span>
                      ) : item?.status === "Accepted" ? (
                        <span className="bg-secondary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By You
                        </span>
                      ) : (
                        <span className="bg-secondary text-primary-foreground rounded-lg px-2 py-1">
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

      {/* RAISE TIKCET */}
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
              <input
                type="file"
                name="image"
                onChange={e => setImage(e.target.files)}
                className="w-full rounded-2xl text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-4 file:px-6 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500"
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
          <div className="flex flex-row items-center justify-end gap-4">
            <button
              onClick={handleCancel}
              color="primary"
              className="bg-transparent border-2 border-secondary rounded-full px-4 py-2 text-secondary font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-secondary rounded-full px-4 py-2 text-primary font-semibold border-2 border-secondary"
            >
              Update
            </button>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInspectionDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={documentDialogOpen}
        onClose={handleDocumentClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="w-1/3 -md:w-11/12 bg-white p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-center font-ubuntu mb-4">
            Upload Document
          </h2>
          <div className="flex flex-col gap-2 [&_label]:font-semibold">
            <label>Document Name</label>
            <input
              className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              value={documentName}
              type="text"
              placeholder="Enter Document Name"
              name="documentName"
              onChange={e => setDocumentName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 [&_label]:font-semibold">
            <label>Document</label>
            <input
              type="file"
              name="document"
              inputProps={{ multiple: true }}
              onChange={e => setDocument(e.target.files)}
              className="w-full text-gray-400 text-sm bg-gray-100 border py-[6px] px-2 file:cursor-pointer cursor-pointer  file:rounded-[7px] border-primary file:py-2 file:px-3 file:mr-4 file:bg-primary-foreground file:border file:border-primary file:text-secondary file:hover:bg-secondary file:hover:text-primary rounded-[7px]"
            />
          </div>
          <div className="flex flex-row gap-4 mt-4 justify-end">
            <button
              onClick={handleDocumentClose}
              className="border-2 cursor-pointer font-semibold text-secondary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-transparent border-secondary -md:px-4 -md:py-2 -md:text-sm hover:bg-secondary hover:text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadDocument}
              className="border-2 cursor-pointer font-semibold text-primary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-secondary border-secondary -md:px-4 -md:py-2 -md:text-sm"
            >
              Upload Document
            </button>
          </div>
        </div>
      </Modal>

      <Dialog open={stepModal} onClose={handleCancel}>
        <DialogTitle>Add Point</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Point Name</InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Point Name
            </label>
            <TextField
              type="text"
              name="pointName"
              value={pointName}
              onChange={e => setPointName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">CheckList</InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              CheckList
            </label>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={checkList}
              name="checkList"
              onChange={e => setCheckList(e.target.value)}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </MUISelect>
          </FormControl>
          {checkList === "yes" && (
            <FormControl fullWidth className="mt-1 mb-1">
              {/* <InputLabel id="demo-simple-select-label">
                CheckList Name
              </InputLabel> */}
              <label style={{ fontSize: "18px", color: "#fec20e" }}>
                CheckList Name
              </label>
              <TextField
                type="text"
                name="checkListName"
                value={checkListName}
                onChange={e => setCheckListName(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">
              Duration (In days)
            </InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Duration (In days)
            </label>
            <TextField
              type="number"
              name="duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Issue Member
            </label>
            <FormControlLabel
              value="admin"
              control={<Checkbox />}
              label="Admin"
              onChange={e => memberChange(e.target.value, e.target.checked)}
            />
            {memberList?.map((data, id) => {
              return (
                <FormControlLabel
                  key={id}
                  value={data.role}
                  control={<Checkbox />}
                  label={data.role}
                  onChange={e => memberChange(e.target.value, e.target.checked)}
                />
              );
            })}
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Content</InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              After Content
            </label>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={prevContent} // Adjust value to reflect state
              name="prevContent"
              onChange={e => {
                setPrevContent(e.target.value);
                getPrevPoint(e.target.value);
              }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={AddProjectStepSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={stepModalDelete} onClose={handleCancel}>
        <DialogTitle>Delete Point</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Content</InputLabel> */}
            <label style={{ fontSize: "18px", color: "#fec20e" }}>
              Content
            </label>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={content} // Adjust value to reflect state
              name="content"
              onChange={e => {
                setContent(e.target.value);
                getPoint(e.target.value);
              }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={DeleteProjectStepSubmit} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteStepOpen}
        onClose={handleCancel}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Are you sure want to delete ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={DeleteProjectStep}>Delete</Button>
        </DialogActions>
      </Dialog>
    </AsideContainer>
  );
};

export default ClientProjectView;
