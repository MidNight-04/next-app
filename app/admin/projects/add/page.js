"use client";
import AsideContainer from "../../../../components/AsideContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../store/useAuthStore";

const AddProjectForm = () => {
  const router = useRouter();
  const userName = useAuthStore(state => state.userName);
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
    manager: [],
    accountant: [],
    engineer: [],
    sr_engineer: [],
    contractor: [],
    operation: [],
    admin: [],
    sales: [],
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
          //   console.log(response.data.data);
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
    console.log(e.target.value);
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
      // console.log(data);
      const uploadData = {
        name: data.name,
        siteID: data.siteID,
        location: data.location,
        client: { name: data.client.split("-")[0], id: clientId },
        plan: data.plan,
        floor: data.floor,
        area: data.area,
        cost: data.cost,
        date: data.date,
        duration: data.duration,
        manager: data.manager,
        accountant: data.accountant,
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
          if (response.data.status === 201) {
            setData({
              name: "",
              siteID: "",
              location: "",
              client: "",
              plan: "",
              floor: "",
              area: "",
              cost: "",
              date: "",
              duration: "",
              manager: [],
              accountant: [],
              engineer: [],
              sr_engineer: [],
              contractor: [],
              operation: [],
              admin: [],
              sales: [],
            });
            toast.success(response.data.message, {
              position: "top-right",
            });
            router.push("/admin/projects");
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
      <div className="newContainer">
        <div className="topContainer">
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 my-4">
            Add Project
          </h1>
        </div>
        <p
          className="text-center"
          style={{ color: "rgb(255, 119, 0)", wordSpacing: "2px" }}
        >
          <span className="text-danger">*</span>
          Create Process and Checklist point before Project creation
          <span className="text-danger">*</span>
        </p>
        <div className="bg-white rounded-[15px] p-5">
          <div className="col-lg-12">
            <div className="bottomContainer">
              <div
                className="bottomRightContainer"
                style={{ marginLeft: "0px" }}
              >
                <div className="form">
                  <div className="row">
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Project Name<span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.name}
                        type="text"
                        placeholder="Enter Name"
                        name="name"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Site ID<span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.siteID}
                        type="text"
                        placeholder="Enter SiteID"
                        name="siteID"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Project Location
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.location}
                        type="text"
                        placeholder="Enter project location"
                        name="location"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label htmlFor="client">
                        Client<span className="text-danger">*</span>
                      </label>
                      <select
                        style={{ width: "100%", height: "30px" }}
                        className="mt-2"
                        name="client"
                        value={data.client}
                        onChange={e => handleFormData(e)}
                      >
                        <option value="">Select</option>
                        {clientList?.map((item, index) => {
                          return (
                            <option
                              key={index}
                              value={`${item.name}-${item?._id}`}
                            >
                              {item?.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label htmlFor="role">
                        Number of Floor
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        style={{ width: "100%", height: "30px" }}
                        className="mt-2"
                        name="floor"
                        value={data.floor}
                        onChange={e => handleFormData(e)}
                      >
                        <option value="">Select</option>
                        {floorList?.map((item, index) => (
                          <option key={index} value={index}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label htmlFor="role">
                        Select Floor Plan
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        style={{ width: "100%", height: "30px" }}
                        className="mt-2"
                        name="plan"
                        value={data.plan}
                        onChange={e => handleFormData(e)}
                      >
                        <option value="">Select</option>
                        {stages?.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Project Area<span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.area}
                        type="text"
                        placeholder="Enter project area"
                        name="area"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Project Cost<span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.cost}
                        type="number"
                        placeholder="Enter project cost"
                        name="cost"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-50 col-lg-6">
                      <label>
                        Start Date<span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.date}
                        type="date"
                        name="date"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label>
                        Duration(In months)
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        value={data.duration}
                        type="number"
                        name="duration"
                        min={1}
                        placeholder="Enter Construction duration"
                        onChange={e => handleFormData(e)}
                      />
                    </div>
                    {/* <div className="formInputContainer col-lg-6">
                      <label htmlFor="role">
                        Flow Structure<span className="text-danger">*</span>
                      </label>
                      
                    </div> */}
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Project Admin<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "project admin"
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="admin"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Project Manager
                        <span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "project manager"
                          )
                          .map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="manager"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Sr. Engineer<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "sr. engineer"
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="sr_engineer"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Site Engineer<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "site engineer"
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="engineer"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Accountant<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "accountant"
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="accountant"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Operation<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(
                            itm => itm.role?.toLowerCase() === "operation"
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="operation"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Sales<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {memberList
                          ?.filter(itm => itm.role?.toLowerCase() === "sales")
                          ?.map((item, index) => {
                            return (
                              <div
                                className="col-lg-3 form-group d-flex"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  name="sales"
                                  value={`${item.name},${item.employeeID}`}
                                  onChange={e => handleFormData(e)}
                                  className="m-1"
                                  style={{ width: "auto" }}
                                />
                                <span className="member">{item.name}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="formInputContainer w-100 col-lg-12">
                      <label htmlFor="role">
                        Contractor<span className="text-danger">*</span>
                      </label>
                      <div className="row">
                        {contractorList?.map((item, index) => {
                          return (
                            <div
                              className="col-lg-3 form-group d-flex"
                              key={index}
                            >
                              <input
                                type="checkbox"
                                name="contractor"
                                value={`${item.name},${item.id}`}
                                onChange={e => handleFormData(e)}
                                className="m-1"
                                style={{ width: "auto" }}
                              />
                              <span className="member">{item.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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

export default AddProjectForm;
