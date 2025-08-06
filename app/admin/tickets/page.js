'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';
import NoImage from '../../../public/assets/no-image-available.png';
import { RiShareForwardFill } from 'react-icons/ri';
import { useAuthStore } from '../../../store/useAuthStore';
import Link from 'next/link';
import Image from 'next/image';
import AsideContainer from '../../../components/AsideContainer';
import { cn } from '../../../lib/utils';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';

const SkeletonTicketCard = () => (
  <div className="bg-white rounded-3xl p-8 w-full animate-pulse mb-4">
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full justify-between">
        <div className="flex flex-row gap-4">
          <span className="h-[5.25rem] rounded-full w-1 bg-primary" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-5 w-56 bg-gray-200 rounded"></div>
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap mt-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-center px-4 py-2 bg-gray-200 rounded-full border border-gray-300"
            >
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center w-28 h-28">
        <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const { userId, userType } = useAuthStore.getState();
  const hasHydrated = useAuthStore.persist?.hasHydrated();
  const [activeFilter, setActiveFilter] = useState('All Tickets');
  const [filteredTickets, setFilteredTickets] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({
    project: false,
    employee: false,
    client: false,
  });

  const { data: ticketList = [], isLoading } = useQuery({
    queryKey: ['tickets', userType, userId],
    queryFn: async () => {
      if (userType === 'ROLE_USER' || userType === 'ROLE_ADMIN') {
        const res = await api.get(`/tickets/getalltickets`);
        return res.data.data;
      } else if (userType === 'ROLE_CLIENT') {
        const res = await api.get(`/tickets/gettickets/${userId}`);
        return res.data.data;
      } else {
        const res = await api.get(`/tickets/getmembertickets/${userId}`);
        return res.data.data;
      }
    },
  });

  const handleButtonClick = (filter, filterData = null) => {
    setActiveFilter(filter);
    let filteredData;

    switch (filter) {
      case 'All Tickets':
        filteredData = ticketList;
        break;
      case 'Project Tickets':
        filteredData = ticketList.filter(
          ticket => ticket.siteID === filterData
        );
        break;
      case 'Employee Tickets':
        filteredData = ticketList.filter(ticket =>
          ticket.assignMember?.some(obj => obj.employeeID === filterData)
        );
        break;
      case 'Client Tickets':
        filteredData = ticketList.filter(
          ticket => ticket.client?.id === filterData
        );
        break;
      case 'Overdue Tickets':
        filteredData = ticketList.filter(ticket => {
          const initialDate = new Date(ticket.date);
          const dueDate = new Date(initialDate);
          dueDate.setHours(initialDate.getHours() + 72);

          return new Date() > dueDate && ticket.status !== 'Completed';
        });
        break;
      case 'Pending Tickets':
        filteredData = ticketList.filter(ticket => ticket.status === 'Pending');
        break;
      default:
        filteredData = ticketList;
    }
    setFilteredTickets(filteredData);
    setDropdownOpen({ project: false, employee: false, client: false });
  };

  const toggleDropdown = type => {
    setDropdownOpen(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!hasHydrated) return null;

  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator orientation="vertical" className="h-4 bg-black" />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7">
            Ticket List
          </h1>
        </div>
        <div>
          {(userType === 'ROLE_USER' || userType === 'ROLE_ADMIN') && (
            <div className="flex flex-row items-center gap-4">
              {['All Tickets', 'Overdue Tickets', 'Pending Tickets'].map(
                btn => (
                  <button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className={cn(
                      'py-2 px-4 rounded-full border text-nowrap cursor-pointer',
                      activeFilter === btn
                        ? 'text-green-800 bg-green-200 border-green-800'
                        : 'bg-primary-foreground text-primary border-primary'
                    )}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTicketCard key={i} />
          ))
        ) : (filteredTickets ?? ticketList).length > 0 ? (
          (filteredTickets ?? ticketList).map((dt, idx) => (
            <div key={idx} className="mb-4">
              <Link href={`/admin/tickets/${dt._id}`} className="block">
                <div className="bg-white rounded-3xl p-8 w-full">
                  <div className="flex flex-row w-full">
                    <div className="flex flex-col w-full justify-between">
                      <div className="flex flex-row gap-4">
                        <span className="h-[5.25rem] rounded-full w-1 bg-primary" />
                        <div className="flex flex-col font-ubuntu font-bold text-[#565656]">
                          <span className="text-lg">Site ID - {dt.siteID}</span>
                          <span className="text-lg">Query - {dt.query}</span>
                          <span className="text-lg">Status - {dt.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 flex-wrap mt-8 [&_svg]:text-primary [&_svg]:text-2xl">
                        <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border border-primary">
                          <RiShareForwardFill />
                          <p>Work : {dt.work}</p>
                        </span>
                        <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border border-primary">
                          <RiShareForwardFill />
                          <p>Status : {dt.status}</p>
                        </span>
                        <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border border-primary">
                          <RiShareForwardFill />
                          <p>Query : {dt.query}</p>
                        </span>
                        <span className="flex gap-2 items-center p-2 bg-primary-foreground rounded-full border border-primary">
                          <RiShareForwardFill />
                          <p>
                            Assign Member :{' '}
                            {dt.assignMember?.firstname
                              ? `${dt.assignMember.firstname} ${dt.assignMember.lastname}`
                              : 'N/A'}
                          </p>
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center w-28 h-28">
                      <Image
                        width={80}
                        height={80}
                        className="object-cover rounded-md h-full w-auto"
                        src={dt.image?.[0] ?? NoImage}
                        alt="Ticket"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="mt-5 text-warning text-center">
            No tickets available...
          </p>
        )}
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