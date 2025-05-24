'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IoIosArrowBack } from 'react-icons/io';
import AsideContainer from '../../../../components/AsideContainer';
import Image from 'next/image';
import { RiProgress3Line } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../../store/useAuthStore';
import { MdChecklist } from 'react-icons/md';
import { HiOutlineLockOpen } from 'react-icons/hi2';
import { cn } from '../../../../lib/utils';
import { toast } from 'sonner';
import { FiDownload } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { FaImages } from 'react-icons/fa';
import { IoIosAttach } from 'react-icons/io';
import { TbCheckbox } from 'react-icons/tb';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import AudioRecorder from '../../../../components/AudioRecorder/AudioRecorder';
import { Label } from "../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { CiViewList } from "react-icons/ci";

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [openComment, setOpenComment] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState(null);
  const [comment, setComment] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(null);
  const userId = useAuthStore((state) => state.userId);
  const userType = useAuthStore((state) => state.userType);
  const [points, setPoints] = useState('');
  const [audioData, setAudioData] = useState(null);
  const [teammembers, setTeammembers] = useState([]);
  const [showChangeMember, setshowChangeMember] = useState(false);
  const [openDeleteChecklist, setOpenDeleteChecklist] = useState(false);
  const [openViewChecklist, setOpenViewChecklist] = useState(false);
  const [addChecklist, setAddChecklist] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [taskChecklist, setTaskChecklist] = useState({});
  const [checklist, setChecklist] = useState('');
  const [checklistData, setChecklistData] = useState([]);
  const [isWorking, setIsWorking] = useState('no');
  const [material, setMaterial] = useState('no');
  const [workers, setWorkers] = useState(0);
  const [newMember, setNewMember] = useState(null);
  const [openManualClose,setOpenManualClose] = useState(false);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const { data, error, isFetched, refetch } = useQuery({
    queryKey: [`gettaskbyid/${slug}`],
    queryFn: async () =>
      await fetch(
        `${process.env.REACT_APP_BASE_PATH}/api/task/gettaskbyid/${slug}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .catch((error) => {
          throw new Error('Failed to fetch data');
        }),
  });

  const toggleDelete = () => {
    setOpenDelete((prev) => !prev);
  };

  const addComment = () => {
    if (!comment) {
      toast('Please enter a comment before submitting.');
    } else {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('taskId', slug);
      formData.append('type', type);
      formData.append('comment', comment);
      // formData.append('file', file);
      formData.append('isWorking', isWorking);
      formData.append('material', material);
      formData.append('workers', workers);

      if (audioData) {
        formData.append('audio', audioData.blob, 'recording.wav');
      }

      for (let i = 0; i < points?.length; i++) {
        formData.append('image', points[i]);
      }

      setOpenComment((prev) => !prev);

      const api = axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/task/taskaddcomment`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .then(() => {
          toast('Comment Added!', {
            description: 'Comment Added Successfully.',
          });
          setPoints('');
          setAudioData(null);
          refetch();
        });
    }
  };

  const deleteTask = () => {
    setOpenDelete((prev) => !prev);
    const api = axios
      .delete(`${process.env.REACT_APP_BASE_PATH}/api/task/delete/${slug}`)
      .then(() => {
        toast('Task Deleted!', {
          description: 'Task Deleted Successfully.',
        });
        router.back();
      });
  };

  const toggleShowImage = () => {
    setShowImage((prev) => !prev);
  };

  const downloadImage = (url) => {
    saveAs(url, 'site_image.jpg');
  };

  const deleteCommentImage = (id) => {
    toggleShowImage();
    
    const api = axios
      .post(
        `${process.env.REACT_APP_BASE_PATH}/api/task/deletetaskcommentimage`,
        { commentId: id, imageUrl: showImageUrl }
      )
      .then((res) => {
        refetch();
        toast('Image deleted successfully.');
      });
  };

  const handleAudioRecorded = (data) => {
    setAudioData(data);
  };

  const approveComment = async (id) => {
    const data = axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/task/approvetaskcomment`, {
        commentId: id,
        userId,
      })
      .then((res) => {
        refetch();
        toast('Comment Approved Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = async (id) => {
    const data = axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/task/deletetaskcomment`, {
        commentId: id,
      })
      .then((res) => {
        refetch();
        toast('Comment Deleted Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reassignTask = async () => {
    const data = axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/task/reassignTask`, {
        taskId: slug,
        userId,
        newAssigneeId: newMember,
      })
      .then((res) => {
        refetch();
        toast('Task Reassigned Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTeammembers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`
    );
    setTeammembers(response.data.data);
  };

  useEffect(() => {
    const getChecklist = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_PATH}/api/project/checklist/all`
      );
      setChecklistData(response.data.data);
    };
    getChecklist();
  }, [addChecklist]);

  const addChecklistHandler = async () => {
    setAddChecklist(false);
    const data = await axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/task/addchecklist`, {
        taskId: slug,
        checklistId: checklist,
      })
      .then((res) => {
        refetch();
        toast('Checklist Added Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data?.data?.checkList) {
      setTaskChecklist(data.data.checkList);
    }
  }, [data, isFetched]);

  const handleUpdateChecklistPoint = async () => {
    setShowChecklist(false);
    const data = await axios
      .post(
        `${process.env.REACT_APP_BASE_PATH}/api/task/updatechecklistpoint`,
        {
          taskId: slug,
          updatedChecklist: taskChecklist,
        }
      )
      .then((res) => {
        refetch();
        toast('Checklist Updated Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteChecklistHandler = async () => {
    setOpenDeleteChecklist(false);
    const data = await axios
      .post(
        `${process.env.REACT_APP_BASE_PATH}/api/task/deletechecklist`,
        {
          taskId: slug,
        }
      )
      .then((res) => {
        refetch();
        toast('Checklist Deleted Successfully.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closelManuallyHandler = async () => {
    setOpenManualClose(false);
    const data = await axios
      .post(
        `${process.env.REACT_APP_BASE_PATH}/api/task/manuallyclosetask`,
        {
          taskId: slug,
          date:manualDate
        }
      )
      .then((res) => {
        refetch();
        toast('Task Manually Closed.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isAbled = data?.data?.checkList?.items?.every((item) =>
    item.points.every((point) => point.isChecked !== null)
  );

  // need to add imgages to each checklist item,disable complete button on if all checklist steps are completed or not and add zone/state in project creation page.

  return (
    <AsideContainer>
      {!isFetched ? (
        <LoaderSpinner />
      ) : (
        <>
          <div className='flex flex-row gap-2 items-center my-4'>
            <IoIosArrowBack
              className='text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out'
              onClick={() => router.back()}
            />
            <h1 className='text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg'>
              {userType === 'ROLE_CLIENT' ? 'Step Details' : 'Task Details'}
            </h1>
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-md'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row justify-between items-center'>
                <div>
                  <span className='flex flex-row gap-2 items-center'>
                    <p className='font-ubuntu font-semibold text-gray-600'>
                      Assigned To :
                    </p>
                    <Image
                      src={'/assets/profile-placeholder.png'}
                      alt='project image'
                      width={20}
                      height={20}
                      className='rounded-full'
                    />
                    <p>{data.data.issueMember?.name}</p>
                  </span>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <p className='font-ubuntu font-semibold text-gray-600'>
                    Assigned By :
                  </p>
                  <Image
                    src={'/assets/profile-placeholder.png'}
                    alt='project image'
                    width={20}
                    height={20}
                    className='rounded-full'
                  />
                  <>
                    {data.data.assignedBy?.name === 'ThikedaarDotCom' ? (
                      <span className='font-semibold text-sm'>Admin</span>
                    ) : (
                      <span>{data.data.assignedBy?.name}</span>
                    )}
                  </>
                </div>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Created At :
                </p>
                <p>
                  {`${new Date(data.data.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}`}
                </p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Status :
                </p>
                <p className='flex flex-row gap-1 items-center'>
                  {data.data.status === 'Complete' ? (
                    <FaCheck className='text-xl text-primary' />
                  ) : (
                    <RiProgress3Line className='text-primary text-lg' />
                  )}
                  {data.data.status}
                </p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Category :
                </p>
                <p className='flex flex-row gap-1 items-center'>
                  {data.data.category}
                </p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Priority :
                </p>
                <p className='flex flex-row gap-1 items-center'>
                  {data.data.priority}
                </p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Description :
                </p>
                <p className='flex flex-row gap-1 items-center'>
                  {data.data.description}
                </p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className='font-ubuntu font-semibold text-gray-600'>
                  Checklist :
                </p>
                <p className='flex flex-row gap-1 items-center'>
                  {data.data.checkList?.name || 'NA'}
                </p>
              </div>
            </div>
            <div className='flex flex-row gap-4 mt-4 text-nowrap flex-wrap'>
              {(data.data.issueMember._id === userId ||
                data.data.assignedBy?._id === userId) &&
                data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => {
                      setType('In Progress');
                      setOpenComment((prev) => !prev);
                    }}
                  >
                    <RiProgress3Line className='text-xl' />
                    In Progress
                  </button>
                )}
              {data.data.status === 'Complete' &&
                data.data.assignedBy?._id === userId && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => {
                      setType('Reopened');
                      setOpenComment((prev) => !prev);
                    }}
                  >
                    <HiOutlineLockOpen className='text-xl' />
                    Re-open
                  </button>
                )}
              {(data.data.issueMember._id === userId ||
                data.data.assignedBy?._id === userId) &&
                data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center 
                               disabled:bg-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed'
                    disabled={data?.data?.checkList ? !isAbled : false}
                    onClick={() => {
                      setType('Complete');
                      setOpenComment((prev) => !prev);
                    }}
                  >
                    <FaCheck className='text-xl' />
                    Complete
                  </button>
                )}
              {/* {data.data.assignedBy?._id === userId &&
            data.data.status !== "Complete" && (
              <button className="px-4 py-2 border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center">
                <MdEdit className="text-xl" />
                Edit
              </button>
            )} */}
              {data.data.assignedBy?._id === userId &&
                data.data.status !== 'Complete' &&
                data.data.category !== 'Project' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => toggleDelete()}
                  >
                    <MdDeleteOutline className='text-xl' />
                    Delete
                  </button>
                )}
              {(userType === 'ROLE_USER' || userType === 'ROLE_ADMIN') &&
                data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => {
                      getTeammembers();
                      setshowChangeMember(true);
                    }}
                  >
                    <MdEdit className='text-xl' />
                    Reassign
                  </button>
                )}
              {(data.data.issueMember._id === userId ||
                data.data.assignedBy?._id === userId) &&
                data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-2 items-center'
                    onClick={() => {
                      setType('Comment');
                      setOpenComment((prev) => !prev);
                    }}
                  >
                    <MdOutlineInsertComment className='text-xl' />
                    Comment
                  </button>
                )}
                              {data.data.assignedBy?._id === userId &&
                data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => {
                      setAddChecklist((prev) => !prev);
                    }}
                  >
                    <MdChecklist className='text-xl' />
                  {data?.data?.checkList ? 'Change' : 'Add'} Checklist
                  </button>
                )}
              {data.data.issueMember._id !== userId &&
                data.data.status !== 'Complete' &&
                data?.data?.checkList && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => {
                      setShowChecklist((prev) => !prev);
                    }}
                  >
                    <TbCheckbox className='text-xl' />
                    Update Checklist
                  </button>
                )}
              {data.data.issueMember._id !== userId &&
                data.data.status !== 'Complete' &&
                data?.data?.checkList && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => setOpenDeleteChecklist(true)}
                  >
                    <MdDeleteOutline className='text-xl' />
                    Delete Checklist
                  </button>
                )}
              {data?.data?.checkList && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => setOpenViewChecklist(true)}
                  >
                    <CiViewList className='text-xl' />
                    View Checklist
                  </button>
                )}
              {userType==="ROLE_ADMIN" && data.data.status !== 'Complete' && (
                  <button
                    className='px-[10px] py-[6px] border border-secondary text-primary bg-secondary rounded-3xl flex flex-row gap-1 items-center'
                    onClick={() => setOpenManualClose(true)}
                  >
                    <FaCheck className='text-xl' />
                    Close Manually
                  </button>
                )}
            </div>
          </div>
          {data.data.comments.length > 0 && (
            <div id='comments'>
              <div className='flex flex-row gap-2 my-4'>
                <MdChecklist className='text-3xl text-primary' />
                <h3 className='text-xl font-bold font-ubuntu'>
                  {userType === 'ROLE_CLIENT' ? 'Step Updates' : 'Task Updates'}
                </h3>
              </div>
              <div className='flex flex-col gap-4'>
                {data.data.comments.map((item) => (
                  <React.Fragment key={item._id}>
                    {(item.approved.isApproved ||
                      userType !== 'ROLE_CLEINT') && (
                      <div
                        key={item._id}
                        className='bg-white rounded-xl p-5 flex flex-row w-full min-h-40 gap-4'
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex flex-row justify-between items-center'>
                            <div className='flex flex-row gap-4 items-center'>
                              <Image
                                src={'/assets/profile-placeholder.png'}
                                alt='project image'
                                width={20}
                                height={20}
                                className='rounded-full'
                              />
                              <div className='text-sm flex flex-col'>
                                <span className='font-semibold'>
                                  {item.createdBy?.name}
                                </span>
                                <span>
                                  At{' '}
                                  {new Date(item.createdAt).toLocaleString(
                                    'en-US',
                                    {
                                      dateStyle: 'medium',
                                      timeStyle: 'short',
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                            <span
                              className={cn(
                                'font-ubuntu text-sm text-white p-1 rounded',
                                item.type === 'In Progress' && 'bg-yellow-500',
                                item.type === 'Complete' && 'bg-green-600',
                                item.type === 'Comment' && 'bg-gray-600',
                                item.type === 'Task Updated' && 'bg-blue-500',
                                item.type === 'Reopened' && 'bg-orange-500'
                              )}
                            >
                              {item.type}
                            </span>
                          </div>
                          <div>
                            <p>{item.comment}</p>
                            <div className='flex flex-row items-center gap-4 justify-between'>
                              {item.audio && (
                                <audio
                                  controls
                                  src={item.audio}
                                  className='w-2/4'
                                />
                              )}
                              <div className='relative flex flex-row gap-2 mt-2'>
                                {item?.images?.map((imgObj, imgidx) => (
                                  <div key={imgObj}>
                                    <div
                                      className='cursor-pointer [&_span]:hover:block'
                                      onClick={() => {
                                        setShowImageUrl(imgObj);
                                        toggleShowImage(imgObj);
                                      }}
                                    >
                                      {!showImage && (
                                        <span className='w-16 rounded-xl h-full bg-black bg-opacity-30 absolute hidden text-primary-foreground text-center'>
                                          <p className='mt-5 font-semibold'>
                                            View
                                          </p>
                                        </span>
                                      )}
                                      <Image
                                        src={imgObj}
                                        alt={imgObj}
                                        width={64}
                                        height={64}
                                        className='w-16 h-16 rounded-xl transition-all duration-300'
                                      />
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
                                      <div className='bg-white rounded-3xl h-5/6 flex flex-col '>
                                        <div className='h-full w-full flex items-center justify-center'>
                                          <Image
                                            src={showImageUrl}
                                            alt='alt'
                                            width={1000}
                                            height={1000}
                                            className='w-auto h-5/6 bg-center'
                                          />
                                        </div>
                                        <div className='flex flex-row gap-4 justify-evenly p-4 -md:flex-wrap'>
                                          {userType === 'ROLE_ADMIN' ||
                                          userType ===
                                            'ROLE_PROJECT MANAGER' ? (
                                            <>
                                              <button
                                                className='py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap'
                                                onClick={() => {
                                                  deleteCommentImage(item._id);
                                                }}
                                              >
                                                <MdDeleteOutline className='text-xl' />
                                                Delete Image
                                              </button>
                                            </>
                                          ) : (
                                            ''
                                          )}
                                          <button
                                            className='py-2 px-4 font-semibold bg-secondary text-primary rounded-full flex flex-row items-center justify-center gap-1 text-nowrap'
                                            onClick={() => {
                                              downloadImage(imgObj.image);
                                            }}
                                          >
                                            <FiDownload className='text-xl' />
                                            Download Image
                                          </button>
                                        </div>
                                      </div>
                                    </Modal>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {(userType === 'ROLE_ADMIN' ||
                          userType === 'ROLE_PROJECT MANAGER') &&
                          item.type !== 'Task Updated' &&
                          !item.approved.isApproved && (
                            <div className='flex flex-col items-center justify-between'>
                              <span
                                className='text-primary bg-secondary p-3 rounded-full text-lg cursor-pointer'
                                onClick={() => approveComment(item._id)}
                              >
                                <FaCheck />
                              </span>
                              <span
                                className='text-primary bg-secondary p-3 rounded-full text-xl cursor-pointer'
                                onClick={() => deleteComment(item._id)}
                              >
                                <MdDeleteOutline />
                              </span>
                            </div>
                          )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {data.data.comments.length < 0 && (
                <p className='text-center font-ubuntu font-semibold'>
                  No Update Posted Yet!
                </p>
              )}
            </div>
          )}
          <Modal
            open={openComment}
            onClose={() => setOpenComment((prev) => !prev)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white 2xl:w-1/3 p-8 rounded-3xl outline-none -md:w-3/4 -lg:w-2/4 -xl:4/6 -2xl:3/6'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Task Update
                </h3>
                <p>Please add a note before marking the task as Comment</p>
                <hr className='my-3' />
              </div>
              <div>
                {type === 'In Progress' && (
                  <>
                    <FormControl
                      fullWidth
                      className='mt-1 mb-1'
                    >
                      <label className='font-semibold mb-2'>Site Working</label>
                      <Select
                        labelId='Working-select-label'
                        id='Working-simple-select'
                        value={isWorking}
                        name='working'
                        onChange={(e) => setIsWorking(e.target.value)}
                        sx={{
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
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      className='mt-1 mb-1'
                    >
                      <label className='font-semibold mb-2'>
                        Material Available For Tomorrow
                      </label>
                      <Select
                        labelId='Material-select-label'
                        id='Material-simple-select'
                        value={material}
                        name='Material'
                        onChange={(e) => setMaterial(e.target.value)}
                        sx={{
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
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                      </Select>
                    </FormControl>
                    <div className='flex flex-col w-full'>
                      <label className='font-semibold mb-2'>
                        No. of Workers
                      </label>
                      <input
                        type='number'
                        id='workers'
                        value={workers}
                        name='workers'
                        onChange={(e) => setWorkers(e.target.value)}
                        className='border border-primary rounded-lg px-4 py-3 bg-gray-100 outline-none'
                        min={0}
                      />
                    </div>
                  </>
                )}
                <div className='w-full mb-2'>
                  <label className='font-semibold mb-2'>Remarks</label>
                  <textarea
                    type='text'
                    id='comment'
                    onChange={(e) => setComment(e.target.value)}
                    maxLength='250'
                    className='w-full resize-none outline-primary border border-gray-400 rounded-lg p-2'
                    rows={6}
                  />
                  <p className='text-xs text-red-500'>
                    Should be not more than 250 Charactors.
                  </p>
                </div>
              </div>
              <div className='flex flex-row gap-2 [&_label]:font-semibold mb-2'>
                <div className='relative inline-block'>
                  <input
                    id='file-upload'
                    type='file'
                    hidden
                    multiple
                    onChange={(e) => setPoints(e.target.files)}
                  />
                  <label
                    htmlFor='file-upload'
                    className='bg-secondary p-4 rounded-full inline-block w-[3.12rem] text-primary text-lg cursor-pointer'
                  >
                    <FaImages />
                  </label>
                </div>
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                <div className='relative inline-block'>
                  <input
                    id='file-upload'
                    type='file'
                    hidden
                    multiple
                    onChange={(e) => setPoints(e.target.files)}
                  />
                  <label
                    htmlFor='file-upload'
                    className='bg-secondary p-4 rounded-full inline-block w-[3.12rem] text-primary text-lg cursor-pointer'
                  >
                    <IoIosAttach />
                  </label>
                </div>
              </div>
              {audioData && (
                <audio
                  controls
                  src={audioData.url}
                  className='mb-2 w-full'
                />
              )}
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row items-center'
                  onClick={() => setOpenComment((prev) => !prev)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={addComment}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={showChangeMember}
            onClose={() => setshowChangeMember(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Reassign Task
                </h3>
                <hr className='my-4' />
              </div>
              <FormControl fullWidth>
                <InputLabel id='newmember-simple-select-label'>
                  Team Members
                </InputLabel>
                <Select
                  labelId='newmember-simple-select-label'
                  id='newmember-simple-select'
                  label='newmember'
                  value={newMember}
                  name='newmember'
                  variant='outlined'
                  onChange={(e) => setNewMember(e.target.value)}
                  sx={{ borderRadius: '16px', background: '#f3f4f6' }}
                >
                  {teammembers.map((item) => (
                    <MenuItem
                      key={item._id}
                      value={item._id}
                    >
                      {`${item.name} (${item.role.name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={() => setshowChangeMember(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={reassignTask}
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={openDelete}
            onClose={toggleDelete}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Delete Task
                </h3>
                <hr className='my-4' />
              </div>
              <h5>Are your sure you want to delete ?</h5>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={toggleDelete}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={deleteTask}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={addChecklist}
            onClose={() => setAddChecklist(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Add Checklist
                </h3>
                <hr className='my-4' />
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel id='newmember-simple-select-label'>
                    Checklist Name
                  </InputLabel>
                  <Select
                    labelId='newmember-simple-select-label'
                    id='newmember-simple-select'
                    label='newmember'
                    value={checklist}
                    name='newmember'
                    variant='outlined'
                    onChange={(e) => setChecklist(e.target.value)}
                    sx={{ borderRadius: '16px', background: '#f3f4f6' }}
                  >
                    {checklistData.map((item) => (
                      <MenuItem
                        key={item._id}
                        value={item._id}
                      >
                        {`${item.name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={() => setAddChecklist(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row items-center'
                  onClick={addChecklistHandler}
                >
                  {data?.data?.checkList
                    ? 'Add'
                    : 'Update'} Checklist
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={showChecklist}
            onClose={() => setShowChecklist(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Update Checklist
                </h3>
                <hr className='my-4' />
              </div>
              <div>
                <h5 className='font-semibold mb-2 text-lg'>
                  {taskChecklist.name}
                </h5>
                {taskChecklist?.items?.map((item) => (
                  <React.Fragment key={item.heading}>
                    <p className='font-semibold'>{item.heading}</p>
                    {item.points.map((point) => (
                      <div
                        key={point.name}
                        className='flex flex-row justify-between items-center'
                      >
                          <div className='flex flex-col gap-2 items-center'>
                              <p>{point.point}</p>
                              <RadioGroup className="flex items-center space-x-2" 
                                onValueChange={(value) => {
                                setTaskChecklist((prev) => {
                                  const updatedItems = prev.items.map((i) => {
                                    if (i.heading !== item.heading) return i;
                                    return {
                                      ...i,
                                      points: i.points.map((p) =>
                                        p.point === point.point
                                          ? { ...p, isChecked: value }
                                          : p
                                      ),
                                    };
                                  });
                                  return {
                                    ...prev,
                                    items: updatedItems,
                                  };
                                });
                                }}
                                defaultValue={point.isChecked}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={true} id="r1" />
                                  <Label htmlFor="r1">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={false} id="r2" />
                                  <Label htmlFor="r2">NA</Label>
                                </div>
                              </RadioGroup>
                            {/* <input
                              type='checkbox'
                              checked={point.isChecked ?? false}
                              onChange={() => {
                                setTaskChecklist((prev) => {
                                  const updatedItems = prev.items.map((i) => {
                                    if (i.heading !== item.heading) return i;
                                    return {
                                      ...i,
                                      points: i.points.map((p) =>
                                        p.point === point.point
                                          ? { ...p, isChecked: !p.isChecked }
                                          : p
                                      ),
                                    };
                                  });
                                  return {
                                    ...prev,
                                    items: updatedItems,
                                  };
                                });
                              }}
                            /> */}
                          </div>
                        <div className='relative inline-block'>
                          <input
                            id='file-upload'
                            type='file'
                            hidden
                            onChange={(e) => {
                              console.log(e.target.files[0]);
                              // setTaskChecklist((prev) => {
                              //   const updatedItems = prev.items.map((i) => {
                              //     if (i.heading !== item.heading) return i;
                              //     return {
                              //       ...i,
                              //       points: i.points.map((p) =>
                              //         p.point === point.point
                              //           ? { ...p, image: e.target.files[0] }
                              //           : p
                              //       ),
                              //     };
                              //   });
                              //   return {
                              //     ...prev,
                              //     items: updatedItems,
                              //   };
                              // });
                            }}
                          />
                          <label
                            htmlFor='file-upload'
                            className='bg-secondary p-4 rounded-full inline-block w-[3.12rem] text-primary text-lg cursor-pointer'
                          >
                            <FaImages />
                          </label>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={() => setShowChecklist(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row items-center'
                  onClick={handleUpdateChecklistPoint}
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={openDeleteChecklist}
            onClose={() => setOpenDeleteChecklist(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Delete Checklist
                </h3>
                <hr className='my-4' />
              </div>
              <h5>Are your sure you want to delete ?</h5>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={() => setOpenDeleteChecklist(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={deleteChecklistHandler}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            open={openViewChecklist}
            onClose={() => setOpenViewChecklist(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Checklist Details
                </h3>
                <hr className='my-4' />
              </div>
             <div>
                <h5 className='font-semibold mb-2 text-lg'>
                  {taskChecklist.name}
                </h5>
                {taskChecklist?.items?.map((item) => (
                  <React.Fragment key={item.heading}>
                    <p className='font-semibold'>{item.heading}</p>
                    {item.points.map((point) => (
                      <div
                        key={point.name}
                        className='flex flex-row justify-between items-center'
                      >
                          <div className='flex flex-row gap-2 items-center'>
                              <p>{point.point} : </p>
                              <p>{point.isChecked === null ? 'Not Updated' : !point.isChecked ? 'NA' : point.isChecked ? 'Yes' : '' }</p>
                          </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row items-center'
                  onClick={() => setOpenViewChecklist(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
            <Modal
            open={openManualClose}
            onClose={() => setOpenManualClose(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className='bg-white w-1/4 p-8 rounded-3xl outline-none -md:w-3/4'>
              <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Close Task
                </h3>
                <hr className='my-4' />
              </div>
              <div>
                <input
                  type="date"
                  defaultValue={manualDate}
                  className='outline-none border border-primary px-3 py-2 rounded-3xl bg-gray-100 '
                  onChange={(e) => setManualDate(e.target.value)}
                  id="manual-close-date"
                  label="Select Date"
                  required
                />
              </div>
              <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                  className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={() => setOpenManualClose(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
                  onClick={closelManuallyHandler}
                >
                  Close Task
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </AsideContainer>
  );
};
export default Page; 
