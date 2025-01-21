"use state";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "../../store/useAuthStore";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const setLogout = useAuthStore(state => state.setLogout);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="bg-white w-full flex flex-row justify-between items-center pr-4 h-[86px] sticky top-0 right-0 z-[1]">
      <div className="flex flex-row justify-center items-center py-[20px]">
        <div>
          <SidebarTrigger className="hover:bg-primary mx-2" />
        </div>
        <div className="flex p-1 pl-4 w-[305px] h-[46px] rounded-full border-[1px] border-[#EFEFEF] bg-[#f8f8f8] overflow-hidden max-w-md mx-auto text-[#565656]">
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
      </div>
      <div className="col-start-8 items-end flex justify-end">
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
              background: "black",
              border: "1px solid white  ",
              borderRadius: "4px",
            },
            "& li": {
              padding: 0,
            },
          }}
        >
          <div className="flex flex-col w-full items-center text-center bg-black">
            <div className="font-semibold text-lg text-yellow-500 px-10 border-b-[1px] pb-2 border-yellow-500">
              Account
            </div>
            <MenuItem onClick={handleClose}>
              <div
                onClick={() => {
                  // setUrl(path);
                  // router.push("/admin/projects");
                }}
                className="w-full px-4 py-2 text-gray-300 hover:text-white group transition duration-300"
              >
                Profile
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div
                onClick={() => {
                  router.push("/homepage");
                  setLogout();
                }}
                className="w-full px-4 py-2 text-gray-300 hover:text-white group transition duration-300"
              >
                Logout
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-500" />
              </div>
            </MenuItem>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default AdminHeader;
