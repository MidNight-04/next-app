"use client";
import { useEffect, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, Select, MenuItem, styled } from "@mui/material";
import { toast } from "react-toastify";
import AsideContainer from "../../../components/AsideContainer";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    "backgroundColor": "#f8fbfc",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    "backgroundColor": "#eee9da",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
}));

const MemberTable = () => {
  const router = useRouter();
  const [memberList, setMemberList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationDelete, setConfirmationDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({
    name: "",
    employeeID: "",
    role: "",
    email: "",
    phone: "",
    address: "",
  });

  const columns = [
    { field: "seriel", headerName: "SNo.", width: 80 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "employeeID", headerName: "Employee ID", width: 100 },
    { field: "role", headerName: "Role", width: 200 },
    { field: "email", headerName: "Email", width: 280 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "address", headerName: "Address", width: 390 },
  ];
  useEffect(() => {
    getAllMember();
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/projectrole/getall`)
      .then(response => {
        if (response) {
          // console.log(response.data.data);
          setRoleList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const getAllMember = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`)
      .then(response => {
        setMemberList(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormData = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const deleteMember = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_PATH}/api/teammember/delete/${userId}`
      )
      .then(response => {
        if (response) {
          toast.warning("Record deleted successfully", {
            position: "top-right",
          });
          getAllMember();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateFunction = id => {
    setUserId(id);
    setConfirmationOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/teammember/databyid/${id}`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data)
          setData({
            name: response.data.data.name,
            employeeID: response.data.data.employeeID,
            role: response.data.data.role,
            name: response.data.data.email,
            phone: response.data.data.phone,
            address: response.data.data.address,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleConfirm = () => {
    // Perform action based on authorizationStatus
    const dataUpdate = {
      id: userId,
      name: data.name,
      employeeID: data.employeeID,
      role: data.role,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_PATH}/api/teammember/updatebyid`,
        dataUpdate
      )
      .then(response => {
        if (response) {
          getAllMember();
          toast.success(response.data.message, {
            position: "top-right",
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    // Close the confirmation dialog
    setConfirmationOpen(false);
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setConfirmationOpen(false);
  };
  const handleDelete = () => {
    setConfirmationDelete(prev => !prev);
  };

  const arrayData = [];
  memberList?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      seriel: index + 1,
      name: row?.name,
      employeeID: row?.employeeID,
      email: row?.email,
      role: row?.role.name,
      phone: row?.phone,
      address: row?.address,
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: params => {
        return (
          <div className="flex flex-row gap-2 items-center">
            <div
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => updateFunction(params?.row?.id)}
            >
              <FiEdit className="text-xl" />
            </div>
            <div
              className="p-2 rounded-full border border-primary text-primary bg-primary-foreground cursor-pointer"
              onClick={() => {
                setUserId(params.row.id);
                handleDelete();
              }}
            >
              <MdOutlineDelete className="text-xl" />
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <AsideContainer>
      <div className="datatable">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-[25px] font-ubuntu font-bold my-5 -md:text-lg -lg:my-2">
            Employee List
          </h1>
          <button
            className="bg-secondary text-primary rounded-3xl px-4 py-3 flex flex-row gap-1 items-center"
            onClick={() => router.push("/admin/employee/add")}
          >
            <Add />
            <span>Add Team Member</span>
          </button>
        </div>
        <StripedDataGrid
          rows={arrayData}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          localeText={{ noRowsLabel: "No Data Available..." }}
          getRowClassName={params =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          sx={{
            "fontFamily": "ubuntu",
            "fontSize": "16px",
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": { color: "#93bfcf" },
            "& .MuiDataGrid-menuOpen": { background: "#0b192c" },
            "&.MuiDataGrid-root": {
              borderRadius: "16px",
              marginBottom: "1rem",
              // color: "#93bfcf",
              background: "#0b192c",
            },
            "& .MuiDataGrid-filler": { background: "#0b192c" },
            "& .MuiDataGrid-columnHeader": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-columnHeader--sortable": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-withBorderColor": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-menuIcon": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: "#0b192c",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-sortIcon": {
              opacity: "inherit !important",
              color: "#93bfcf",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              background: "#0b192c",
              color: "#93bfcf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar":
              {
                display: "none",
              },
            "& .MuiToolbar-root ": {
              color: "#93bfcf",
            },
            "& .MuiButtonBase-root": {
              color: "#93bfcf",
            },
            "& .MuiDataGrid-overlay": {
              background: "#eee9da",
              color: "#0b192c",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />
        <Modal
          open={confirmationOpen}
          onClose={handleCancel}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white w-1/3 p-8 rounded-3xl outline-none">
            <div>
              <h3 className=" text-2xl font-semibold font-ubuntu">
                Update Employee Data
              </h3>
              <hr className="my-4" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="name">Name</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="role">Role</label>
                <Select
                  value={data.role}
                  name="role"
                  onChange={e => handleFormData(e)}
                  fullWidth
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
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {roleList?.map((item, index) => {
                    return (
                      <MenuItem value={item?.name} key={index}>
                        {item?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="email">Phone</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="phone"
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={e => handleFormData(e)}
                />
              </div>
              <div className="w-full flex flex-col gap-2 mb-2 [&_label]:font-semibold">
                <label htmlFor="address">Address</label>
                <input
                  className="h-12 border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                  id="address"
                  type="text"
                  name="address"
                  value={data.address}
                  onChange={e => handleFormData(e)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 justify-end mt-4">
              <button
                className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={handleConfirm}
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          open={confirmationDelete}
          onClose={handleDelete}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white w-1/3 p-8 rounded-3xl outline-none -md:w-3/4">
            <div>
              <h3 className=" text-2xl font-semibold font-ubuntu">
                Delete Employee
              </h3>
              <hr className="my-4" />
            </div>
            <h5>Are your sure you want to delete ?</h5>
            <div className="flex flex-row gap-2 justify-end mt-4">
              <button
                className="bg-primary-foreground border border-secondary text-secondary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={handleDelete}
              >
                Cancel
              </button>
              <button
                className="bg-secondary text-primary rounded-3xl px-4 py-2 flex flex-row  items-center"
                onClick={deleteMember}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AsideContainer>
  );
};

export default MemberTable;
