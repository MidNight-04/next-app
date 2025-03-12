"use client";
import { useState } from "react";
import img1 from "../../public/assets/phone.png";
import img2 from "../../public/assets/WEB3.png";
import img3 from "../../public/assets/architect.jpg";
import img4 from "../../public/assets/contractor.jpg";
import img5 from "../../public/assets/dealer.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/actions/userAction";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Drawer,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import useDimensions from "../../helpers/useDimensions";
import { useDebounce } from "../../helpers/useDeboune";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { ToastContainer } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { SlLogout } from "react-icons/sl";

const menu = [
  {
    id: 1,
    title: "Home",
    to: "/",
    Option: "false",
  },
  {
    id: 2,
    title: "Design Your Home",
    to: "/design-your-home",
    Option: "false",
  },
  {
    id: 3,
    title: "Shop Material",
    to: "/shop-material",
    Option: "false",
  },
  {
    id: 4,
    title: "Turnkey Solutions",
    to: "https://thikedaar.com/",
    Option: "false",
  },
];

const providers = [
  {
    id: 1,
    name: "Architects & Engineers",
    img: img3,
    href: "/service-provider/architect",
  },
  {
    id: 2,
    name: "Contractors & Masons",
    img: img4,
    href: "/service-provider/contractor",
  },
  {
    id: 3,
    name: "Dealers / Sellers",
    img: img5,
    href: "/service-provider/dealer",
  },
];

const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { width } = useDimensions();
  const debounceWidth = useDebounce(width, 500);
  const isAuth = useAuthStore(state => state.isAuth);
  const setLogout = useAuthStore(state => state.setLogout);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setToggle(prev => !prev);
  };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   dispatch(logout());
  // };

  return (
    <header className="sticky top-0 left-0 z-10 w-full shadow-md bg-black h-[74px] flex items-center">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="px-24 grid md:grid-cols-16 grid-flow-row-dense justify-between items-center w-full -xl:px-16 -md:px-12 -xl:flex -sm:px-4">
        {debounceWidth < 1100 && (
          <div
            className="w-auto inline-block cursor-pointer"
            onClick={toggleDrawer}
          >
            <MenuIcon sx={{ color: "#eab308", display: "inline-block" }} />
          </div>
        )}
        <div
          onClick={() => router.push("/homepage")}
          className="group transition duration-300 col-start-1 col-span-2"
        >
          <div className=" mr-4 -md:col-start-2 -md:col-span-4 -md:w-40 -md:m-0 -xl:text-sm">
            <Image
              src={img2}
              height={32}
              width={216}
              className="w-full h-full mb-1 -md:mt-3 -md:ml-2"
              alt="Thikedaar.com"
            />
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500 -md:ml-2" />
          </div>
        </div>
        <div className="flex col-start-3 col-span-2 p-1 pl-4 w-[305px] h-[46px] rounded-full border-[1px] border-[#EFEFEF] bg-[#f8f8f8] overflow-hidden max-w-md mx-auto text-[#565656]">
          <input
            type="text"
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
        {debounceWidth < 1100 ? (
          <Drawer
            open={toggle}
            onClose={toggleDrawer}
            sx={{ background: "rgba(0,0,0,.10)" }}
          >
            <div className="bg-black h-full p-2 overflow-hidden">
              <div
                onClick={toggleDrawer}
                className=" absolute right-4 ml-auto inline-block text-yellow-500 font-semibold cursor-pointer"
              >
                Close <CloseIcon sx={{ color: "#eab308", fontSize: "2rem" }} />
              </div>
              <div className="gap-2 py-6 flex flex-col my-4">
                {menu?.map(m => (
                  <div
                    onClick={() => router.push(m.to)}
                    key={m.id}
                    className="text-white font-bold capitalize no-underline py-2.5 -xl:text-sm group transition duration-300"
                  >
                    <div className="inline-block text-white font-bold cursor-pointer capitalize no-underline group transition duration-300 -xl:text-sm ml-4">
                      {m.title}
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500 mt-1" />
                    </div>
                  </div>
                ))}
                <Accordion>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: "white", border: "none" }} />
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ background: "black", border: "none" }}
                  >
                    <div className="inline-block text-white bg-black font-bold cursor-pointer capitalize no-underline group transition duration-300 -xl:text-sm">
                      Find Service Provider
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500 mt-1" />
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ background: "black", border: "none" }}
                  >
                    <div className="flex flex-col gap-3 w-full justify-between transition duration-300 ease-in-out">
                      {providers.map(item => (
                        <div
                          className="w-full h-auto border-[1px] rounded-[4px] border-solid border-yellow-500 p-1 text-center group hover:scale-105 transition-all duration-500 "
                          key={item.id}
                        >
                          <Card sx={{ maxWidth: 345, background: "black" }}>
                            <Link href={item.href}>
                              <CardActionArea>
                                <Image
                                  height={120}
                                  width={160}
                                  src={item.img}
                                  alt="img"
                                  className="h-20 w-full"
                                />
                                <div className="text-white font-semibold inline-block text-center text-xs">
                                  {item.name}
                                </div>
                              </CardActionArea>
                            </Link>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </Drawer>
        ) : (
          <div className="flex flex-row col-start-7 col-span-5 justify-between w-100 align-center items-center gap-4">
            {menu?.map(m => (
              <div
                key={m.id}
                onClick={() => router.push(m.to)}
                className="text-white font-bold capitalize no-underline -xl:text-sm group transition duration-300 cursor-pointer"
              >
                {m.title}
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
              </div>
            ))}
            <HoverCard>
              <HoverCardTrigger>
                <div className="inline-block text-white font-bold cursor-pointer capitalize no-underline group transition duration-300 -xl:text-sm">
                  Find Service Provider
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                style={{ background: "white", borderRadius: "6px" }}
              >
                <div className="flex flex-row gap-2 w-auto transition duration-300 ease-in-out">
                  {providers.map(item => (
                    <div
                      onClick={() => router.push(item.href)}
                      className="w-48 h-48 border-[1px] rounded-xl border-solid border-teal-100 flex flex-col items-center p-1 text-center group hover:scale-110 transition-all duration-500 "
                      key={item.id}
                    >
                      <Image
                        height={120}
                        width={180}
                        src={item.img}
                        alt="img"
                      />
                      <p className="text-black font-semibold py-2 hover:text-yellow-500 transition-all duration-500">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}

        {/* <div className="sticky top-0 left-0 flex flex-row justify-between">
          {userData?.username && isSubOpen ? (
            <>
              <p
                onClick={() =>
                  navigate(
                    userRole === "ROLE_ADMIN"
                      ? "/admin"
                      : userRole === "ROLE_DEALER"
                      ? `/${userRole.substring(5).toLowerCase()}/profile`
                      : userRole === "ROLE_ARCHITECTURE"
                      ? `/${userRole.substring(5).toLowerCase()}/profile`
                      : userRole === "ROLE_CONTRACTOR"
                      ? `/${userRole.substring(5).toLowerCase()}/profile`
                      : userRole === "ROLE_USER"
                      ? `/${userRole.substring(5).toLowerCase()}/profile`
                      : userRole === "ROLE_CLIENT"
                      ? `/client/profile`
                      : `/member/profile`
                  )
                }
              >
                {userRole === "ROLE_ADMIN" ? "Dashboard" : "Profile"}
              </p>
              <p onClick={handleLogout}>Logout</p>
            </>
          ) : null}
        </div> */}

        <div className="col-start-12 items-end flex justify-end">
          <>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar alt="user" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                "& ul": {
                  borderRadius: "7px",
                },
                "& li": {
                  padding: 0,
                },
              }}
            >
              <div className="flex flex-col w-full items-center text-center">
                {isAuth ? (
                  <>
                    <div className="font-semibold text-lg text-primary px-10 border-b-[1px] pb-2 border-primary">
                      Account
                    </div>
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/admin/projects"
                        className="w-full px-4 py-2 text-secondary group transition duration-300"
                      >
                        <span className="flex flex-row gap-2 items-center justify-center">
                          <CgProfile className="text-2xl" />
                          Profile
                        </span>
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <div
                        onClick={() => {
                          setLogout();
                          toast("You have been logged out.");
                          redirect("/homepage");
                        }}
                        className="w-full px-4 py-2 text-secondary group transition duration-300"
                      >
                        <span className="flex flex-row gap-3 items-center justify-center">
                          <SlLogout className="text-xl" />
                          Logout
                        </span>
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary" />
                      </div>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-lg text-yellow-500 px-10 border-b-[1px] pb-2 border-yellow-500">
                      Login
                    </div>
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/login/auth"
                        className="w-full px-4 py-2 text-gray-300 hover:text-white group transition duration-300"
                      >
                        User
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/login/auth-client"
                        className="w-full px-4 py-2 text-gray-300 hover:text-white group transition duration-300"
                      >
                        Client
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/login/auth-member"
                        className="w-full px-4 py-2 text-gray-300 hover:text-white group transition duration-300"
                      >
                        Employee
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
                      </Link>
                    </MenuItem>
                  </>
                )}
              </div>
            </Menu>
          </>
        </div>
      </div>
    </header>
  );
};

export default Header;
