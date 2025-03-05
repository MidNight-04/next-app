"use client";
import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { Box, Chip, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import AsideContainer from "../../../components/AsideContainer";

const style = {
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserOrders = () => {
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [address, setAddress] = useState(null);
  // const activeUser = localStorage.getItem("activeUser");
  const activeUser = "ROLE_CLIENT";
  const [open, setOpen] = React.useState(false);
  const userRole = "admin";
  const type = "admin";

  // const { userRole } = useSelector(store => store.userReducer);
  const handleClose = () => setOpen(false);
  const handleOpen = addressId => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/get-address`, {
        id: addressId,
      })
      .then(resp => {
        setAddress(resp?.data?.data);
        setOpen(true);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err);
      });
  };

  // MY-DESIGN api Call here
  useEffect(() => {
    if (type === "architect" || type === "dealer") {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/order-details`, {
          architectId: activeUser,
        })
        .then(resp => {
          // console.log(resp?.data?.data)
          setRows(resp?.data?.data);
        })
        .catch(err => {
          console.error("Error:", err);
          setError(err);
        });
    } else if (type === "order-list" || type === "admin") {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/order-details`)
        .then(resp => {
          // console.log(resp?.data?.data)
          setRows(resp?.data?.data);
        })
        .catch(err => {
          console.error("Error:", err);
          setError(err);
        });
    } else if (type == "user") {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/order-details`, {
          userId: activeUser,
        })
        .then(resp => {
          // console.log(resp?.data?.data)
          setRows(resp?.data?.data);
        })
        .catch(err => {
          console.error("Error:", err);
          setError(err);
        });
    }
  }, [type]);

  const columns = [
    { field: "id", headerName: "ID", width: 130 },
    { field: "product_name", headerName: "Product Name", width: 130 },
    { field: "vendor_name", headerName: "Vendor Name", width: 130 },
    { field: "order_id", headerName: "Order ID", width: 130 },
    { field: "order_type", headerName: "Order Type", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "payment_mode", headerName: "Payment Mode", width: 130 },
    { field: "payment_status", headerName: "Payment Status", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: params => {
        return (
          <div className="cellWithImg">
            <span className="fw-bold">{params.row.status}</span>
          </div>
        );
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 130,
      renderCell: params => {
        return (
          <div className="cellWithImg">
            {params?.row?.address_id && (
              <InfoIcon onClick={() => handleOpen(params?.row?.address_id)} />
            )}
          </div>
        );
      },
    },
    { field: "otp", headerName: "OTP", width: 130 },
  ];

  const arrayData = [];
  rows.map(row => {
    arrayData.push({
      id: row?._id,
      product_name: row?.productDetail?.title || row?.productDetail?.name,
      vendor_name: row?.productDetail?.uploadingUserName,
      order_id: row?.paymentInformation?.body?.orderId,
      order_type: row?.paymentType,
      enquiry_type: row?.contactType,
      amount: row?.paymentInformation?.body?.txnAmount,
      payment_mode: row?.paymentInformation?.body?.paymentMode,
      payment_status:
        row?.paymentInformation?.body?.resultInfo?.resultMsg ??
        row?.CodPaymentStatus,
      status: row?.approvalStatus,
      product_detail: row?.productDetail?._id,
      uploading_user: row?.productDetail?.uploadingUser,
      user_id: row?.userId,
      address_id: row?.addressId,
      otp: row?.otp,
      contact_type: row?.contactType,
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: params => {
        return (
          <div className="cellAction">
            {params?.row?.contact_type == "Material Purchase" ? (
              <Link
                href={`/${userRole.substring(5).toLowerCase()}/view-product/${
                  params?.row?.product_detail
                }/${params?.row?.status}/${params?.row?.id}`}
                className="adminLink"
              >
                <Chip label="Product" color="info" size="small" />
              </Link>
            ) : (
              <Link
                href={`/${userRole.substring(5).toLowerCase()}/view-design/${
                  params?.row?.product_detail
                }/${params?.row?.status}/${params?.row?.id}`}
                className="adminLink"
              >
                <Chip label="Product" color="info" size="small" />
              </Link>
            )}
            <Link
              href={`/${userRole
                .substring(5)
                .toLowerCase()}/view-payment-details/${params?.row?.id}`}
              className="adminLink"
            >
              <Chip label="Payment" color="secondary" size="small" />
            </Link>
            {params?.row?.approvalStatus == "Pending" && type == "user" ? (
              ""
            ) : type == "user" ? (
              <Link
                href={`/${userRole
                  .substring(5)
                  .toLowerCase()}/supplier-details/${
                  params?.row?.uploading_user
                }`}
                className="adminLink"
              >
                <Chip label="Supplier" color="warning" size="small" />
              </Link>
            ) : (
              <Link
                href={`/${userRole.substring(5).toLowerCase()}/user-details/${
                  params?.row?.user_id
                }/${params?.row?.id}`}
                className="adminLink"
              >
                <Chip label="User" color="warning" size="small" />
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <AsideContainer>
      <h1 className="font-ubuntu font-bold text-[25px] leading-7 my-4">
        Project List
      </h1>

      {/* <TableContainer component={Paper}>
          </TableContainer> */}
      {/* <div className="max-w-[calc(100vw-343px)]"> */}
      <div>
        <DataGrid
          rows={arrayData}
          columns={columns.concat(actionColumn)}
          pageSize={7}
          rowsPerPageOptions={[9]}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Address Information</h2>
          <br />
          <Typography>Address: {address?.address}</Typography>
          <Typography>City: {address?.city}</Typography>
          <Typography>State: {address?.state}</Typography>
          <Typography>Country: {address?.country}</Typography>
          <Typography>Near By: {address?.nearBy}</Typography>
          <Typography>Zip Code: {address?.zipCode}</Typography>
        </Box>
      </Modal>
    </AsideContainer>
  );
};

export default UserOrders;
