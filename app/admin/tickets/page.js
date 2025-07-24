'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import NoImage from '../../../public/assets/no-image-available.png';
import { RiShareForwardFill } from 'react-icons/ri';
import { useAuthStore } from '../../../store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AsideContainer from '../../../components/AsideContainer';
import { cn } from '../../../lib/utils';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';

const Page = () => {
  const { userId, userType } = useAuthStore.getState();
  const hasHydrated = useAuthStore.persist?.hasHydrated();
  const [activeFilter, setActiveFilter] = useState('All Ticket');
  const [ticketList, setTicketList] = useState([]);
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({
    project: false,
    employee: false,
    client: false,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (userType === 'ROLE_USER' || userType === 'ROLE_ADMIN') {
          const response = await api.get(`/tickets/getalltickets`);
          setTicketList(response.data.data);
        } else if (userType === 'ROLE_CLIENT') {
          const response = await api.get(`/tickets/gettickets/${userId}`);

          setTicketList(response.data.data);
        } else {
          const response = await api.get(`/tickets/getmembertickets/${userId}`);
          setTicketList(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTickets();
  }, [userId, userType]);

  const handleButtonClick = (filter, filterData = null) => {
    setActiveFilter(filter);
    let filteredData;

    switch (filter) {
      case 'All Ticket':
        filteredData = ticketList;
        break;
      case 'Project Ticket':
        filteredData = ticketList.filter(
          ticket => ticket.siteID === filterData
        );
        break;
      case 'Employee Ticket':
        filteredData = ticketList.filter(ticket =>
          ticket.assignMember?.some(obj => obj.employeeID === filterData)
        );
        break;
      case 'Client Ticket':
        filteredData = ticketList.filter(
          ticket => ticket.client?.id === filterData
        );
        break;
      case 'Overdue Ticket':
        filteredData = ticketList.filter(ticket => {
          const dateStr = ticket.date;
          const finalDateStr = ticket.finalDate;
          const initialDate = new Date(dateStr);
          const newDate = new Date(initialDate);
          newDate.setHours(initialDate.getHours() + 72);
          const finalDate = new Date(finalDateStr);
          return finalDate > newDate;
        });
        break;
      case 'Pending Ticket':
        filteredData = ticketList?.filter(
          ticket => ticket.finalStatus === 'Pending'
        );
        break;
      default:
        filteredData = ticketList;
    }
    setFilteredTickets(filteredData);
    // Close dropdowns after filtering
    setDropdownOpen({ project: false, employee: false, client: false });
  };

  const toggleDropdown = type => {
    setDropdownOpen(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleItemClick = (filter, employeeID) => {
    handleButtonClick(filter, employeeID);
    // Close the dropdown after item click
    setDropdownOpen({ project: false, employee: false, client: false });
  };

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
            Ticket List
          </h1>
        </div>
        <div>
          {userType === 'ROLE_USER' && (
            <div className="flex flex-row items-center gap-4">
              <div>
                <button
                  onClick={() => handleButtonClick('All Ticket')}
                  className={cn(
                    'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer ',
                    activeFilter === 'All Ticket'
                      ? 'text-green-800 bg-green-200 border-green-800'
                      : ''
                  )}
                >
                  All Tickets
                </button>
              </div>
              <div>
                <button
                  className={cn(
                    'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                    activeFilter === 'Overdue Ticket'
                      ? 'text-green-800 bg-green-200 border-green-800'
                      : ''
                  )}
                  onClick={() => handleButtonClick('Overdue Ticket')}
                >
                  Overdue Tickets
                </button>
              </div>
              <div>
                <button
                  className={cn(
                    'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                    activeFilter === 'Pending Ticket'
                      ? 'text-green-800 bg-green-200 border-green-800'
                      : ''
                  )}
                  onClick={() => handleButtonClick('Pending Ticket')}
                >
                  Pending Tickets
                </button>
              </div>
              {userType === 'ROLE_ADMIN' && (
                <>
                  <div>
                    <button
                      className={cn(
                        'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                        activeFilter === 'project'
                          ? 'text-green-800 bg-green-200 border-green-800'
                          : ''
                      )}
                      onClick={() => toggleDropdown('project')}
                    >
                      Project Tickets
                    </button>
                    {dropdownOpen.project && (
                      <ul className="dropdown-menu show">
                        {projectList?.map(item => (
                          <li
                            key={item.siteID}
                            onClick={() =>
                              handleItemClick('Project Tickets', item.siteID)
                            }
                            className="dropdown-item"
                          >
                            <span>{`${item.siteID}`}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="dropdown">
                    <button
                      className={cn(
                        'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                        activeFilter === 'employee'
                          ? 'text-green-800 bg-green-200 border-green-800'
                          : ''
                      )}
                      onClick={() => toggleDropdown('employee')}
                    >
                      Employee Tickets
                    </button>
                    {dropdownOpen.employee && (
                      <ul className="dropdown-menu show">
                        {memberList?.map(item => (
                          <li
                            key={item.employeeID}
                            onClick={() =>
                              handleItemClick(
                                'Employee Tickets',
                                item.employeeID
                              )
                            }
                            className="dropdown-item"
                          >
                            <span>{`${item.name} (${item.role})`}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="dropdown">
                    <button
                      className={cn(
                        'flex flex-row gap-2 py-2 px-4 text-nowrap bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                        activeFilter === 'employee'
                          ? 'text-green-800 bg-green-200 border-green-800'
                          : ''
                      )}
                      onClick={() => toggleDropdown('client')}
                    >
                      Client Tickets
                    </button>
                    {dropdownOpen.client && (
                      <ul className="dropdown-menu show">
                        {clientList?.map(item => (
                          <li
                            key={item._id}
                            onClick={() =>
                              handleItemClick('Client Tickets', item._id)
                            }
                            className="dropdown-item"
                          >
                            <span>{`${item.name}`}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <div>
          {ticketList.map((dt, idx) => (
            <div key={idx} className="mb-4">
              <Link
                href={`/admin/tickets/${dt._id}`}
                className="text-decoration-none w-100"
              >
                <div className="bg-white rounded-3xl p-8 w-full -md:p-4">
                  <div className="w-full">
                    <div className="flex flex-row w-full">
                      <div className="flex flex-col w-full justify-between">
                        <div className="flex flex-row gap-4">
                          <span className="h-[5.25rem] rounded-full w-1 bg-primary" />
                          <div className="flex flex-col [&_span]:leading-7 font-ubuntu font-bold text-base text-[#565656]">
                            <span className="font-bold text-lg -md:text-base">
                              Site ID - {ticketList[0].siteID}
                            </span>
                            <span className="font-bold text-lg -md:text-base">
                              Query - {dt.query}
                            </span>
                            <span className="font-bold text-lg -md:text-base">
                              Status - {dt.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4 flex-wrap mt-8 -md:mt-2 -md:gap-2">
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:[&_p]:text-sm -md:[&_svg]:text-sm">
                            <RiShareForwardFill />
                            <p>Work : {dt.work}</p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:[&_p]:text-sm -md:[&_svg]:text-sm">
                            <RiShareForwardFill className="icon" />
                            <p>Status : {dt.status}</p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:[&_p]:text-sm -md:[&_svg]:text-sm">
                            <RiShareForwardFill className="icon" />
                            <p>Query : {dt.query} </p>
                          </span>
                          <span className="flex gap-2 justify-center items-center p-2 bg-primary-foreground rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl -md:[&_p]:text-sm -md:[&_svg]:text-sm  ">
                            <RiShareForwardFill className="icon" />
                            <p>Assign Member : {dt.assignMember?.name}</p>
                          </span>
                        </div>
                      </div>
                      <div>
                        <Image
                          width={300}
                          height={300}
                          className="object-cover rounded-md h-56 -md:h-40 w-auto"
                          src={dt.image[0] || NoImage}
                          alt="..."
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {ticketList.length < 0 && (
            <p className="mt-5 text-warning text-center">
              No ticket available...
            </p>
          )}
        </div>
      </div>
    </AsideContainer>
  );
};

export default Page;

// {userType !== "ROLE_USER" && (
//   <div className="flex flex-row  gap-4">
//     <div>
//       <button
//         onClick={() => handleButtonClick("All Ticket")}
//         className={cn(
//           "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//           activeFilter === "All Ticket"
//             ? "text-green-800 bg-green-200 border-green-800"
//             : ""
//         )}
//       >
//         All Tickets
//       </button>
//     </div>
//     <div>
//       <button
//         className={cn(
//           "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//           activeFilter === "Overdue Ticket"
//             ? "text-green-800 bg-green-200 border-green-800"
//             : ""
//         )}
//         onClick={() => handleButtonClick("Overdue Ticket")}
//       >
//         Overdue Tickets
//       </button>
//     </div>
//     <div>
//       <button
//         className={cn(
//           "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//           activeFilter === "Pending Ticket"
//             ? "text-green-800 bg-green-200 border-green-800"
//             : ""
//         )}
//         onClick={() => handleButtonClick("Pending Ticket")}
//       >
//         Pending Tickets
//       </button>
//     </div>
//     {userType === "ROLE_ADMIN" && (
//       <>
//         {" "}
//         <div className="dropdown">
//           <button
//             className={cn(
//               "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//               activeFilter === "project"
//                 ? "text-green-800 bg-green-200 border-green-800"
//                 : ""
//             )}
//             onClick={() => toggleDropdown("project")}
//           >
//             Project Tickets
//           </button>
//           {dropdownOpen.project && (
//             <ul className="dropdown-menu show">
//               {projectList?.map(item => (
//                 <li
//                   key={item.siteID}
//                   onClick={() =>
//                     handleItemClick("Project Tickets", item.siteID)
//                   }
//                   className="dropdown-item"
//                 >
//                   <span>{`${item.siteID}`}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="dropdown">
//           <button
//             className={cn(
//               "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//               activeFilter === "employee"
//                 ? "text-green-800 bg-green-200 border-green-800"
//                 : ""
//             )}
//             onClick={() => toggleDropdown("employee")}
//           >
//             Employee Tickets
//           </button>
//           {dropdownOpen.employee && (
//             <ul className="dropdown-menu show">
//               {memberList?.map(item => (
//                 <li
//                   key={item.employeeID}
//                   onClick={() =>
//                     handleItemClick("Employee Tickets", item.employeeID)
//                   }
//                   className="dropdown-item"
//                 >
//                   <span>{`${item.name} (${item.role})`}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="dropdown">
//           <button
//             className={cn(
//               "flex flex-row gap-2 py-2 px-4  bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer",
//               activeFilter === "employee"
//                 ? "text-green-800 bg-green-200 border-green-800"
//                 : ""
//             )}
//             onClick={() => toggleDropdown("client")}
//           >
//             Client Tickets
//           </button>
//           {dropdownOpen.client && (
//             <ul className="dropdown-menu show">
//               {clientList?.map(item => (
//                 <li
//                   key={item._id}
//                   onClick={() =>
//                     handleItemClick("Client Tickets", item._id)
//                   }
//                   className="dropdown-item"
//                 >
//                   <span>{`${item.name}`}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </>
//     )}
//   </div>
// )}
