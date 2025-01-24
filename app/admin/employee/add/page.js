"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";
import { toast } from "react-toastify";

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
      toast.error("Name is required", {
        position: "top-right",
      });
    } else if (!data.employeeID) {
      toast.error("Employee ID is required", {
        position: "top-right",
      });
    } else if (!data.role) {
      toast.error("Role is required", {
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
            toast.success(response.data.message, {
              position: "top-right",
            });
            redirect("/admin/teammembers");
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
            <div className="topContainer">
              <h1>Add Member</h1>
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
                      placeholder="Enter Name"
                      name="name"
                      onChange={e => handleFormData(e)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Employee ID<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.employeeID}
                      type="text"
                      placeholder="Enter Employee ID"
                      name="employeeID"
                      onChange={e => handleFormData(e)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label htmlFor="role">
                      Role<span className="text-danger">*</span>
                    </label>
                    <select
                      style={{ width: "100%", height: "30px" }}
                      className="mt-2"
                      name="role"
                      value={data.role}
                      onChange={e => handleFormData(e)}
                    >
                      <option value="">Select Role</option>
                      {roleList?.map((item, index) => {
                        return (
                          <option key={index} value={item?.name}>
                            {item?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Email<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.email}
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      onChange={e => handleFormData(e)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Phone<span className="text-danger">*</span>
                    </label>
                    <input
                      value={data.phone}
                      type="number"
                      placeholder="Enter Phone"
                      name="phone"
                      onChange={e => handleFormData(e)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label>Address</label>
                    <input
                      value={data.address}
                      type="text"
                      placeholder="Enter Address"
                      name="address"
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

export default AddMemberForm;
