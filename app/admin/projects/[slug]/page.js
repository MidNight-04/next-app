'use client';
import api from '../../../../lib/api';
import React, { useEffect, useRef, useState } from 'react';
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
  DialogContentText,
} from '@mui/material';
import { toast } from 'sonner';
import { FaDownload, FaMinus, FaPlus } from 'react-icons/fa6';
import { IoCallSharp } from 'react-icons/io5';
import { IoDocumentsOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { MdLockOutline, MdOutlineEdit } from 'react-icons/md';
import { BsCalendar4Event } from 'react-icons/bs';
import { TbProgress } from 'react-icons/tb';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import { cn } from '../../../../lib/utils';
import { Check } from '@mui/icons-material';
import { BsClockHistory } from 'react-icons/bs';
import { RiDeleteBin6Line, RiLockPasswordLine } from 'react-icons/ri';
import AsideContainer from '../../../../components/AsideContainer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/ui/accordion';
import { useAuthStore } from '../../../../store/useAuthStore';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { LuTimerReset } from 'react-icons/lu';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';

let today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let formatedtoday = yyyy + '-' + mm + '-' + dd;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-[15px] py-[12px] bg-transparent border-2 border-secondary rounded-full font-ubuntu -md:px-2 -md:py-[6px] cursor-pointer hover:bg-secondary [&_div]:hover:text-primary"
  >
    <div className="text-secondary flex flex-row">
      <p className="text-[13px] font-semibold leading-none -md:text-xs">
        {children}
      </p>
    </div>
  </button>
);

const StatCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className="p-5 w-full rounded-[14px] bg-white font-ubuntu flex justify-between items-center cursor-pointer [&_svg]:text-primary"
  >
    <span className="font-semibold">{label}</span>
    <span className="px-[10px] py-[3px] font-semibold rounded-full border border-primary bg-primary-foreground text-primary">
      {value}
    </span>
  </div>
);

const ClientProjectView = () => {
  const linkRef = useRef(null);
  const { slug } = useParams();
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [log, setLog] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [id, setId] = useState('');
  const [point, setPoint] = useState('');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [workDetailOpen, setWorkDetailOpen] = useState(false);
  const [workDetails, setWorkDetails] = useState([]);
  const [showContent, setShowContent] = useState([]);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [totalInspection, setTotalInspection] = useState(0);
  const [singleInspection, setSingleInspection] = useState(0);
  const [step, setStep] = useState('');
  const [pointList, setPointList] = useState([]);
  const [assignMember, setAssignMember] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailsIsloading, setDetailsIsLoading] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [showInspection, setShowInspection] = useState(null);
  const [checkListName, setCheckListName] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [workStatusOpen, setWorkStatusOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(null);
  const [taskDetails, setTaskDetails] = useState([]);
  const [approveImage, setApproveImage] = useState([]);
  const [logList, setLogList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [fileCount, setFileCount] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [openAcc, setOpenAcc] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [document, setDocument] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [activeTab, setActiveTab] = useState('Send Message');
  const [stepModal, setStepModal] = useState(false);
  const [pointName, setPointName] = useState('');
  const [checkList, setCheckList] = useState('');
  const [stepDuration, setStepDuration] = useState(null);
  const [duration, setDuration] = useState('');
  const [memberList, setMemberList] = useState([]);
  const [prevContent, setPrevContent] = useState('');
  const [stepName, setStepName] = useState('');
  const [issueMember, setIssueMember] = useState(null);
  const [stepModalDelete, setStepModalDelete] = useState(false);
  const [deleteStepOpen, setDeleteStepOpen] = useState(false);
  const [extensionOpen, setExtensionOpen] = useState(false);
  const [force, setForce] = useState(false);
  const [startForceDate, setStartForceDate] = useState(null);
  const [endForceDate, setEndForceDate] = useState(null);
  const [prevPoint, setPrevPoint] = useState(0);
  const [stepArray, setStepArray] = useState([]);
  const userName = useAuthStore(state => state.username);
  const userId = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);
  const [openChangeMember, setOpenChangeMember] = useState(false);
  const [issue, setIssue] = useState(null);
  const [newMember, setNewMember] = useState(null);
  const [teammembersByRole, setTeammembersByRole] = useState([]);
  const { token } = useAuthStore.getState();

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

  const getprojectDetail = () => {
    api
      .get(`/project/databyid/${slug}`)
      .then(response => {
        const data = response?.data?.data?.[0];
        if (!data) return;

        setProjectDetails(data);
        setTotalInspection(data?.inspections?.length || 0);

        const durationInMonths = parseInt(data?.duration || '0', 10);
        const initialDate = new Date(data?.date);

        const start = new Date(initialDate);
        const end = new Date(initialDate);
        end.setMonth(end.getMonth() + durationInMonths);

        const formatDate = date => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
      })
      .catch(error => {
        console.error('Error fetching project detail:', error);
      });
  };

  useEffect(() => {
    getprojectDetail();
  }, [slug, token]);

  useEffect(() => {
    if (Array.isArray(pointList) && pointList.length > 0) {
      const { point, content } = pointList[0];
      setPoint(point);
      setContent(content);
    }
  }, [pointList]);

  const getPointListByStep = step => {
    const filter = projectDetails?.project_status?.filter(
      obj => obj.name === step
    );
    setPointList(filter[0]?.step);
  };

  const handleStepChange = value => {
    const pt = value?.split('$')[1];
    setPoint(pt);
    if (step) {
      const filtered = projectDetails?.project_status?.find(
        obj => obj.name === step
      )?.step;
      if (filtered) {
        const selectedTask = filtered.find(
          dt => dt.taskId.title === value?.split('$')[0]
        );
        if (selectedTask) {
          const member = selectedTask.taskId.issueMember?._id;
          setAssignMember(member);
        }
      }
    }
  };

  const updateStatus = () => {
    setPoint('');
    setPointList([]);
    setContent('');
    setStep('');
    setConfirmationOpen(true);
    setImage('');
    setStatus('');
    setLog('');
    setDate(formatedtoday);
  };

  const documentDialogFunction = () => {
    setDocumentOpen(true);
    api
      .get(`/client/project-document/bysiteid/${slug}`)
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
    if (!status) return toast('Work is required');
    if (!step) return toast('Query step log is required');
    if (!content) return toast('Query content is required');
    if (!date) return toast('Date is required');

    const formData = new FormData();
    formData.append('id', slug);
    formData.append('name', step);
    formData.append('point', String(parseInt(point)));
    formData.append('content', content.split('$')[0] || '');
    formData.append('assignedBy', userId);
    formData.append('assignMember', assignMember);
    formData.append('status', status);
    formData.append('log', log);
    formData.append('date', date);

    if (Array.isArray(image)) {
      image.forEach(img => formData.append('image', img));
    }

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `/project/client-query`,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    };

    api
      .request(config)
      .then(resp => {
        toast(resp.data.message);
      })
      .catch(err => {
        toast('Error while raising query by client');
        console.error(err);
      });

    setConfirmationOpen(false);
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

  const workStatusCancel = () => {
    // Close the task dialog
    setWorkStatusOpen(false);
    setCheckListName('');
    setInspectionList([]);
  };

  const handleWorkStatusUpdate = () => {
    setOpenAccordion('');
    setWorkStatusOpen(false);
    setLoading(true);

    const mandatoryPoints = inspectionList[0]?.checkList?.flatMap(
      item =>
        item.points?.filter(
          point => point.status?.toLowerCase() === 'mandatory'
        ) || []
    );

    const hasUnCheckedMandatory = mandatoryPoints?.some(mandatoryPoint => {
      const checkedPoint = checkedItems?.find(
        point => point.point === mandatoryPoint.point
      );
      return !checkedPoint?.checked;
    });

    if (!status) {
      toast('Status is required');
      setLoading(false);
      return;
    }

    if (
      hasUnCheckedMandatory ||
      (inspectionList?.length > 0 && checkedItems?.length === 0)
    ) {
      toast('Checked all mandatory inspection is required');
      setLoading(false);
      return;
    }

    if (currentStatus === 'Completed') {
      toast('You have already completed this point.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('id', slug);
    formData.append('name', name);
    formData.append('point', point);
    formData.append('content', content);
    formData.append('status', status);
    formData.append('date', date);
    formData.append('checkListName', checkListName);
    formData.append('userName', userName);
    formData.append('userId', userId);
    // formData.append('chatLog', chatLog);

    if (Array.isArray(approveImage)) {
      approveImage.forEach(image => formData.append('image', image));
    }

    api
      .put(`/project/updatestatusbyid`, formData)
      .then(response => {
        toast(`${response.data.message}`);
        clearWorkStatusState();

        // Fetch updated project details
        return api.get(`/project/databyid/${slug}`);
      })
      .then(response => {
        setProjectDetails(response?.data?.data[0]);
        setRefresh(prev => !prev);
      })
      .catch(error => {
        console.error(error);
        toast('Error while updating project status');
        clearWorkStatusState();
      });
  };

  const clearWorkStatusState = () => {
    setLoading(false);
    setApproveImage([]);
    setName('');
    setPoint('');
    setContent('');
    setStatus('');
    setCheckListName('');
    setInspectionList([]);
    setCheckedItems([]);
    setWorkStatusOpen(false);
  };

  const handleWorkStatusChange = e => {
    const { checked, value } = e.target;
    if (checked) {
      // Add checkbox value to array if checked
      setApproveImage([...approveImage, value]);
    } else {
      // Remove checkbox value from array if unchecked
      setApproveImage(approveImage.filter(val => val !== value));
    }
  };

  const handleUploadDocument = () => {
    if (!documentName || !document?.length) {
      toast('Document name and files are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', documentName);
    formData.append('client', projectDetails?.client || '');
    formData.append('siteID', slug);
    formData.append('user', userId);
    formData.append('userName', userName);
    formData.append('date', formatedtoday);

    if (Array.isArray(document)) {
      document.forEach(file => formData.append('document', file));
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `admin/project-document/add`,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    };

    api
      .request(config)
      .then(resp => {
        setDocumentName('');
        setDocument('');
        setRefresh(prev => !prev);
        toast(resp?.data?.message || 'Document uploaded successfully');
      })
      .catch(err => {
        console.error(err);
        toast('Error while uploading document.');
      })
      .finally(() => {
        setDocumentDialogOpen(false);
      });
  };

  const handleDocumentClose = () => {
    setDocumentDialogOpen(false);
  };

  const uploadDocument = () => {
    setDocumentDialogOpen(true);
    setDocumentName('');
    setDocument('');
  };

  const AddProjectStepSubmit = () => {
    if (!pointName) return toast('Point Name is required');
    if (!checkList) return toast('CheckList is required');
    if (checkList === 'yes' && !checkListName)
      return toast('CheckList Name is required');
    if (!duration && force !== 'yes') return toast('Duration is required');
    if (!issueMember?.length) return toast('Issue member is required');
    if (!prevContent) return toast('Content is required');

    const isForce = force === 'yes';

    const data = {
      id: slug,
      stepName,
      pointName,
      checkList,
      checkListName,
      forceMajeure: {
        isForceMajeure: isForce,
        startDate: startForceDate,
        endDate: endForceDate,
      },
      duration: isForce
        ? (new Date(endForceDate) - new Date(startForceDate)) /
            (1000 * 60 * 60 * 24) +
          1
        : duration,
      issueMember,
      prevContent: prevContent.split('$')[0] || '',
      prevPoint,
      activeUser: userId,
      userName,
      uploadData: {
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

    api
      .put(`/project/createnewpoint`, data)
      .then(response => {
        if (response.data.status === 200) {
          toast(response.data.message);
          setStepModal(false);
          getprojectDetail();
          setPointList([]);
          setRefresh(prev => !prev);
        } else {
          toast('Unexpected response from server');
        }
      })
      .catch(error => {
        console.error(error);
        toast('Error while adding new point');
      });
  };

  const AddStepOpenModal = (step, name) => {
    setStepModal(true);
    setStepName(name);
    setPointList(step);

    // Reset relevant form fields and state
    setPointName('');
    setCheckList('');
    setCheckListName('');
    setDuration('');
    setContent('');
    setStatus('');
    setPoint('');
    setIssueMember([]);
    setPrevContent('');

    // Fetch unique roles from team member list
    api
      .get(`teammember/getall`)
      .then(response => {
        const data = response?.data?.data || [];
        const uniqueRoles = data.filter(
          (user, index, self) =>
            index === self.findIndex(u => u.role === user.role)
        );
        setMemberList(uniqueRoles);
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
      });
  };

  const DeleteStepOpenModal = (step, name) => {
    setStepModalDelete(true);
    setStepName(name);
    setPointList(step);
    setCheckList('');
    setCheckListName('');
  };

  const getPrevPoint = value => {
    const pt = value?.split('$')[1];
    setPrevPoint(pt);
  };

  const DeleteProjectStepSubmit = () => {
    const data = {
      id: slug,
      name: stepName,
      point: parseInt(point),
      content: content?.split('$')[0] || '',
      duration: stepDuration,
      checkList,
      checkListName,
      activeUser: userId,
      userName,
      date: formatedtoday,
    };

    api
      .put(`/project/deletepoint`, data)
      .then(response => {
        if (response?.data?.status === 200) {
          toast(response.data.message);
          setStepModalDelete(false);
          getprojectDetail();
          setRefresh(prev => !prev);
        } else {
          toast('Unexpected server response while deleting step');
        }
      })
      .catch(error => {
        console.error('Delete step error:', error);
        toast('Error while deleting project step');
      });
  };

  const getPoint = value => {
    const pt = value?.split('$')[1];
    setPoint(pt);
    let singlePt = pointList?.filter(dt => parseInt(dt.point) === parseInt(pt));
    setStepDuration(singlePt[0]?.duration);
    setCheckList(singlePt[0]?.taskId.checkList?.isCheckList);
    setCheckListName(singlePt[0]?.taskId.checkList?.checkListName);
  };

  const confirmDeleteProjectStep = async (id, name, p_step) => {
    setDeleteStepOpen(true);
    setName(name);
    setStepArray(p_step);
  };

  const DeleteProjectStep = () => {
    const data = {
      id: slug,
      name,
      project_step: stepArray,
      userName,
      activeUser: userId,
    };

    api
      .put(`/project/deletestep`, data)
      .then(response => {
        if (response?.data?.status === 200) {
          toast(response.data.message);
          setDeleteStepOpen(false);
          getprojectDetail();
        } else {
          toast('Failed to delete step: unexpected server response');
        }
      })
      .catch(error => {
        console.error('Delete step error:', error);
        toast('Error while deleting project step');
      });
  };

  const getTeammembersByRole = async roleId => {
    try {
      const response = await api.post(`/teammember/getTeammemberByRole`, {
        role: roleId,
      });

      if (response?.data?.data) {
        setTeammembersByRole(response.data.data);
      } else {
        toast('No team members found for this role');
      }
    } catch (error) {
      console.error('Error fetching team members by role:', error);
      toast('Failed to fetch team members');
    }
  };

  const changeIssueMember = async () => {
    const data = {
      userId,
      siteId: slug,
      issue: issue?.role?.name,
      newMember,
    };

    try {
      const response = await api.post(`/project/changeissuemember`, data);

      if (response?.data?.status === 200) {
        toast(response.data.message || 'Issue member updated successfully');
        getprojectDetail();
      } else {
        toast('Failed to update issue member');
      }
    } catch (error) {
      console.error('Error changing issue member:', error);
      toast('Error occurred while changing issue member');
    }
  };

  let initialDate = new Date(projectDetails?.date);
  let diff;

  return (
    <AsideContainer>
      {Loading && <LoaderSpinner />}
      <div className="flex flex-row -md:flex-col -md:pl-0 -md:my-2 w-full justify-between">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <IoIosArrowBack
            onClick={() => router.back()}
            className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
          />
          <h1 className="font-ubuntu font-semibold text-[25px] leading-7 py-5 whitespace-nowrap">
            Project Details
          </h1>
        </div>

        <div className="flex flex-row gap-2 flex-wrap items-center">
          <Link href={`/admin/projects/payment-stages/${slug}`}>
            <ActionButton>Payment Stages</ActionButton>
          </Link>
          <Link href={`/admin/projects/payment-details/${slug}`}>
            <ActionButton>Payment Details</ActionButton>
          </Link>

          {userType === 'ROLE_ADMIN' && (
            <ActionButton onClick={uploadDocument}>Add Documents</ActionButton>
          )}

          <ActionButton onClick={updateStatus}>Raise Ticket</ActionButton>
        </div>
      </div>
      <div className="grid grid-cols-6 -xl:grid-cols-4 -lg:grid-cols-3 -md:grid-cols-2 gap-4 -lg:gap-2 justify-evenly [&>div]:h-[88px] lg:[&>div]:p-[10px] -md:[&>div]:h-14 -lg:text-xs">
        <StatCard
          label="Documents"
          value={<IoDocumentsOutline className="text-5" />}
          onClick={documentDialogFunction}
        />
        <StatCard
          label="Team"
          value={<GoPeople className="text-5" />}
          onClick={() => setTeamOpen(true)}
        />
        <StatCard
          label={`Site ID - ${projectDetails?.siteID || 'N/A'}`}
          value={<MdLockOutline className="text-5" />}
        />
        <StatCard
          label={
            <>
              <span className="font-semibold">Start Date -</span> {startDate}
            </>
          }
          value={<BsCalendar4Event className="text-5" />}
        />
        <StatCard
          label={
            <>
              <span className="font-semibold">End Date -</span> {endDate}
            </>
          }
          value={<BsCalendar4Event className="text-5" />}
        />

        <div className="px-5 py-[14px] flex w-full flex-auto items-center justify-center bg-white rounded-[14px]">
          <Select onValueChange={value => handleOpenInspectionDialog(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No. of Inspections" />
            </SelectTrigger>
            <SelectContent>
              {projectDetails?.project_status
                ?.sort((a, b) => a.priority - b.priority)
                ?.map(item => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <StatCard
          label="Pending Inspection"
          value={
            projectDetails?.inspections?.filter(itm => itm.passed === false)
              ?.length || 0
          }
        />
        <StatCard
          label="Passed Inspection"
          value={
            projectDetails?.inspections?.filter(itm => itm.passed === true)
              ?.length || 0
          }
        />
        <StatCard
          label="Total Tickets"
          value={projectDetails?.openTicket?.length || 0}
        />
        <StatCard
          label="Pending Tickets"
          value={
            projectDetails?.openTicket?.filter(
              t => t.finalStatus !== 'Completed'
            )?.length || 0
          }
        />
        <StatCard
          label="Force Majeure"
          value={projectDetails?.extension ?? 0}
          onClick={() => setExtensionOpen(prev => !prev)}
        />
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
              if (item?.step[j]?.taskId?.status === 'Complete') {
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
                    <div className="flex flex-row justify-between w-full pr-8 -md:pr-2">
                      <p className="flex text-lg font-ubuntu justify-center items-center font-bold -md:text-sm">
                        {item.name}
                      </p>
                      <div className="flex flex-row gap-4 items-center">
                        <div style={{ width: 40, height: 40 }}>
                          <CircularProgressbar
                            value={percent}
                            text={`${percent}%`}
                            strokeWidth={14}
                            styles={buildStyles({
                              backgroundColor: '#3e98c7',
                              textColor: 'black',
                              pathColor: '#93BFCF',
                              trailColor: '#d6d6d6',
                              textSize: '1.5rem',
                            })}
                          />
                        </div>
                        {userType === 'ROLE_ADMIN' && (
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
                    <div className="bg-[#efefef]  pt-2">
                      <div className="flex flex-row justify-end gap-2 mb-2">
                        {userType !== 'ROLE_CLIENT' && (
                          <span
                            className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer"
                            onClick={() =>
                              AddStepOpenModal(item?.step, item?.name)
                            }
                          >
                            <FaPlus />
                          </span>
                        )}
                        {userType === 'ROLE_ADMIN' && (
                          <span
                            className="border border-primary rounded-full p-2 font-semibold text-primary cursor-pointer"
                            onClick={() =>
                              DeleteStepOpenModal(item?.step, item?.name)
                            }
                          >
                            <FaMinus />
                          </span>
                        )}
                      </div>
                      <div className="bg-secondary text-primary h-16 flex flex-row justify-evenly items-center rounded-t-3xl flex-auto text-base font-semibold -md:justify-between">
                        <span className="font-semibold w-24 -sm:hidden" />
                        <span className="font-semibold w-[200px] text-center -md:w-16 -md:ml-8 -sm:ml-12 -md:text-xs">
                          Point
                        </span>
                        <span className="font-semibold w-[200px] flex md:ml-6 -md:w-20 text-left -sm:ml-4 -md:text-xs">
                          Member Issue
                        </span>
                        <span className="font-semibold w-[200px] text-left -md:w-24 -md:text-xs">
                          Schedule Time
                        </span>
                        <span className="font-semibold w-[70px] text-center -md:w-24 -md:text-xs">
                          Action
                        </span>
                      </div>
                    </div>
                    <div>
                      {item.step?.map((itm, idx) => {
                        const dur = itm.duration ? parseInt(itm.duration) : 0;
                        initialDate.setDate(initialDate.getDate() + dur);
                        const formatToDate = date => {
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0'
                          );
                          const year = date.getFullYear();
                          return `${day}-${month}-${year}`;
                        };
                        if (
                          itm.taskId.status === 'Completed' &&
                          new Date(initialDate) > new Date(itm.taskId.createdAt)
                        ) {
                          diff =
                            (new Date(initialDate) -
                              new Date(itm.taskId.createdAt)) /
                            (1000 * 60 * 60 * 24);
                          initialDate.setDate(initialDate.getDate() - diff);
                        }
                        const finalDate = initialDate
                          .toISOString()
                          .split('T')[0];
                        return (
                          <div
                            key={itm.taskId.title + +idx}
                            className="flex flex-row justify-evenly w-full py-0 outline-none -md:text-xs"
                          >
                            <div className="relative w-[120px] -md:w-8">
                              <div className="h-full w-6 flex items-center justify-center">
                                <span
                                  className={cn(
                                    'w-[2px] bg-secondary pointer-events-none h-full -md:w-[1px]',
                                    idx === 0 ? 'mt-[100%] h-8' : '',
                                    idx === item.step.length - 1
                                      ? 'mb-[100%] h-8'
                                      : '',
                                    itm.taskId.status !== 'Complete'
                                      ? 'bg-secondary'
                                      : ''
                                  )}
                                />
                              </div>
                              <div
                                className={cn(
                                  'w-8 h-8 absolute top-1/2 md:right-[92px] -md:right-2 -mt-4 rounded-full bg-green-500 shadow-xl text-center -md:h-6 -md:w-6 -md:[&_svg]:text-base',
                                  itm.taskId.status !== 'Complete'
                                    ? 'bg-primary'
                                    : ''
                                )}
                              >
                                {itm.taskId.status === 'Pending' && (
                                  <BsClockHistory className="mt-1 ml-1 text-secondary text-2xl" />
                                )}
                                {itm.taskId.status === 'Complete' && (
                                  <Check
                                    sx={{
                                      marginTop: '4px',
                                      fontSize: '24px',
                                      color: 'white',
                                    }}
                                  />
                                )}
                                {itm.taskId.status === 'In Progress' && (
                                  <TbProgress className="mt-1 ml-1 text-secondary text-2xl" />
                                )}
                                {itm.taskId.status === 'Overdue' && (
                                  <LuTimerReset className="mt-[3px] ml-1 text-secondary text-2xl" />
                                )}
                              </div>
                            </div>
                            <div className="w-[200px] flex items-center -md:w-16">
                              <p className="text-sm font-medium -md:text-xs">
                                {itm.taskId.title}
                                {itm.checkList?.toLowerCase() === 'yes' && (
                                  <>inspections</>
                                )}
                              </p>
                            </div>
                            <div className="w-[200px] flex self-center justify-start -md:w-16">
                              {`${itm.taskId.issueMember?.firstname} ${itm.taskId.issueMember?.lastname} `}
                            </div>
                            <div className="w-[200px] -md:w-20 my-1 flex items-start flex-col">
                              <div className="text-left text-nowrap">
                                <div className="flex flex-row mb-2">
                                  <p className="text-sm font-medium -md:text-xs">
                                    ETC :
                                  </p>
                                  <p className="text-sm -md:text-xs">
                                    {finalDate}
                                  </p>
                                </div>
                                <div className="flex flex-row">
                                  <p className="text-sm font-medium -md:text-xs">
                                    DOC :
                                  </p>
                                  <p className="text-sm -md:hidden">
                                    {itm?.taskId?.updatedOn !== '' &&
                                      itm?.taskId?.status === 'Complete' &&
                                      new Date(itm.taskId.updatedOn)
                                        .toISOString()
                                        .split('T')[0]}{' '}
                                    {itm.taskId.updatedOn !== '' &&
                                    itm?.taskId?.status === 'Complete' &&
                                    new Date(itm.taskId.updatedOn) >
                                      new Date(finalDate)
                                      ? '(Delayed)'
                                      : new Date(itm.taskId.updatedOn) <
                                          new Date(finalDate) &&
                                        itm?.taskId?.status === 'Complete'
                                      ? '(Early)'
                                      : itm.taskId.updatedOn !== '' &&
                                        itm?.taskId?.status === 'Complete'
                                      ? '(On Time)'
                                      : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-[70px]">
                              <button
                                className="bg-secondary rounded-3xl text-primary px-3 py-2 -md:text-xs -md:px-2 -md:py-1"
                                onClick={() => {
                                  router.push(`/admin/tasks/${itm.taskId._id}`);
                                }}
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
      </div>

      <Dialog open={workStatusOpen} onClose={workStatusCancel}>
        <DialogTitle>Update Project Work By Admin</DialogTitle>
        <DialogContent style={{ width: '600px' }}>
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
                          style={{ display: 'flex', margin: '10px 0px' }}
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
                            style={{ width: '525px' }}
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
              // disabled
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
                        style={{ fontSize: '14px' }}
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
                                {pt?.status?.toLowerCase() === 'mandatory' ? (
                                  <span className="text-danger">*</span>
                                ) : (
                                  ''
                                )}
                              </span>
                              <span
                                className="mx-2"
                                style={{ marginTop: '3px' }}
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
              ''
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
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '1px',
          }}
        >
          Team Members
        </DialogTitle>
        <DialogContent style={{ width: '600px' }}>
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
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* <div className="mb-2">
                <span className="font-ubuntu font-semibold">
                  Project Manager
                </span>
                {projectDetails?.project_manager?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div> */}
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">
                  Architect/Designer
                </span>
                {projectDetails?.architect?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
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
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
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
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        <IoCallSharp className="text-white" />
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* <div className="mb-2">
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
              </div> */}
              <div className="mb-2">
                <span className="font-ubuntu font-semibold">Operation</span>
                {projectDetails?.operation?.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between"
                      key={index}
                    >
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {' '}
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
                      <div className="mt-1 flex flex-row items-center gap-4">
                        <span>{item.name}</span>
                        <span
                          className="bg-secondary text-primary p-2 rounded-full cursor-pointer"
                          onClick={() => {
                            setIssue(item);
                            setOpenChangeMember(true);
                            getTeammembersByRole(item.role._id);
                            teamOpenCancel();
                          }}
                        >
                          <MdOutlineEdit />
                        </span>
                      </div>
                      <span className="p-2 bg-green-600 rounded-full cursor-pointer">
                        {' '}
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
      <Dialog
        open={openChangeMember}
        onClose={() => setOpenChangeMember(false)}
      >
        <DialogTitle
          className="text-center"
          sx={{
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '1px',
          }}
        >
          Change {issue?.role?.name}
        </DialogTitle>
        <DialogContent style={{ width: '600px' }}>
          <FormControl fullWidth>
            <InputLabel id="newmember-simple-select-label">
              {issue?.role.name}
            </InputLabel>
            <MUISelect
              labelId="newmember-simple-select-label"
              id="newmember-simple-select"
              label="newmember"
              value={newMember}
              name="newmember"
              variant="outlined"
              onChange={e => setNewMember(e.target.value)}
              sx={{ borderRadius: '16px', background: '#f3f4f6' }}
            >
              {teammembersByRole.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeMember(false)} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={changeIssueMember}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Project document dialog */}
      <Dialog open={documentOpen} onClose={documentOpenCancel}>
        <DialogTitle
          className="text-center"
          style={{
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '1px',
          }}
        >
          Documents
        </DialogTitle>
        <DialogContent style={{ width: '600px' }}>
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
                      {item?.status === 'Pending' ? (
                        <span className="bg-secondary text-primary-foreground rounded-lg px-2 py-1">
                          {item?.status} By
                          {item.clientID == userId ? 'You' : 'Client'}
                        </span>
                      ) : item?.status === 'Accepted' ? (
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
                        style={{ fontSize: '12px' }}
                      >{`${new Date(item?.updatedAt).getDate()} ${
                        monthNames[new Date(item.updatedAt).getMonth()]
                      }, ${new Date(item.updatedAt).getFullYear()}`}</span>
                      <a
                        ref={linkRef}
                        style={{ display: 'none' }}
                        target="_blank"
                      ></a>
                      <span
                        className="bg-green-600 p-2 rounded-full cursor-pointer"
                        onClick={() => {
                          const pdfUrl = item?.document[0];
                          linkRef.current.href = pdfUrl;
                          linkRef.current.download = 'document.pdf';
                          linkRef.current.click();
                        }}
                      >
                        <FaDownload className="text-white" />
                      </span>
                    </div>
                    <hr />
                    <span className="pdm-name">
                      <span className="font-ubuntu font-semibold">
                        Uploaded by :{' '}
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
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                sx={{ borderRadius: '16px', background: '#f3f4f6' }}
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
                sx={{ borderRadius: '16px', background: '#f3f4f6' }}
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
                onChange={e => {
                  setContent(e.target.value);
                  handleStepChange(e.target.value);
                }}
                sx={{ borderRadius: '16px', background: '#f3f4f6' }}
              >
                {pointList?.map((data, id) => {
                  return (
                    <MenuItem
                      key={id}
                      value={`${data.taskId.title}$${data.taskId.stepName}`}
                    >
                      {data.taskId.title}
                    </MenuItem>
                  );
                })}
              </MUISelect>
            </FormControl>
            <FormControl
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '16px',
                  background: '#f3f4f6',
                },
              }}
            >
              <TextField
                type="text"
                name="log"
                value={log}
                placeholder="Queries"
                onChange={e => setLog(e.target.value)}
                sx={{ borderRadius: '16px', background: '#f3f4f6' }}
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
                '& .MuiInputBase-root': {
                  borderRadius: '16px',
                  background: '#f3f4f6',
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
        <DialogContent style={{ width: '600px' }}>
          {workDetails?.map((item, index) => {
            return (
              <div key={index}>
                <InputLabel className="text-dark fw-bold">Status</InputLabel>
                <Typography className="mx-1" style={{ fontSize: '14px' }}>
                  {item.status}
                </Typography>
                <InputLabel className="text-dark fw-bold mt-3">
                  Work Image
                </InputLabel>
                {item?.image?.map((dt, idx) => {
                  return (
                    <ImageListItem
                      key={idx}
                      style={{ display: 'flex', margin: '10px 0px' }}
                    >
                      <img
                        src={dt}
                        alt="task"
                        loading="lazy"
                        style={{ width: '525px' }}
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
        <DialogContent style={{ width: '500px' }}>
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
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
        <DialogContent style={{ width: '600px' }}>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Point Name</InputLabel> */}
            <label className="text-primary">Point Name</label>
            <TextField
              type="text"
              name="pointName"
              value={pointName}
              onChange={e => setPointName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">CheckList</InputLabel> */}
            <label className="text-primary">CheckList</label>
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
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">CheckList</InputLabel> */}
            <label className="text-primary">Force Majeure</label>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={force}
              name="checkList"
              onChange={e => setForce(e.target.value)}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </MUISelect>
          </FormControl>
          {force === 'yes' && (
            <>
              <FormControl fullWidth>
                <label className="text-primary">Start Date</label>
                <TextField
                  type="date"
                  name="startforcedate"
                  value={startForceDate}
                  onChange={e => setStartForceDate(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
                <label className="text-primary">End Date</label>
                <TextField
                  type="date"
                  name="endforceDate"
                  value={endForceDate}
                  onChange={e => setEndForceDate(e.target.value)}
                />
              </FormControl>
            </>
          )}
          {checkList === 'yes' && (
            <FormControl fullWidth className="mt-1 mb-1">
              {/* <InputLabel id="demo-simple-select-label">
                CheckList Name
              </InputLabel> */}
              <label className="text-primary">CheckList Name</label>
              <TextField
                type="text"
                name="checkListName"
                value={checkListName}
                onChange={e => setCheckListName(e.target.value)}
              />
            </FormControl>
          )}
          {force !== 'yes' && (
            <FormControl fullWidth className="mt-1 mb-1">
              <label className="text-primary">Duration (In days)</label>
              <TextField
                type="number"
                name="duration"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
            </FormControl>
          )}

          <FormControl fullWidth className="mt-1 mb-1">
            <label className="text-primary">Issue Member</label>
            {projectDetails && (
              <MUISelect
                labelId="issueMember-simple-select-label"
                id="issueMember-simple-select"
                value={issueMember}
                name="issueMember"
                onChange={e => setIssueMember(e.target.value)}
              >
                <MenuItem
                  value={projectDetails?.project_admin[0]}
                >{`${projectDetails?.project_admin[0]?.name} (Project Admin)`}</MenuItem>
                {/* <MenuItem
                  value={projectDetails?.project_manager[0]}
                >{`${projectDetails?.project_manager[0]?.name} (Project Manager)`}</MenuItem> */}
                <MenuItem
                  value={projectDetails?.sr_engineer[0]}
                >{`${projectDetails?.sr_engineer[0]?.name} (Senior Engineer)`}</MenuItem>
                <MenuItem
                  value={projectDetails?.site_engineer[0]}
                >{`${projectDetails?.site_engineer[0]?.name} (Site Engineer)`}</MenuItem>
                <MenuItem
                  value={projectDetails?.accountant[0]}
                >{`${projectDetails?.accountant[0]?.name} (Accountant)`}</MenuItem>
                <MenuItem
                  value={projectDetails?.sales[0]}
                >{`${projectDetails?.sales[0]?.name} (Sales)`}</MenuItem>
              </MUISelect>
            )}
          </FormControl>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Content</InputLabel> */}
            <label className="text-primary">After Content</label>
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
                  <MenuItem key={id} value={`${data.taskId._id}$${data.point}`}>
                    {data.taskId.title}
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
        <DialogContent style={{ width: '600px' }}>
          <FormControl fullWidth className="mt-1 mb-1">
            {/* <InputLabel id="demo-simple-select-label">Content</InputLabel> */}
            <label className="text-primary">Content</label>
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
                  <MenuItem key={id} value={`${data.taskId._id}$${data.point}`}>
                    {data.taskId.title}
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

      <Modal
        open={extensionOpen}
        onClose={() => setExtensionOpen(prev => !prev)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="w-1/3 -md:w-11/12 bg-white p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-center font-ubuntu mb-4">
            Force Majeure Details
          </h2>
          {projectDetails?.forceMajeure.length > 0 ? (
            <div>
              <table className="bg-white rounded-3xl w-full p-5">
                <thead className="p-5 rounded-3xl">
                  <tr className="bg-secondary text-primary rounded-t-3xl p-5 pl-14">
                    <th className="w-14 text-left pl-5 text-lg  font-semibold -md:text-sm py-4 rounded-tl-3xl">
                      Reason
                    </th>
                    <th className="-md:w-24 text-center text-lg font-semibold -md:text-sm">
                      Start Date
                    </th>
                    <th className="w-24 text-center text-lg font-semibold -md:text-sm rounded-tr-3xl pr-5">
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center px-5">
                  {projectDetails?.forceMajeure?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        'px-5 text-center ',
                        idx % 2
                          ? 'bg-secondary-foreground'
                          : 'bg-primary-foreground'
                      )}
                    >
                      <td className={cn('pl-5', idx % 2 && 'rounded-bl-3xl')}>
                        <span
                          className={cn(
                            'flex flex-row items-center justify-center gap-2 -md:gap-1'
                          )}
                        >
                          <span className="py-3 -md:p-1 truncate -md:w-24">
                            {item.reason}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="flex flex-row items-center justify-center gap-2 -md:gap-1 ">
                          <span className="py-3 -md:p-1 truncate">
                            {new Date(item.startDate).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                              }
                            )}
                          </span>
                        </span>
                      </td>
                      <td className={cn('pr-5', idx % 2 && 'rounded-br-3xl')}>
                        <span className="flex flex-row items-center justify-center gap-2 -md:gap-1 ">
                          <span className="py-3 -md:p-1 truncate -md:w-24">
                            {new Date(item.endDate).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                              }
                            )}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No Force Majeure Raised!</p>
          )}

          <div className="flex flex-row gap-4 mt-4 justify-end">
            <button
              onClick={() => setExtensionOpen(prev => !prev)}
              className="border-2 cursor-pointer font-semibold text-primary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-secondary border-secondary -md:px-4 -md:py-2 -md:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default ClientProjectView;
