"use client";
import AsideContainer from "../../../../components/AsideContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";

const AddClientForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
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
    } else if (!data.email) {
      toast.error("Email is required", {
        position: "top-right",
      });
    } else if (!data.phone) {
      toast.error("Phone is required", {
        position: "top-right",
      });
    } else if (!data.address) {
      toast.error("Address is required", {
        position: "top-right",
      });
    } else {
      console.log(data);
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/client/add`, {
          data,
        })
        .then(response => {
          router.push("/admin/clients");
          if (response.data.status === 201) {
            setData({
              name: "",
              email: "",
              phone: "",
              address: "",
            });
            toast.success(response.data.message, {
              position: "top-right",
            });
          } else {
            toast.error(response.data.message, {
              position: "top-right",
            });
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
        <h1>Add Client</h1>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="grid grid-cols-2 gap-4 -md:grid-cols-1 mb-4">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="name"
                id="name"
                className="text-lg font-semibold text-secondary"
              >
                Name
              </label>
              <input
                value={data.name}
                type="text"
                placeholder="Enter Name"
                name="name"
                className="outline-none border border-[#efefef] rounded-[7px] p-3 bg-[#fafafa]"
                onChange={e => handleFormData(e)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="email"
                id="email"
                className="text-lg font-semibold text-secondary"
              >
                Email
              </label>
              <input
                value={data.email}
                type="email"
                placeholder="Enter Email"
                className="outline-none border border-[#efefef] rounded-[7px] p-3 bg-[#fafafa]"
                name="email"
                onChange={e => handleFormData(e)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="phone"
                id="phone"
                className="text-lg font-semibold text-secondary"
              >
                Phone
              </label>
              <input
                value={data.phone}
                type="number"
                placeholder="Enter Phone"
                className="outline-none border border-[#efefef] rounded-[7px] p-3 bg-[#fafafa]"
                name="phone"
                onChange={e => handleFormData(e)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="address"
                id="address"
                className="text-lg font-semibold text-secondary"
              >
                Address
              </label>
              <input
                value={data.address}
                type="text"
                placeholder="Enter Address"
                className="outline-none border border-[#efefef] rounded-[7px] p-3 bg-[#fafafa]"
                name="address"
                onChange={e => handleFormData(e)}
              />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <button
              className="bg-secondary  text-primary rounded-3xl px-4 py-3 inline-block font-semibold items-center"
              onClick={() => submitFormData()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddClientForm;
