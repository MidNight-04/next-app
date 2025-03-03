"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../components/ui/sidebar";
import Link from "next/link";
import { useAuthStore } from "../../store/useAuthStore";
import { getDashboardSidebar } from "../../constant/dashboardSidebarData";
import { redirect, usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import Image from "next/image";

const SideNav = () => {
  const userType = useAuthStore(state => state.userType);
  const content = getDashboardSidebar(userType);
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0B192C]">
        <SidebarGroup className="pr-0 pl-5">
          <SidebarHeader>
            <Link
              href={"/admin/home"}
              className="text-lg pt-[14px] font-semibold"
            >
              <Image src="/assets/LOGO.png" alt="log" height={30} width={184} />
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            {content.map((item, index) => (
              <SidebarMenu key={item.name}>
                <SidebarGroupLabel className="text-[#8a8a8a] font-[700] text-[13px] font-ubuntu">
                  {item.name}
                </SidebarGroupLabel>
                <>
                  {item.menuItem.map(item => (
                    <SidebarMenuItem key={item.feildName}>
                      <SidebarMenuButton
                        className="pr-0 hover:bg-[#EEE9DA] hover:text-black"
                        asChild
                      >
                        <Link
                          className={cn(
                            "text-[#93BFCF] font-normal flex flex-row justify-between",
                            path.includes(item.path) ? "text-[#EEE9DA] " : ""
                          )}
                          href={item.path}
                        >
                          <div className="flex flex-row gap-2 text-base items-center">
                            <span>{item.iconName}</span>
                            <span>{item.feildName}</span>
                          </div>
                          {path.includes(item.path) && (
                            <span className="bg-[#EEE9DA] w-[6px] h-[140%] rounded-md" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
                {content.length - 1 === index ? (
                  ""
                ) : (
                  <hr className="border-[#565656] ml-2 my-4 w-[85%]" />
                )}
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideNav;

// const { openMenu } = useSelector(store => store.styleReducer);
// const { userRole } = useSelector(store => store.userReducer);
// const [activeTab, setActiveTab] = useState("");
// const sideBarRoute = getDashboardSidebar(userRole);
// // console.log(userRole)

// // activeAdminNavLink

// const setActiveTabFunc = id => {
//   setActiveTab(id);
//   // console.log('activeAdminNavLink --->>>>>>>>', id);
//   setTimeout(() => {
//     // console.log('activeTab --->>>>>', activeTab);
//   }, 2000);
// };

// const dispatch = useDispatch();
// return (
//   <div
//     className={`sidebar menu_open_${openMenu === undefined ? false : openMenu}`}
//   >
//     <div className="top mt-3">
//       <Link href="/" className="adminNavLink">
//         {openMenu ? null : (
//           <>
//             <span className="logo">Thikedaardotcompvtltd</span>
//             <p
//               className="text-center"
//               style={{ fontSize: "14px", color: "#fec20e" }}
//             >
//               ({userRole.substring(5).toLowerCase()})
//             </p>
//           </>
//         )}
//       </Link>
//       <span className="menu_icon " onClick={() => dispatch(changeOpenMenu())}>
//         {!openMenu ? <BiSolidLeftArrow className="left" /> : <MenuIcon />}
//       </span>
//     </div>
//     <hr />
//     {!openMenu ? (
//       <div className="center">
//         <ul>
//           {sideBarRoute?.map((data, index) => (
//             <div key={index}>
//               <p className={data.paraClass}>{data.name}</p>
//               {data.menuItem.map((item, index) => (
//                 <div
//                   onClick={() => setActiveTabFunc(item.feildName)}
//                   className={
//                     activeTab === item.feildName ? "activeAdminNavLink" : ""
//                   }
//                   key={index}
//                 >
//                   <li
//                     onClick={() => setActiveTabFunc(item.feildName)}
//                     className={
//                       activeTab === item.feildName ? "activeAdminNavLink" : ""
//                     }
//                   >
//                     <Link href={item.path} className={item.linkClassName}>
//                       {item.iconName}
//                       <span>{item.feildName}</span>
//                     </Link>
//                   </li>
//                   {item.subMenuItem.map((subItem, index) => (
//                     <ul
//                       onClick={() => setActiveTabFunc(item.feildName)}
//                       className={
//                         activeTab === item.feildName ? "activeAdminNavLink" : ""
//                       }
//                       key={index}
//                     >
//                       <li
//                         onClick={() => setActiveTabFunc(item.feildName)}
//                         className={
//                           activeTab === item.feildName
//                             ? "activeAdminNavLink"
//                             : ""
//                         }
//                       >
//                         <NavLink
//                           to={subItem.path}
//                           className={subItem.linkClassName}
//                         >
//                           {subItem.iconName}
//                           <span>{subItem.feildName}</span>
//                         </NavLink>
//                       </li>
//                     </ul>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </ul>
//       </div>
//     ) : (
//       <div className="center">
//         <ul>
//           {sideBarRoute.map(data => (
//             <>
//               <p className={data.paraClass}>{data.name}</p>
//               {data.menuItem.map(item => (
//                 <li key={item.path}>
//                   <Link href={item.path} className={item.linkClassName}>
//                     {item.iconName}
//                   </Link>
//                 </li>
//               ))}
//             </>
//           ))}
//         </ul>
//       </div>
//     )}
//     {/* <div className="bottom">
//       <div className="colorOption"></div>
//       <div className="colorOption"></div>
//     </div> */}
//   </div>
// );
