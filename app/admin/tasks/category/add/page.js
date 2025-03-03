"use client";
import AsideContainer from "../../../../../components/AsideContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";

const AddTaskCategoryForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
  });

  const handleFormData = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitFormData = () => {
    if (!data.name) {
      toast.error("Name is required", {
        position: "top-right",
      });
    } else {
      //   console.log(data);
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/category/add`, {
          data,
        })
        .then(response => {
          if (response) {
            if (response.data.status === 204) {
              toast.error(response.data.message, {
                position: "top-right",
              });
            } else {
              setData({
                name: "",
              });
              toast.success(response.data.message, {
                position: "top-right",
              });
              router.back();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      {/* <AdminSidebar /> */}
      <div className="singleContainer">
        {/* <AdminNavbar /> */}
        <div className="adminNewUser">
          <div className="newContainer">
            <div className="flex flex-row gap-2 items-center my-4">
              <IoIosArrowBack
                className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
                onClick={() => router.back()}
              />
              <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
                Add Category
              </h1>
            </div>
            <div className="bottomContainer">
              <div className="bottomRightContainer">
                <div className="form">
                  <div className="formInputContainer">
                    <label>
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.name}
                      type="text"
                      placeholder="Enter Category"
                      name="name"
                      onChange={e => handleFormData(e)}
                    />
                  </div>
                </div>
                <div className="createUserSubmitBTN" onClick={submitFormData}>
                  Submit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};
export default AddTaskCategoryForm;
