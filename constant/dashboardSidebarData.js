import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import InsertChartIcon from "@mui/icons-material/InsertChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
// import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContactsIcon from "@mui/icons-material/Contacts";
import CurrencyRupee from "@mui/icons-material/CurrencyRupee";
import { ListItemIcon } from "@mui/material";
import {
  AddTask,
  Dashboard,
  ListAlt,
  Task,
  TaskAlt,
} from "@mui/icons-material";
import { GrProjects } from "react-icons/gr";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TbBuildingCommunity } from "react-icons/tb";
import {
  MdCardMembership,
  MdCategory,
  MdOutlineChecklistRtl,
  MdOutlinePayment,
} from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
// const userRole = localStorage.getItem("role");

const adminSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/home",
        iconName: <DashboardIcon />,
        feildName: "Dashboard",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/profile",
        iconName: <AccountBoxIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Project Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/projects",
        iconName: <GrProjects />,
        feildName: "Projects",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/payment-stages",
        iconName: <MdOutlinePayment />,
        feildName: "Payment Stages",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/construction-steps",
        iconName: <TbBuildingCommunity />,
        feildName: "Construction",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/inspections",
        iconName: <MdOutlineChecklistRtl />,
        feildName: "Inspections",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/clients",
        iconName: <AiOutlineUsergroupAdd />,
        feildName: "Clients",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/employee",
        iconName: <HiOutlineUserGroup />,
        feildName: "Employee",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/roles",
        iconName: <MdCardMembership />,
        feildName: "Employee Role",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/floors",
        iconName: <BsBuilding />,
        feildName: "Floors",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Tickets Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tickets",
        iconName: <ListAlt />,
        feildName: "Tickets",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/admin/ticket/add",
      //   iconName: <ListAlt  style={{color:"#fec20e"}} />,
      //   feildName: "Raise Ticket",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
  {
    name: "Task Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tasks/dashboard",
        iconName: <Dashboard />,
        feildName: "Dashboard",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/tasks/assign",
        iconName: <AddTask />,
        feildName: "Assign Task",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/tasks/list",
        iconName: <Task />,
        feildName: "Task List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/tasks/category",
        iconName: <MdCategory />,
        feildName: "Task Category",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  // {
  //   name: "Log Management",
  //   paraClass: "title",
  //   menuItem: [
  //     {
  //       path: "/admin/log/list",
  //       iconName: <ListAlt  style={{color:"#fec20e"}} />,
  //       feildName: "Logs",
  //       linkClassName: "adminNavLink",
  //       subMenuItem: [],
  //     },
  //     // {
  //     //   path: "/admin/ticket/add",
  //     //   iconName: <ListAlt  style={{color:"#fec20e"}} />,
  //     //   feildName: "Raise Ticket",
  //     //   linkClassName: "adminNavLink",
  //     //   subMenuItem: [],
  //     // },
  //   ],
  // },
  {
    name: "User Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/users",
        iconName: <GroupIcon />,
        feildName: "Users List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/dealers-list",
        iconName: <GroupIcon />,
        feildName: "Dealers List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/architect-list",
        iconName: <GroupIcon />,
        feildName: "Architects List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/contractor-list",
        iconName: <GroupIcon />,
        feildName: "Contractors List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Product Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/category",
        iconName: <StoreMallDirectoryIcon />,
        feildName: "Categories",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/design-list",
        iconName: <GroupIcon />,
        feildName: "Designs",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/product-list",
        iconName: <StoreMallDirectoryIcon />,
        feildName: "Products",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Payment Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/requests",
        iconName: <StoreMallDirectoryIcon />,
        feildName: "Requests",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/orders",
        iconName: <ShoppingCartIcon />,
        feildName: "Orders",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/enquiries",
        iconName: <QuestionAnswerIcon />,
        feildName: "Enquiries",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/payments",
        iconName: <CurrencyRupee />,
        feildName: "Payments",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Setting",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/notifications",
        iconName: <NotificationsIcon />,
        feildName: "Notifications",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
];

const userSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/user/enquiries",
        iconName: <QuestionAnswerIcon />,
        feildName: "Enquiries",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/user/orders",
        iconName: <ShoppingCartIcon />,
        feildName: "Orders",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/user/wishlist",
        iconName: <FavoriteIcon />,
        feildName: "Wishlist",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/user/address",
        iconName: <ContactsIcon />,
        feildName: "Address",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/user/notifications",
        iconName: <NotificationsIcon />,
        feildName: "Notifications",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  // {
  //   name: "Lists",
  //   paraClass: "title",
  //   menuItem: [
  //     {
  //       path: "/user/application",
  //       iconName: <GroupIcon  style={{color:"#fec20e"}} />,
  //       feildName: "My Application",
  //       linkClassName: "adminNavLink",
  //       subMenuItem: [],
  //     },
  //     // {
  //     //   path: "/user/orders",
  //     //   iconName: <ShoppingCartIcon  style={{color:"#fec20e"}} />,
  //     //   feildName: "My Orders",
  //     //   linkClassName: "adminNavLink",
  //     //   subMenuItem: [],
  //     // },
  //   ],
  // },
];

const architectSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/architect/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Lists",
    paraClass: "title",
    menuItem: [
      {
        path: "/architect/application",
        iconName: <GroupIcon />,
        feildName: "My Application",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/architect/designs",
        iconName: <StoreMallDirectoryIcon />,
        feildName: "My Designs",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/architect/designs-upload",
        iconName: <ShoppingCartIcon />,
        feildName: "Upload Designs",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/architect/enquiries",
        iconName: <QuestionAnswerIcon />,
        feildName: "Enquiries",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/architect/orders",
        iconName: <ShoppingCartIcon />,
        feildName: "Orders",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/architect/notifications",
        iconName: <NotificationsIcon />,
        feildName: "Notifications",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
];

const contractorSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/contractor/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "My application",
    paraClass: "title",
    menuItem: [
      {
        path: "/contractor/application",
        iconName: <GroupIcon />,
        feildName: "My application",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Project Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/contractor/project/list",
        iconName: <GroupIcon />,
        feildName: "Project List",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/contractor/material-request/list",
        iconName: <GroupIcon />,
        feildName: "Material Request",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
];

const managerSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Project Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/projects",
        iconName: <GroupIcon />,
        feildName: "Projects",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/material-request/list",
      //   iconName: <GroupIcon />,
      //   feildName: "Material Request",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
  {
    name: "Task Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tasks/dashboard",
        iconName: <Dashboard />,
        feildName: "Dashboard",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/tasks/assign",
        iconName: <AddTask />,
        feildName: "Assign Task",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/member/tasklist",
      //   iconName: <Task  style={{color:"#fec20e"}} />,
      //   feildName: "All Tasks",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
  {
    name: "Tickets Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tickets",
        iconName: <ListAlt />,
        feildName: "Tickets",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/admin/ticket/add",
      //   iconName: <ListAlt  style={{color:"#fec20e"}} />,
      //   feildName: "Raise Ticket",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
];

const clientSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Project Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/projects",
        iconName: <GroupIcon />,
        feildName: "Projects",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/admin/documents",
        iconName: <ListAlt />,
        feildName: "Documents",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Tickets Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tickets",
        iconName: <ListAlt />,
        feildName: "Tickets",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/client/ticket/add",
      //   iconName: <ListAlt  style={{color:"#fec20e"}} />,
      //   feildName: "Raise Ticket",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
];

const dealerSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/dealer/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Lists",
    paraClass: "title",
    menuItem: [
      {
        path: "/dealer/application",
        iconName: <GroupIcon />,
        feildName: "My Application",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/dealer/product-upload",
        iconName: <ShoppingCartIcon />,
        feildName: "Upload Product",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/dealer/your-designs",
        iconName: <ShoppingCartIcon />,
        feildName: "My Products",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/dealer/orders",
        iconName: <ShoppingCartIcon />,
        feildName: "Orders",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      {
        path: "/dealer/notifications",
        iconName: <NotificationsIcon />,
        feildName: "Notifications",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
];

const siteEngineerSidebar = [
  {
    name: "Main",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/profile",
        iconName: <DashboardIcon />,
        feildName: "Profile",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Project Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/projects",
        iconName: <GroupIcon />,
        feildName: "Projects",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
      // {
      //   path: "/material-request/list",
      //   iconName: <GroupIcon />,
      //   feildName: "Material Request",
      //   linkClassName: "adminNavLink",
      //   subMenuItem: [],
      // },
    ],
  },
  {
    name: "Task Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tasks/dashboard",
        iconName: <Dashboard />,
        feildName: "Dashboard",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
  {
    name: "Tickets Management",
    paraClass: "title",
    menuItem: [
      {
        path: "/admin/tickets",
        iconName: <ListAlt />,
        feildName: "Tickets",
        linkClassName: "adminNavLink",
        subMenuItem: [],
      },
    ],
  },
];

export const getDashboardSidebar = role => {
  switch (role) {
    case "ROLE_ADMIN":
      return adminSidebar;

    case "ROLE_USER":
      return userSidebar;

    case "ROLE_ARCHITECT":
      return architectSidebar;

    case "ROLE_CONTRACTOR":
      return contractorSidebar;

    case "ROLE_PROJECT MANAGER":
      return managerSidebar;

    case "ROLE_SR. ENGINEER":
      return managerSidebar;

    case "ROLE_SALES":
      return managerSidebar;

    case "ROLE_SITE ENGINEER":
      return siteEngineerSidebar;

    case "ROLE_OPERATIONS":
      return managerSidebar;

    case "ROLE_SITE SUPERVISOR":
      return managerSidebar;

    case "ROLE_HR":
      return managerSidebar;

    case "ROLE_ACCOUNTANT":
      return managerSidebar;

    case "ROLE_PROJECT ADMIN":
      return managerSidebar;

    case "ROLE_DEALER":
      return dealerSidebar;

    case "ROLE_CLIENT":
      return clientSidebar;
    default:
      break;
  }
};
