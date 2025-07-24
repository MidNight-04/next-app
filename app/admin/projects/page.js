'use client';

import React, { useState } from 'react';
import api from '../../../lib/api';
import { BsBuilding } from 'react-icons/bs';
import { GiDuration } from 'react-icons/gi';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import { PiMapPinSimpleAreaLight } from 'react-icons/pi';
import { MdDeleteOutline } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AddIcon from '@mui/icons-material/Add';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';
import { IoPeopleOutline } from 'react-icons/io5';
import AsideContainer from '../../../components/AsideContainer';
import { Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { allowRoles } from '../../../helpers/constants';

const fetchProjects = async ({ userType, id, search }) => {
  const url =
    userType === 'ROLE_CLIENT'
      ? `/project/client/${id}`
      : userType === 'ROLE_ADMIN'
      ? '/project/getall'
      : `/project/member/${id}`;

  const res = await api.get(`${url}`);
  return res?.data?.data || [];
};

const Page = () => {
  const id = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);
  const [search, setSearch] = useState('');
  const [siteId, setSiteId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: project = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['projects', userType, id],
    queryFn: () => fetchProjects({ userType, id, search }),
    enabled: !!id,
  });

  const deleteProject = async () => {
    setOpenDelete(false);
    await api.delete(`/project/delete/${siteId}`);
    queryClient.invalidateQueries(['projects']);
  };

  let rupee = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center -lg:pt-2 -lg:mb-2">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
            Project List
          </h1>
        </div>
        <div className="flex flex-row gap-2">
          {allowRoles.includes(userType) && (
            <Link href="/admin/projects/add">
              <button className="p-[6px] px-3 bg-transparent border-2 border-secondary rounded-full font-ubuntu hover:bg-secondary [&_p]:hover:text-primary-foreground [&_svg]:hover:text-primary-foreground">
                <div className="text-secondary flex flex-row items-center">
                  <AddIcon />
                  <p className="text-[13px] font-bold text-nowrap">
                    Add Project
                  </p>
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>

      <div>
        {project?.map((item, index) => {
          let totalPoint = 0;
          let completePoint = 0;
          for (let i = 0; i < item?.project_status?.length; i++) {
            for (let j = 0; j < item.project_status[i]?.step?.length; j++) {
              totalPoint += 1;
              if (
                item.project_status[i]?.step[j]?.taskId?.status === 'Complete'
              ) {
                completePoint += 1;
              }
            }
          }
          const percent = ((completePoint * 100) / totalPoint).toFixed(0);

          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md cursor-pointer hover:scale-[1.02] transition-all duration-300"
              onClick={() => router.push(`/admin/projects/${item?.siteID}`)}
            >
              <div className="p-8 mb-4 -md:p-4">
                <div className="flex justify-between">
                  <div className="w-full">
                    <div className="flex flex-row gap-4">
                      <span className="h-[88px] rounded-full w-1 bg-primary -md:h-16" />
                      <div className="[&_span]:flex [&_span]:flex-row [&_span]:gap-3 [&_span]:leading-7 font-ubuntu font-bold text-base -md:[&_span]:gap-1 -md:[&_span]:leading-snug -md:text-sm text-nowrap text-[#565656] -md:max-w-64">
                        <span>
                          <p>Project Id :</p>
                          {item.siteID}
                        </span>
                        <span>
                          <p>Project Name :</p> {item.project_name}
                        </span>
                        <span>
                          <p>Project Location :</p>
                          <p className="truncate">{item.project_location}</p>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-8 text-nowrap -lg:mt-2 -lg:gap-2">
                      <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary -md:p-1 -md:text-xs">
                        <PiMapPinSimpleAreaLight />
                        <p>Area : {item.area} sqft</p>
                      </span>
                      <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary -md:p-1 -md:text-xs">
                        <BsBuilding />
                        <p>Floors : {item.floor}</p>
                      </span>
                      <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary -md:p-1 -md:text-xs">
                        <GiDuration />
                        <p>Duration : {item.duration} Months</p>
                      </span>
                      <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary -md:p-1 -md:text-xs">
                        <RiMoneyRupeeCircleLine />
                        <p>{rupee.format(item.cost)}</p>
                      </span>
                      <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary -md:p-1 -md:text-xs">
                        <IoPeopleOutline />
                        <p>
                          {(() => {
                            const task = item.project_status
                              .flatMap(status => status.step)
                              .find(
                                step =>
                                  step.taskId.status === 'Pending' ||
                                  step.taskId.status === 'In Progress'
                              );
                            return task
                              ? `${task.taskId.issueMember.firstname} ${task.taskId.issueMember.lastname}`
                              : '';
                          })()}
                        </p>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between h-40 items-center gap-4 -md:gap-2 ">
                    {/* Circular progress */}
                    <div className="h-28 w-28 border-primary border-[3px] rounded-full flex p-[2px] justify-center items-center -md:h-16 -md:w-16">
                      <CircularProgressbar
                        value={percent}
                        text={`${percent}%`}
                        strokeWidth={14}
                        className="font-bold font-ubuntu"
                        styles={buildStyles({
                          backgroundColor: '#3e98c7',
                          textColor: 'black',
                          pathColor: '#93BFCF',
                          trailColor: '#d6d6d6',
                        })}
                      />
                    </div>

                    <div className="flex flex-col justify-between h-full">
                      <div className="flex justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                        <FiArrowUpRight />
                      </div>
                      {userType === 'ROLE_ADMIN' && (
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            setOpenDelete(true);
                            setSiteId(item?.siteID);
                          }}
                          className="flex justify-center items-center p-2 bg-red-100 rounded-full border-[1px] border-red-500 [&_svg]:text-red-500 [&_svg]:text-2xl -md:p-1 -md:text-xs cursor-pointer"
                        >
                          <MdDeleteOutline />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {project?.length === 0 && !isLoading && (
          <p className="text-center mt-5">No Record Available</p>
        )}
      </div>

      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
          <div>
            <h3 className=" text-2xl font-semibold font-ubuntu">
              Delete Project
            </h3>
            <hr className="my-4" />
          </div>
          <p>Are you sure you want to delete this project?</p>
          <div className="flex flex-row gap-2 justify-end mt-4">
            <button
              className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
              onClick={deleteProject}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AsideContainer>
  );
};

export default Page;
