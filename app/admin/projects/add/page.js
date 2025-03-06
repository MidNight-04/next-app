"use client";
import AsideContainer from "../../../../components/AsideContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { useAuthStore } from "../../../../store/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";

const AddProjectForm = () => {
  const router = useRouter();
  const userName = useAuthStore(state => state.username);
  const activeUser = useAuthStore(state => state.userId);
  const [data, setData] = useState({
    name: "",
    siteID: "",
    location: "",
    client: "",
    plan: "",
    floor: "",
    area: "",
    amount: "",
    date: "",
    duration: "",
    admin: "",
    manager: "",
    architect: "",
    sr_engineer: "",
    engineer: "",
    accountant: "",
    operation: "",
    sales: "",
    contractor: "",
  });
  const [floorList, setFloorList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [clientId, setClientId] = useState("");
  const [stages, setStages] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/constructionstep/getall`)
      .then(response => {
        setStages(
          response?.data?.data?.sort((a, b) => a.priority - b.priority)
        );
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
        setStages([]);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        if (response) {
          // console.log(response.data.data);
          setMemberList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/client/getall`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data);
          setClientList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/contractor/applications`)
      .then(response => {
        if (response) {
          // console.log(response.data.data);
          setContractorList(
            response.data.data?.filter(
              item => item.approvalStatus === "Approved"
            )
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/floor/getall`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data);
          setFloorList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // console.log(stages);
  // console.log(data);
  const handleFormData = e => {
    // console.log(e.target.value);
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const memberName = value.split(",")[0];
      const memberId = value.split(",")[1];
      const data = {
        name: memberName,
        employeeID: memberId,
      };
      // Handle checkbox inputs
      setData(prevData => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], data] // Add to array if checked
          : prevData[name].filter(item => item.employeeID !== memberId), // Remove from array if unchecked
      }));
    } else if (name === "client") {
      setData({ ...data, [name]: value });
      const clientId = value.split("-")[1];
      setClientId(clientId);
    } else {
      // Handle other inputs
      setData({ ...data, [name]: value });
    }
  };

  const submitFormData = () => {
    if (!data.name) {
      toast.error("Name is required", {
        position: "top-right",
      });
      // } else if (!data.siteID) {
      //   toast.error("Site ID is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.location) {
      //   toast.error("Location is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.client) {
      //   toast.error("Client is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.floor) {
      //   toast.error("Floor is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.area) {
      //   toast.error("Area is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.cost) {
      //   toast.error("Cost is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.date) {
      //   toast.error("Start date is required", {
      //     position: "top-right",
      //   });
      // } else if (!data.duration) {
      //   toast.error("Duration is required", {
      //     position: "top-right",
      //   });
      // } else if (data.admin?.length === 0) {
      //   toast.error("Admin is required", {
      //     position: "top-right",
      //   });
      // } else if (data.manager?.length === 0) {
      //   toast.error("Project Manager is required", {
      //     position: "top-right",
      //   });
      // } else if (data.sr_engineer?.length === 0) {
      //   toast.error("Sr. Engineer is required", {
      //     position: "top-right",
      //   });
      // } else if (data.engineer?.length === 0) {
      //   toast.error("Site Engineer is required", {
      //     position: "top-right",
      //   });
      // } else if (data.accountant?.length === 0) {
      //   toast.error("Accountant is required", {
      //     position: "top-right",
      //   });
      // } else if (data.operation?.length === 0) {
      //   toast.error("Operation is required", {
      //     position: "top-right",
      //   });
      // } else if (data.sales?.length === 0) {
      //   toast.error("Sales is required", {
      //     position: "top-right",
      //   });
      // } else if (data.contractor?.length === 0) {
      //   toast.error("Contractor is required", {
      //     position: "top-right",
      //   });
    } else {
      const uploadData = {
        name: data.name,
        siteID: data.siteID,
        location: data.location,
        client: data.client,
        plan: data.plan,
        floor: data.floor,
        area: data.area,
        cost: data.cost,
        date: data.date,
        duration: data.duration,
        manager: data.manager,
        accountant: data.accountant,
        architect: data.architect,
        sr_engineer: data.sr_engineer,
        engineer: data.engineer,
        contractor: data.contractor,
        operation: data.operation,
        admin: data.admin,
        sales: data.sales,
        assignedName: userName,
        assignedID: activeUser,
      };

      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/project/add`, {
          uploadData,
        })
        .then(response => {
          // if (response.data.status === 201) {
          //   setData({
          //     name: "",
          //     siteID: "",
          //     location: "",
          //     client: "",
          //     plan: "",
          //     floor: "",
          //     area: "",
          //     cost: "",
          //     date: "",
          //     duration: "",
          //     manager: [],
          //     accountant: [],
          //     engineer: [],
          //     sr_engineer: [],
          //     contractor: [],
          //     operation: [],
          //     admin: [],
          //     sales: [],
          //   });
          //   toast.success(response.data.message, {
          //     position: "top-right",
          //   });
          //   router.push("/admin/projects");
          // } else {
          //   toast.error(response.data.message, {
          //     position: "top-right",
          //   });
          // }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <AsideContainer>
      <div className="mt-5">
        <div className="flex flex-row gap-2 items-center">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Add Project
          </h1>
        </div>
        <p
          className="text-center"
          style={{ color: "rgb(255, 119, 0)", wordSpacing: "2px" }}
        >
          Create Process and Checklist point before Project creation
        </p>
        <div className="bg-white rounded-[15px] p-5 mb-5">
          <div className="col-lg-12">
            <div>
              <div style={{ marginLeft: "0px" }}>
                <div>
                  <div className="grid grid-cols-2 gap-4 gap-x-8">
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Name</label>
                      <input
                        value={data.name}
                        type="text"
                        placeholder="Enter Name"
                        name="name"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Site ID</label>
                      <input
                        value={data.siteID}
                        type="text"
                        placeholder="Enter SiteID"
                        name="siteID"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Location</label>
                      <input
                        value={data.location}
                        type="text"
                        placeholder="Enter project location"
                        name="location"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="client">Client</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, client: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientList?.map((item, index) => {
                            return (
                              <SelectItem key={index} value={item?._id}>
                                {item?.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Number of Floor</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, floor: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorList?.map((item, index) => (
                            <SelectItem key={index} value={item.name}>
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Select Floor Plan</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, plan: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages?.map((item, index) => (
                            <SelectItem key={index} value={item._id}>
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Area</label>
                      <input
                        value={data.area}
                        type="text"
                        placeholder="Enter project area"
                        name="area"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Cost</label>
                      <input
                        value={data.cost}
                        type="number"
                        placeholder="Enter project cost"
                        name="cost"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Start Date</label>
                      <input
                        value={data.date}
                        type="date"
                        name="date"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Duration(In months)</label>
                      <input
                        value={data.duration}
                        type="number"
                        name="duration"
                        min={1}
                        placeholder="Enter Construction duration"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    {/* <div className="formInputContainer col-lg-6">
                      <label htmlFor="role">
                        Flow Structure
                      </label>
                      
                    </div> */}
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Project Admin</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, admin: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm => itm.role?.name.toLowerCase() === "admin"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Project Manager</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, manager: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === "manager"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Architect</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, architect: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === "architect"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Sr. Engineer</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, sr_engineer: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() ===
                                  "sr. engineer"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Site Engineer</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, engineer: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() ===
                                  "site engineer"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Accountant</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, accountant: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === "accountant"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Operation</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, operation: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === "operations"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Sales</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, sales: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm => itm.role?.name.toLowerCase() === "sales"
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Contractor</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, contractor: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractorList?.map((item, index) => (
                              <SelectItem key={index} value={item._id}>
                                {item?.name} ({item?.companyNameShopName})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-4"></div>
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl cursor-pointer mt-4"
                    onClick={submitFormData}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddProjectForm;
