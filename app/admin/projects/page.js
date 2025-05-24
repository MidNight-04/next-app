'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const Page = () => {
  const [project, setProject] = useState([]);
  const id = useAuthStore(state => state.userId);
  const userType = useAuthStore(state => state.userType);
  // const id = "668e250e039e5714c86ccd57";
  // const id = "65362fba3ffa1cad30f53bac";
  const [search, setSearch] = useState('');
  const [siteId, setSiteId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getAllProjects();
  }, [id, userType]);

  const getAllProjects = () => {
    if (userType === 'ROLE_CLIENT') {
      axios
        .get(`${process.env.REACT_APP_BASE_PATH}/api/project/client/${id}`)
        .then(response => {
          setProject(response?.data?.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else if (userType === 'ROLE_ADMIN') {
      axios
        .get(`${process.env.REACT_APP_BASE_PATH}/api/project/getall`)
        .then(response => {
          setProject(response?.data?.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_PATH}/api/project/member/${id}`)
        .then(response => {
          setProject(response?.data?.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const arrayData = [];
  project?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      siteID: row?.siteID,
      seriel: index + 1,
      name: row?.project_name,
      location: row?.project_location,
      date: row?.date,
      duration: row?.duration,
      floor: row?.floor,
    });
  });

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: params => {
        return (
          <div className="cellAction">
            <Link
              href={`/admin/projects/${params?.row?.siteID}`}
              className="adminNavLink"
            >
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];

  const searchFunction = e => {
    const { value } = e.target;
    setSearch(value);
    if (!value) {
      getAllProjects();
    } else {
      axios
        .get(
          `${process.env.REACT_APP_BASE_PATH}/api/project/filterlist?searchData=${value}`
        )
        .then(response => {
          const filters = response?.data?.data?.filter(
            data => data?.client?.id === id
          );
          setProject(filters);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const deleteProject = async () => {
    setOpenDelete(false);
    const response = await axios.delete(
      `${process.env.REACT_APP_BASE_PATH}/api/project/delete/${siteId}`
    );
    if (response.status === 200) {
      getAllProjects();
    }
    console.log('Delete project with siteId:', siteId);
  }

let rupee = new Intl.NumberFormat('en-IN', {
  // style: 'currency',
  // currency: 'INR',
  maximumFractionDigits: 0,
  useGrouping: true
});

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between pt-[20px] mb-[20px] items-center -lg:pt-2 -lg:mb-2">
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 -lg:leading-relaxed -lg:text-lg">
          Project List
        </h1>
        <div className="flex flex-row gap-2">
          <div className="flex p-1 pl-4 w-[305px] h-[46px] rounded-full border-[1px] border-[#EFEFEF] bg-white overflow-hidden max-w-md mx-auto text-[#565656] -md:w-56">
            <input
              type="email"
              placeholder="Search"
              className="w-full outline-none bg-transparent text-sm placeholder:text-[#565656] placeholder:text-base"
            />
            <div className="p-[10px] rounded-full border-2 border-[#EFEFEF] flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 192.904 192.904"
                width="12px"
                className=" font-bold"
              >
                <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
              </svg>
            </div>
          </div>
          {userType === 'ROLE_ADMIN' && (
            <Link href="/admin/projects/add">
              <button className="p-[6px] px-3 bg-transparent border-2 border-secondary rounded-full font-ubuntu hover:bg-secondary [&_p]:hover:text-primary-foreground [&_svg]:hover:text-primary-foreground">
                <div className="text-secondary flex flex-row items-center">
                  <AddIcon />
                  <p className="text-[13px] font-bold">Add Project</p>
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
      <div>
        <div>
          {project?.map((item, index) => {
            let totalPoint = 0;
            let completePoint = 0;
            for (let i = 0; i < item?.project_status?.length; i++) {
              for (let j = 0; j < item.project_status[i]?.step?.length; j++) {
                totalPoint += 1;
                if (
                  item.project_status[i]?.step[j]?.taskId?.status ===
                  'Complete'
                ) {
                  completePoint += 1;
                }
              }
            }
            const percent = ((completePoint * 100) / totalPoint).toFixed(0);
            return (
              <div key={index} className="bg-white rounded-3xl shadow-md">
                <div>
                  <div className="p-8 mb-4 -md:p-4">
                    <div className="flex">
                      <div className="w-full cursor-pointer" onClick={() => {
                        router.push(`/admin/projects/${item?.siteID}`);
                      }}>
                        <div className="flex flex-row gap-4 ">
                          <span className="h-[88px] rounded-full w-1 bg-primary -md:h-16" />
                          <div className="[&_span]:flex [&_span]:flex-row [&_span]:gap-3 [&_span]:leading-7 font-ubuntu font-bold text-base -md:[&_span]:gap-1 -md:[&_span]:leading-snug -md:text-sm text-nowrap text-[#565656]">
                            <span>
                              <p>Project Id :</p>
                              {item.siteID}
                            </span>
                            <span>
                              <p>Project Name :</p> {item.project_name}
                            </span>
                            <span>
                              <p>Project Location :</p>
                              {item.project_location}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8 text-nowrap -lg:mt-2 -lg:gap-2">
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                            <PiMapPinSimpleAreaLight />
                            <p>Area : {item.area} sqft</p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                            <BsBuilding className="icon" />
                            <p>Floors : {item.floor}</p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                            <GiDuration className="icon" />
                            <p>Duration : {item.duration} Months</p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                            <RiMoneyRupeeCircleLine className="icon" />
                            <p>{rupee.format(item.cost)}</p>
                          </span>
                          {userType !== 'ROLE_CLIENT' && (
                            <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                              <IoPeopleOutline />
                              <p>
                                {
                                  item.project_status
                                    .map(item => item.step)
                                    .flat()
                                    .find(
                                      item =>
                                        item.taskId.status === 'Pending' ||
                                        item.taskId.status === 'In Progress'
                                    ).taskId.issueMember.name
                                }
                              </p>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row gap-8 items-center -md:gap-2">
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
                          <Link href={`/admin/projects/${item?.siteID}`} className="flex justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:p-1 -md:text-xs">
                            <FiArrowUpRight />
                          </Link>
                          {userType === 'ROLE_ADMIN' && (
                            <span className="flex justify-center items-center p-2 bg-red-100 rounded-full border-[1px] border-red-500 [&_svg]:text-red-500 [&_svg]:text-2xl -md:p-1 -md:text-xs cursor-pointer"
                            onClick={() => {setOpenDelete(true); setSiteId(item?.siteID)}}
                            >
                              <MdDeleteOutline />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {project?.length === 0 && (
          <p className="text-center mt-5">No Record Available</p>
        )}
      </div>
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
           <div className='bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4'>
            <div>
                <h3 className=' text-2xl font-semibold font-ubuntu'>
                  Delete Project
                </h3>
                <hr className='my-4' />
            </div>
              <p>Are you sure you want to delete this project?</p>
               <div className='flex flex-row gap-2 justify-end mt-4'>
                <button
                className='bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center'
                onClick={() => setOpenDelete(false)}
                >
                  Cancel
                </button>
                <button
                className='bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center'
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
