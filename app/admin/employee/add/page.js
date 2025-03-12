"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";
import { toast } from "sonner";
import { IoIosArrowBack } from "react-icons/io";
import { MenuItem, Select } from "@mui/material";

const AddMemberForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    employeeID: "",
    role: "",
    email: "",
    phone: "",
    address: "",
  });
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/projectrole/getall`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data);
          setRoleList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleFormData = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitFormData = () => {
    if (!data.name) {
      toast("Name is required", {
        position: "top-right",
      });
    } else if (!data.employeeID) {
      toast("Employee ID is required", {
        position: "top-right",
      });
    } else if (!data.role) {
      toast("Role is required", {
        position: "top-right",
      });
    } else if (!data.email) {
      toast("Email is required", {
        position: "top-right",
      });
    } else if (!data.phone) {
      toast("Phone is required", {
        position: "top-right",
      });
    } else {
      console.log(data);
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/teammember/add`, {
          data,
        })
        .then(response => {
          if (response) {
            setData({
              name: "",
              employeeID: "",
              role: "",
              email: "",
              phone: "",
              address: "",
            });
            toast(response.data.message, {
              position: "top-right",
            });
            router.back();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      <div className="flex flex-row items-center text-2xl font-bold gap-2 my-4">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1>Add Employee </h1>
      </div>
      <div className="bg-white rounded-3xl p-5">
        <div className="grid grid-cols-2 gap-4 [&_label]:font-semibold">
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="name"
              value={data.name}
              type="text"
              placeholder="Enter Name"
              name="name"
              onChange={e => handleFormData(e)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Employee ID</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="employeeId"
              value={data.employeeID}
              type="text"
              placeholder="Enter Employee ID"
              name="employeeID"
              onChange={e => handleFormData(e)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="role">Role</label>
            <Select
              sx={{
                "borderRadius": "7px",
                "background": "#f3f4f6",
                "outline": "none",
                "& :hover": {
                  outline: "none",
                },
                "& .MuiInputBase-root": {
                  "outline": "none",
                  "background": "#cfcfcf",
                  "& :hover": {
                    outline: "none",
                  },
                },
                "color": "#4b5563",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #93bfcf",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #93bfcf",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #93bfcf",
                },
                ".MuiSvgIcon-root ": {
                  fill: "#93bfcf !important",
                },
              }}
              name="role"
              value={data.role}
              onChange={e => handleFormData(e)}
            >
              <MenuItem value="">Select Role</MenuItem>
              {roleList?.map((item, index) => {
                return (
                  <MenuItem key={index} value={item?._id}>
                    {item?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="email"
              value={data.email}
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={e => handleFormData(e)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Phone</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="phone"
              value={data.phone}
              type="number"
              placeholder="Enter Phone"
              name="phone"
              onChange={e => handleFormData(e)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Address</label>
            <input
              className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
              id="address"
              value={data.address}
              type="text"
              placeholder="Enter Address"
              name="address"
              onChange={e => handleFormData(e)}
            />
          </div>
        </div>
        <div className="flex justify-end items-center mt-4">
          <button
            className="bg-secondary text-primary font-semibold rounded-3xl px-4 py-3 flex flex-row  items-center"
            onClick={submitFormData}
          >
            Submit
          </button>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddMemberForm;
