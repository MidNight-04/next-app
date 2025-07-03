'use client';
import React, { useState, useEffect } from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import api from '../../../../lib/api';
import Avatar from '@mui/material/Avatar';
import { toast } from 'sonner';
import AsideContainer from '../../../../components/AsideContainer';
import { cn } from '../../../../lib/utils';
import { useRouter } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
import { SearchOutlined } from '@mui/icons-material';
import { IoFilterOutline } from 'react-icons/io5';
import TaskFilterPopup from '../../../../components/filter/Filter';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import { SlCalender } from 'react-icons/sl';
import { IoIosPricetag } from 'react-icons/io';
import { IoIosFlag } from 'react-icons/io';
import { FiRepeat } from 'react-icons/fi';
import { FaRegCircle } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { FaCircle } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { MdFilterListOff } from 'react-icons/md';

// import ProgressBar from "../ProgressBar/ProgressBar";

const Page = () => {
  const router = useRouter();
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [activeTab, setActiveTab] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState(1);
  const [searchTerm, setSearchTerm] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customFilters, setCustomFilters] = useState({
    selectedCategory: '',
    assignedBy: '',
    assignedTo: '',
    frequency: '',
    priority: '',
  });

  // let url;

  // switch (activeFilter) {
  //   case 'Today':
  //     url = `task/gettodaytaskbyid`;
  //     break;
  //   case 'Yesterday':
  //     url = `task/getyesterdaytaskbyid`;
  //     break;
  //   case 'Tomorrow':
  //     url = `task/gettomorrowtaskbyid`;
  //     break;
  //   case 'This Week':
  //     url = `task/getthisweektaskbyid`;
  //     break;
  //   case 'Next Week':
  //     url = `task/getnextweektaskbyid`;
  //     break;
  //   case 'Next Month':
  //     url = `task/getnextmonthtaskbyid`;
  //     break;
  //   case 'This Month':
  //     url = `task/getthismonthtaskbyid`;
  //     break;
  //   case 'Last Month':
  //     url = `task/getlastmonthtaskbyid`;
  //     break;
  //   case 'Custom':
  //     url = `task/customfilters`;
  //     break;
  // }

  const user = userType !== 'ROLE_ADMIN' ? userId : null;
  const { data, isFetched, isError, isPreviousData, isFetching, refetch } =
    useQuery({
      queryKey: ['delegatedTasks', activeFilter, currentPage],
      queryFn: async () => {
        const response = await api.post(`/task/customfilters`, {
          page: currentPage,
          userId: user,
          filter: activeFilter,
          ...customFilters,
        });
        return response.data;
      },
      keepPreviousData: true,
      placeholderData: keepPreviousData,
      retry: 1,
      retryDelay: 5000,
      staleTime: 10000,
    });

  const filters = [
    'Yesterday',
    'Today',
    'Tomorrow',
    'This Week',
    'This Month',
    'Last Month',
    'Next Week',
    // 'All Time',
  ];

  const searchTask = e => {
    const searchValue = e.target.value.toLowerCase();
    const data = api.post(`/task/search/${searchValue}`);
    setTasks(data);
  };

  const handleFilterChange = filter => {
    setCustomFilters(filter);
  };

  useEffect(() => {
    refetch();
  }, [customFilters, refetch]);

  if (isFetching && !isError) {
    return <LoaderSpinner />;
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    const splitName = name.split(' ');
    const initials = splitName
      .map(n => n[0])
      .join('')
      .toUpperCase();
    const firstLetter = splitName[0][0].toUpperCase();
    const secondLetter = splitName[1] ? splitName[1][0].toUpperCase() : '';
    const initialsColor = stringToColor(initials);
    return {
      sx: {
        height: '24px',
        width: '24px',
        fontSize: '12px',
        fontWeight: '400',
        bgcolor: initialsColor,
      },
      children: `${firstLetter}${secondLetter}`,
    };
  }

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 w-full items-center my-4 justify-between">
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5 text-nowrap">
            Delegated Tasks
          </h1>
          <div className="relative w-72 ">
            <SearchOutlined
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-2xl border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              onChange={e => searchTask(e)}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center justify-center gap-2 -xl:flex-wrap">
            {filters.map(filter => (
              <span
                key={filter}
                className={cn(
                  'flex flex-row gap-2 py-[6px] text-nowrap px-3 bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                  activeFilter === filter
                    ? 'text-green-800 bg-green-200 border-green-800'
                    : ''
                )}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </span>
            ))}
            <div className="flex flex-row gap-3">
              <button
                className={cn(
                  'flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl cursor-pointer'
                )}
                onClick={() => {
                  setOpenFilter(true);
                }}
              >
                Filter
                <IoFilterOutline />
              </button>
              <button
                className={cn(
                  'flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl cursor-pointer',
                  Object.values(customFilters).every(value => value === '') &&
                    'hidden'
                )}
                disabled={Object.values(customFilters).every(
                  value => value === ''
                )}
                onClick={() => {
                  setCustomFilters({
                    selectedCategory: '',
                    assignedBy: '',
                    assignedTo: '',
                    frequency: '',
                    priority: '',
                  });
                }}
              >
                Clear
                <MdFilterListOff />
              </button>
            </div>
            {/* <div>
               {Object.keys(customFilters).map(
                 key =>
                   customFilters[key] !== '' && (
                     <span key={key}>
                       {key}:{customFilters[key]}
                     </span>
                   )
               )}
             </div> */}
          </div>
          <div>
            <Tabs
              defaultValue="Pending"
              onValueChange={value => setActiveTab(value)}
              className="flex flex-col w-full justify-center items-center my-4"
            >
              <TabsList className="grid grid-cols-4 -2xl:w-1/2 -lg:w-full">
                <TabsTrigger value="Overdue">
                  <FaExclamationCircle className="text-secondary mr-1" />
                  OverDue
                </TabsTrigger>
                <TabsTrigger value="Pending">
                  <FaCircle className="text-secondary mr-1" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="In Progress">
                  <AiOutlineLoading3Quarters className="text-secondary mr-1" />{' '}
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="Complete">
                  <FaCircleCheck className="text-secondary mr-1" />
                  Completed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Overdue" className="w-full">
                <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
                  {isFetched &&
                    data.length > 0 &&
                    data
                      .filter(item => item.status === activeTab)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/tasks/${item._id}`)
                          }
                        >
                          <div className="flex flex-row gap-4">
                            <span className="h-20 rounded-full w-1 bg-primary" />
                            <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
                              <div>
                                <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                  <Avatar
                                    sx={{}}
                                    {...stringAvatar(
                                      `${
                                        item.issueMember?.firstname +
                                        ' ' +
                                        item.issueMember?.lastname
                                      }`
                                    )}
                                  />
                                  {item.issueMember?.firstname}
                                </span>
                                <span className="text-lg font-bold">
                                  {item.title}
                                </span>
                              </div>
                              {item.issueMember?.firstname ===
                              'ThikedaarDotCom' ? (
                                <span className="font-semibold text-sm">
                                  Admin
                                </span>
                              ) : (
                                <div className="flex flex-row gap-4 items-center">
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <FaUserCircle className="text-primary" />
                                    <p className="font-semibold text-sm">
                                      {item.assignedBy?.firstname +
                                        ' ' +
                                        item.assignedBy?.lastname}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <SlCalender className="text-primary" />
                                    <p>
                                      {new Date(item.dueDate).toLocaleString(
                                        'en-US',
                                        {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        }
                                      )}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    {item.status === 'Complete' && (
                                      <FaCircleCheck className="text-primary" />
                                    )}
                                    {item.status === 'Pending' && (
                                      <FaCircle className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <AiOutlineLoading3Quarters className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <FaRegCircle className="text-primary" />
                                    )}
                                    {item.status === 'Overdue' && (
                                      <FaExclamationCircle className="text-primary" />
                                    )}
                                    <p>{item.status}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosPricetag className="text-primary" />
                                    <p>{item.category}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosFlag className="text-primary" />
                                    <p>{item.priority}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <FiRepeat className="text-primary" />
                                    <p>
                                      {item.repeat?.repeatType === 'norepeat'
                                        ? 'Once'
                                        : item.repeat?.repeatType}
                                    </p>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                {data?.filter(item => item.status === activeTab)?.length >=
                  10 && (
                  <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
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
                      disabled={isPreviousData || !data?.hasMore}
                    >
                      Next Page
                      <MdSkipNext />
                    </button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="Pending" className="w-full">
                <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
                  {isFetched &&
                    data.length > 0 &&
                    data
                      .filter(item => item.status === activeTab)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/tasks/${item._id}`)
                          }
                        >
                          <div className="flex flex-row gap-4">
                            <span className="h-20 rounded-full w-1 bg-primary" />
                            <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
                              <div>
                                <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                  <Avatar
                                    {...stringAvatar(
                                      `${
                                        item.issueMember?.firstname +
                                        ' ' +
                                        item.issueMember?.lastname
                                      }`
                                    )}
                                  />
                                  {item.issueMember?.firstname +
                                    ' ' +
                                    item.issueMember?.lastname}
                                </span>
                                <span className="text-lg font-bold">
                                  {item.title}
                                </span>
                              </div>
                              {item.issueMember?.firstname ===
                              'ThikedaarDotCom' ? (
                                <span className="font-semibold text-sm">
                                  Admin
                                </span>
                              ) : (
                                <div className="flex flex-row gap-4 items-center">
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <FaUserCircle className="text-primary" />
                                    <p className="font-semibold text-sm">
                                      {item.assignedBy?.firstname +
                                        ' ' +
                                        item.assignedBy?.lastname}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <SlCalender className="text-primary" />
                                    <p>
                                      {new Date(item.dueDate).toLocaleString(
                                        'en-US',
                                        {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        }
                                      )}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    {item.status === 'Complete' && (
                                      <FaCircleCheck className="text-primary" />
                                    )}
                                    {item.status === 'Pending' && (
                                      <FaCircle className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <AiOutlineLoading3Quarters className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <FaRegCircle className="text-primary" />
                                    )}
                                    {item.status === 'Overdue' && (
                                      <FaExclamationCircle className="text-primary" />
                                    )}
                                    <p>{item.status}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosPricetag className="text-primary" />
                                    <p>{item.category}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosFlag className="text-primary" />
                                    <p>{item.priority}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <FiRepeat className="text-primary" />
                                    {item.repeat?.repeatType === 'norepeat'
                                      ? 'Once'
                                      : item.repeat?.repeatType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                {data?.filter(item => item.status === activeTab)?.length >=
                  10 && (
                  <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
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
                      disabled={isPreviousData || !data?.hasMore}
                    >
                      Next Page
                      <MdSkipNext />
                    </button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="In Progress" className="w-full">
                <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
                  {isFetched &&
                    data.length > 0 &&
                    data
                      .filter(item => item.status === activeTab)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/tasks/${item._id}`)
                          }
                        >
                          <div className="flex flex-row gap-4">
                            <span className="h-20 rounded-full w-1 bg-primary" />
                            <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
                              <div>
                                <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                  <Avatar
                                    sx={{}}
                                    {...stringAvatar(
                                      `${
                                        item.issueMember?.firstname +
                                        ' ' +
                                        item.issueMember?.lastname
                                      }`
                                    )}
                                  />
                                  {item.issueMember?.firstname +
                                    ' ' +
                                    item.issueMember?.lastname}
                                </span>
                                <span className="text-lg font-bold">
                                  {item.title}
                                </span>
                              </div>
                              {item.issueMember?.name === 'ThikedaarDotCom' ? (
                                <span className="font-semibold text-sm">
                                  Admin
                                </span>
                              ) : (
                                <div className="flex flex-row gap-4 items-center">
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <FaUserCircle className="text-primary" />
                                    <p className="font-semibold text-sm">
                                      {item.assignedBy?.firstname +
                                        ' ' +
                                        item.assignedBy?.lastname}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <SlCalender className="text-primary" />
                                    <p>
                                      {new Date(item.dueDate).toLocaleString(
                                        'en-US',
                                        {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        }
                                      )}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    {item.status === 'Complete' && (
                                      <FaCircleCheck className="text-primary" />
                                    )}
                                    {item.status === 'Pending' && (
                                      <FaCircle className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <AiOutlineLoading3Quarters className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <FaRegCircle className="text-primary" />
                                    )}
                                    {item.status === 'Overdue' && (
                                      <FaExclamationCircle className="text-primary" />
                                    )}
                                    <p>{item.status}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosPricetag className="text-primary" />
                                    <p>{item.category}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosFlag className="text-primary" />
                                    <p>{item.priority}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <FiRepeat className="text-primary" />
                                    {item.repeat?.repeatType === 'norepeat'
                                      ? 'Once'
                                      : item.repeat?.repeatType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                {data?.filter(item => item.status === activeTab)?.length >=
                  10 && (
                  <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
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
                      disabled={isPreviousData || !data?.hasMore}
                    >
                      Next Page
                      <MdSkipNext />
                    </button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="Complete" className="w-full">
                <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
                  {isFetched &&
                    data.length > 0 &&
                    data
                      .filter(item => item.status === activeTab)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-white w-full rounded-2xl p-8 flex flex-row justify-between shadow-md cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/tasks/${item._id}`)
                          }
                        >
                          <div className="flex flex-row gap-4">
                            <span className="h-20 rounded-full w-1 bg-primary" />
                            <div className="flex flex-col [&_span]:leading-7 font-ubuntu text-base text-[#565656]">
                              <div>
                                <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                  <Avatar
                                    sx={{}}
                                    {...stringAvatar(
                                      `${
                                        item.issueMember?.firstname +
                                        ' ' +
                                        item.issueMember?.lastname
                                      }`
                                    )}
                                  />
                                  {item.issueMember?.firstname +
                                    ' ' +
                                    item.issueMember?.lastname}
                                </span>
                                <span className="text-lg font-bold">
                                  {item.title}
                                </span>
                              </div>
                              {item.issueMember?.name === 'ThikedaarDotCom' ? (
                                <span className="font-semibold text-sm">
                                  Admin
                                </span>
                              ) : (
                                <div className="flex flex-row gap-4 items-center">
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <FaUserCircle className="text-primary" />
                                    <p className="font-semibold text-sm">
                                      {item.assignedBy?.firstname +
                                        ' ' +
                                        item.assignedBy?.lastname}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-2 items-center">
                                    <SlCalender className="text-primary" />
                                    <p>
                                      {new Date(item.dueDate).toLocaleString(
                                        'en-US',
                                        {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        }
                                      )}
                                    </p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    {item.status === 'Complete' && (
                                      <FaCircleCheck className="text-primary" />
                                    )}
                                    {item.status === 'Pending' && (
                                      <FaCircle className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <AiOutlineLoading3Quarters className="text-primary" />
                                    )}
                                    {item.status === 'In Progress' && (
                                      <FaRegCircle className="text-primary" />
                                    )}
                                    {item.status === 'Overdue' && (
                                      <FaExclamationCircle className="text-primary" />
                                    )}
                                    <p>{item.status}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosPricetag className="text-primary" />
                                    <p>{item.category}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <IoIosFlag className="text-primary" />
                                    <p>{item.priority}</p>
                                  </span>
                                  <span className="font-semibold text-sm flex flex-row gap-1 items-center">
                                    <FiRepeat className="text-primary" />
                                    {item.repeat?.repeatType === 'norepeat'
                                      ? 'Once'
                                      : item.repeat?.repeatType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                {data?.filter(item => item.status === activeTab)?.length >=
                  10 && (
                  <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
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
                      disabled={isPreviousData || !data?.hasMore}
                    >
                      Next Page
                      <MdSkipNext />
                    </button>
                  </div>
                )}{' '}
              </TabsContent>
              {!isFetched ||
                (data?.filter(item => item.status === activeTab)?.length <
                  1 && (
                  <p
                    className="text-center text-secondary"
                    style={{ marginTop: '200px', fontSize: '18px' }}
                  >
                    No Task Assign ...
                  </p>
                ))}
            </Tabs>
          </div>
        </div>
      </div>
      <TaskFilterPopup
        isOpen={openFilter}
        assgndBy={customFilters.assignedBy}
        assgndTo={customFilters.assignedTo}
        category={customFilters.selectedCategory}
        frqcy={customFilters.frequency}
        prty={customFilters.priority}
        filterhandler={handleFilterChange}
        onClose={() => setOpenFilter(false)}
        showTo={true}
        showBy={userType === 'ROLE_ADMIN'}
      />
    </AsideContainer>
  );
};

export default Page;
