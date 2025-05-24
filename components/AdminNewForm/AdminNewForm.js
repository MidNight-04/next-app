'use client'
import React, { useState, useEffect } from "react";
// import "../../public/assets/scss/adminNewForms.scss";
import axios from "axios";
import FormData from "form-data";
import { toast } from "sonner";
// import { userouter.push, useParams, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import { useQueries } from "@tanstack/react-query";
// import {
//   authEndpoint,
//   dealerEndpoint,
//   getCategoryList,
//   userEndpoint,
// } from "../../helpers/endpoints";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const labels = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};
function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const AdminNewForm = ({
  inputs,
  title,
  getUrl,
  postUrl,
  updateUrl,
  userRole,
  isEdit,
  isView,
  type,
  status,
  approvalUrl,
  Pid,
  orderId,
}) => {
  const [selectedImage, setSelectedImage] = useState(false);
  const [formData, setFormData] = useState({});
  const [suitableLocation, setCity] = React.useState("");
  const [suitableCountry, setCountry] = React.useState("India");
  const [suitableState, setState] = React.useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMesaage] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unit, setUnit] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextstatus, setNextStatus] = useState([]);
  const [allBrands, setAllBrands] = useState(null);
  const [numberRequest, setNumberRequest] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [openInvoice, setOpenInvoice] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState(false);
  const [disableText, setDisableText] = useState(false);
  // State for uploading invoice, cad, twoDI, threeDI, upload product, coalicense, other license, pan, aadhar, bank statement
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const [cadFiles, setCadFiles] = useState([]);
  const [twoDIFiles, setTwoDIFiles] = useState([]);
  const [threeDIFiles, setThreeDIFiles] = useState([]);
  const [productsFiles, setProductFiles] = useState([]);
  const [profileFiles, setProfileFiles] = useState([]);
  const [gstFiles, setGstFiles] = useState([]);
  const [coaLicenseFiles, setCoaLicenseFiles] = useState([]);
  const [otherLicenseFiles, setOtherLicenseFiles] = useState([]);
  const [panFiles, setPanFiles] = useState([]);
  const [aadharFiles, setAadharFiles] = useState([]);
  const [bankStatementFiles, setBankStatementFiles] = useState([]);
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingCommentTitle, setRatingCommentTitle] = useState("");
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [productId, setProductId] = useState("");
  const [hover, setHover] = useState(-1);
  const handleReviewClose = () => setReviewOpen(false);
  const handleOpen = () => setOpen(true);
  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleOpenOrder = () => setOpenOrder(true);
  const handleClose = () => setOpen(false);
  const handleCloseImage = () => setOpenImage(false);
  const handleCloseInvoice = () => setOpenInvoice(false);
  const handleCloseOder = () => setOpenOrder(false);
  const router = useRouter();
  let role = userRole ? userRole : localStorage.getItem("role");
  let userName = localStorage.getItem("userName");
  const handleOpenImage = image => {
    setImage(image);
    setOpenImage(true);
  };

  let data = new FormData();
  let id = localStorage.getItem("activeUser");

  const handleReviewOpen = formData => {
    setProductId(formData._id);
    if (localStorage.getItem("activeUser")) {
      setReviewOpen(true);
    } else {
    //   localStorage.setItem("last_url", location.pathname);
      router.push("/login");
    }
  };
  const addNewRating = () => {
    if (!ratingComment || !ratingValue) {
      toast("Description/Rating cannot be empty");
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_PATH}/api/user/single-profile/${id}`)
        .then(resp => {
          // console.log(resp)
          const data = {
            productid: productId,
            title: ratingCommentTitle,
            rating: ratingValue,
            comments: ratingComment,
            userId: id,
            date: new Date(),
            username: resp?.data?.data?.username,
          };
          axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}/api/user/post-product-rating`,
              data
            )
            .then(resp => {
              if (resp.data.data) {
                toast("Your review has been successfully posted");
              }
              handleReviewClose();
            })
            .catch(err => {
              console.error(err);
              toast.error("Some error occured,while get user data");
            });
        })
        .catch(err => {
          console.error(err);
          toast.error("Some error occured");
        });
    }
  };

  console.log(type === "dealer" ? true : false);

  // UseEffect for country, state and city
  useEffect(() => {
    if (suitableCountry) {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/auth/getStates`, {
          country_name: suitableCountry,
        })
        .then(resp => {
          // console.log("Show all designs for users", resp)
          setStates(resp.data.states);
        })
        .catch(err => {
          console.error(err);
        });
    }

    if (suitableState) {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/auth/getCities`, {
          state_name: suitableState,
        })
        .then(resp => {
          // console.log("Show all designs for users", resp)
          setCities(resp.data.cities);
        })
        .catch(err => {
          console.error(err);
        });
    }
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/admin/category/list`)
      .then(resp => {
        // console.log(resp.data.data)
        setCategories(resp.data.data);
        setProducts([]);
      })
      .catch(err => {
        console.error("Error:", err);
      });
  }, [suitableCountry, suitableState]);

  useEffect(() => {
    setSelectedImage(false);
    setProductFiles([]);
    if (type === "dealer") {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/dealer/products/all`, {
          approvalStatus: "Approved",
        })
        .then(resp => {
          // console.log("Show all designs for users", resp)
          setAllBrands(resp.data.data);
        })
        .catch(err => {
          console.error(err);
        });
    }

    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/get-next-status`, {
        type: "order",
      })
      .then(resp => {
        setNextStatus(resp?.data?.data);
      })
      .catch(err => {
        console.error(err);
      });

    if (orderId) {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/order-details`, {
          _id: orderId,
        })
        .then(resp => {
          setNumberRequest(resp?.data?.data[0]);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    console.log(Pid, status);
    if (Pid && status === "approval") {
      axios
        .post(getUrl, { id: Pid })
        .then(response => {
          const responseData = response?.data?.data;
          // console.log("response1", response);
          if (responseData.length > 0) {
            setFormData(responseData[0]);

            if (
              responseData[0]?.serviceLocationState ||
              responseData[0]?.state ||
              responseData[0]?.suitableLocationState
            ) {
              setState(
                responseData[0]?.serviceLocationState ||
                  responseData[0]?.state ||
                  responseData[0]?.suitableLocationState
              );
            }

            if (
              responseData[0]?.serviceLocationCity ||
              responseData[0]?.city ||
              responseData[0]?.suitableLocationCity
            ) {
              setCity(
                responseData[0]?.serviceLocationCity ||
                  responseData[0]?.city ||
                  responseData[0]?.suitableLocationCity
              );
            }

            if (responseData[0]?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData[0]?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          } else {
            setFormData(responseData);

            if (
              responseData?.serviceLocationState ||
              responseData?.state ||
              responseData?.suitableLocationState
            ) {
              setState(
                responseData?.serviceLocationState ||
                  responseData?.state ||
                  responseData?.suitableLocationState
              );
            }

            if (
              responseData?.serviceLocationCity ||
              responseData?.city ||
              responseData?.suitableLocationCity
            ) {
              setCity(
                responseData?.serviceLocationCity ||
                  responseData?.city ||
                  responseData?.suitableLocationCity
              );
            }

            if (responseData?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          }
        })
        .catch(error => console.log(error));
    } else if (Pid) {
      axios
        .post(getUrl, { id: Pid })
        .then(response => {
          // console.log("response2", response);
          const responseData = response?.data?.data;
          if (responseData.length > 0) {
            setFormData(responseData[0]);

            if (
              responseData[0]?.serviceLocationState ||
              responseData[0]?.state ||
              responseData[0]?.suitableLocationState
            ) {
              setState(
                responseData[0]?.serviceLocationState ||
                  responseData[0]?.state ||
                  responseData[0]?.suitableLocationState
              );
            }

            if (
              responseData[0]?.serviceLocationCity ||
              responseData[0]?.city ||
              responseData[0]?.suitableLocationCity
            ) {
              setCity(
                responseData[0]?.serviceLocationCity ||
                  responseData[0]?.city ||
                  responseData[0]?.suitableLocationCity
              );
            }

            if (responseData[0]?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData[0]?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          } else {
            setFormData(responseData);

            if (
              responseData?.serviceLocationState ||
              responseData?.state ||
              responseData?.suitableLocationState
            ) {
              setState(
                responseData?.serviceLocationState ||
                  responseData?.state ||
                  responseData?.suitableLocationState
              );
            }

            if (
              responseData?.serviceLocationCity ||
              responseData?.city ||
              responseData?.suitableLocationCity
            ) {
              setCity(
                responseData?.serviceLocationCity ||
                  responseData?.city ||
                  responseData?.suitableLocationCity
              );
            }

            if (responseData?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          }
        })
        .catch(error => console.log(error));
    } else {
      axios
        .post(getUrl, { id })
        .then(response => {
          // console.log("response3", response);
          const responseData = response?.data?.data;
          if (responseData.length > 0) {
            setFormData(responseData[0]);

            if (
              responseData[0]?.serviceLocationState ||
              responseData[0]?.state ||
              responseData[0]?.suitableLocationState
            ) {
              setState(
                responseData[0]?.serviceLocationState ||
                  responseData[0]?.state ||
                  responseData[0]?.suitableLocationState
              );
            }

            if (
              responseData[0]?.serviceLocationCity ||
              responseData[0]?.city ||
              responseData[0]?.suitableLocationCity
            ) {
              setCity(
                responseData[0]?.serviceLocationCity ||
                  responseData[0]?.city ||
                  responseData[0]?.suitableLocationCity
              );
            }

            if (responseData[0]?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData[0]?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          } else {
            setFormData(responseData);

            if (
              response?.data?.data?.serviceLocationState ||
              response?.data?.data?.state ||
              response?.data?.data?.suitableLocationState
            ) {
              setState(
                response?.data?.data?.serviceLocationState ||
                  response?.data?.data?.state ||
                  response?.data?.data?.suitableLocationState
              );
            }

            if (
              response?.data?.data?.serviceLocationCity ||
              response?.data?.data?.city ||
              response?.data?.data?.suitableLocationCity
            ) {
              setCity(
                response?.data?.data?.serviceLocationCity ||
                  response?.data?.data?.city ||
                  response?.data?.data?.suitableLocationCity
              );
            }

            if (responseData?.approvalStatus === "Pending") {
              setAlert(true);
              setAlertMesaage(
                "Please enter details correctly and wait for admin to accept. Current State: Pending"
              );
            } else if (responseData?.approvalStatus === "Rejected") {
              setAlert(true);
              setAlertMesaage("Admin has rejected this deatils. Please retry");
            }
          }
        })
        .catch(error => console.log(error));
    }
  }, [Pid, getUrl]);

  const handleFormData = e => {
    const { name, value } = e.target;
    if (
      e.target.name === "suitableLocationState" ||
      e.target.name === "serviceLocationState" ||
      e.target.name === "state"
    ) {
      setState(e.target.value);
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/auth/getCities`, {
          state_name: e.target.value,
        })
        .then(resp => {
          // console.log("Show all designs for users", resp)
          setCities(resp.data.cities);
        })
        .catch(err => {
          console.error(err);
        });
    }
    if (e.target.files && e.target.files[0]) {
      if (name === "productImage") {
        handleFileEvent(e, "productImage");
      }
      if (name === "profileImage") {
        handleFileEvent(e, "profileImage");
      }
      if (name === "twoDImage") {
        handleFileEvent(e, "twoDImage");
      }
      if (name === "threeDImage") {
        handleFileEvent(e, "threeDImage");
      }
      if (name === "cadImage") {
        handleFileEvent(e, "cadImage");
      }
      if (name === "gstImage") {
        handleFileEvent(e, "gstImage");
      }
      if (name === "panImage") {
        handleFileEvent(e, "panImage");
      }
      if (name === "bankDetailsImage") {
        handleFileEvent(e, "bankDetailsImage");
      }
      if (name === "coaLicenseImage") {
        handleFileEvent(e, "coaLicenseImage");
      }
      if (name === "otherLicenseImage") {
        handleFileEvent(e, "otherLicenseImage");
      }
      if (name === "aadharImage") {
        handleFileEvent(e, "aadharImage");
      }
      if (name === "categoryImage") {
        handleFileEvent(e, "categoryImage");
      }
    }
    if (name === "category") {
      setFormData({ ...formData, [name]: value });
      axios
        .get(
          `${process.env.REACT_APP_BASE_PATH}/api/admin/category/list/categoryName?name=${value}`,
          {}
        )
        .then(resp => {
          // console.log(resp);
          setUnit(resp?.data?.data);
        })
        .catch(err => {
          console.error(err);
        });
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/dealer/products/category-name`,
          {
            categoryName: e.target.value,
          }
        )
        .then(resp => {
          // console.log("Show all products for category", resp)
          setProducts(resp?.data?.data);
        })
        .catch(err => {
          console.error(err);
        });
    } else if (name === "existname") {
      if (value) {
        axios
          .post(
            `${process.env.REACT_APP_BASE_PATH}/api/dealer/products/product-name`,
            {
              productName: e.target.value,
            }
          )
          .then(async resp => {
            // console.log("Show product by product name-", resp?.data?.data);
            if (resp?.data?.data?.length > 0) {
              const productImage = resp?.data?.data[0].productImage[0]; // Assuming there's only one image
              const imageName = productImage.split("_")[2];
              axios
                .get(
                  `${process.env.REACT_APP_BASE_PATH}/api/dealer/products/proxy-image?url=${productImage}`,
                  {
                    responseType: "blob",
                  }
                )
                .then(response => {
                  // Create a File object from the Blob
                  const blob = response.data;
                  const file = new File([blob], `${imageName}`, {
                    type: [`image/${imageName?.split(".")[1]}`],
                  });

                  setFormData({
                    ...formData,
                    ["descriptionOne"]: resp?.data?.data[0].descriptionOne,
                    ["descriptionTwo"]: resp?.data?.data[0].descriptionTwo,
                    ["descriptionThree"]: resp?.data?.data[0].descriptionThree,
                    ["name"]: resp?.data?.data[0].name,
                    ["unit"]: resp?.data?.data[0].unit,
                    [name]: value,
                  });
                  // console.log(file);
                  handleUploadInvoice([file], "productImage");
                  // setProductFiles([file]);
                  setSelectedImage(true);
                })
                .catch(error => {
                  console.error("Error fetching image:", error);
                });
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        setProductFiles([]);
        setSelectedImage(false);
        setFormData({ ...formData, [name]: value, ["name"]: "" });
      }
    } else if (name === "name") {
      setProductFiles([]);
      setSelectedImage(false);
      setFormData({
        ...formData,
        [name]: value,
        ["descriptionOne"]: "",
        ["descriptionTwo"]: "",
        ["descriptionThree"]: "",
        ["existname"]: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const editForm = type => {
    let userId = localStorage.getItem("activeUser");
    if (type === "admin") {
      router.push(
        `/${role.substring(5).toLowerCase()}/edit-category/${Pid}`
      );
    }
    if (type === "design") {
      router.push(`/${role.substring(5).toLowerCase()}/edit-design/${Pid}`);
    }
    if (type === "dealer") {
      router.push(`/${role.substring(5).toLowerCase()}/edit-product/${Pid}`);
    }
    if (type === "architect_profile") {
      router.push(`/${role.substring(5).toLowerCase()}/edit-profile/${userId}`);
    }
    if (type === "edit_application") {
      router.push(
        `/${role.substring(5).toLowerCase()}/edit-application/${userId}`
      );
    }
  };

  const handleContentChange = e => {
    setContent(e.target.value);
  };

  const submitFormData = () => {
    // Modfying data according to api
    if (
      !formData?.productCommission &&
      role === "ROLE_DEALER" &&
      type === "dealer"
    ) {
      toast("Product commission is required");
    } else {
      const user = localStorage.getItem("role");
      let dataObj = { ...formData };
      if (Pid) {
        dataObj.id = Pid;
      } else {
        dataObj.id = id;
      }

      if (user === "ROLE_ADMIN") {
        dataObj.uploadingUser = formData.uploadingUser
          ? formData.uploadingUser
          : id;
        dataObj.uploadingUserName = formData.uploadingUserName
          ? formData.uploadingUserName
          : userName;
        dataObj.approvalStatus = "Approved";
        dataObj.active = true;
      } else {
        dataObj.uploadingUser = id ?? formData.uploadingUser;
        dataObj.uploadingUserName = userName ?? formData.uploadingUserName;
        dataObj.approvalStatus = "Pending";
        dataObj.active = "";
      }
      dataObj.likeUser = [];
      dataObj.wishUser = [];
      dataObj.role = role;
      for (let key in dataObj) {
        data.append(`${key}`, dataObj[key]);
      }

      for (let i = 0; i < cadFiles.length; i++) {
        data.append("cadImage", cadFiles[i]);
      }
      for (let i = 0; i < twoDIFiles.length; i++) {
        data.append("twoDImage", twoDIFiles[i]);
      }
      for (let i = 0; i < threeDIFiles.length; i++) {
        data.append("threeDImage", threeDIFiles[i]);
      }
      for (let i = 0; i < productsFiles.length; i++) {
        data.append("productImage", productsFiles[i]);
      }
      for (let i = 0; i < profileFiles.length; i++) {
        data.append("profileImage", profileFiles[i]);
      }
      for (let i = 0; i < gstFiles.length; i++) {
        data.append("gstImage", gstFiles[i]);
      }
      for (let i = 0; i < panFiles.length; i++) {
        data.append("panImage", panFiles[i]);
      }
      for (let i = 0; i < bankStatementFiles.length; i++) {
        data.append("bankDetailsImage", bankStatementFiles[i]);
      }
      for (let i = 0; i < coaLicenseFiles.length; i++) {
        data.append("coaLicenseImage", coaLicenseFiles[i]);
      }
      for (let i = 0; i < otherLicenseFiles.length; i++) {
        data.append("otherLicenseImage", otherLicenseFiles[i]);
      }
      for (let i = 0; i < aadharFiles.length; i++) {
        data.append("aadharImage", aadharFiles[i]);
      }
      for (let i = 0; i < categoryFiles.length; i++) {
        data.append("categoryImage", categoryFiles[i]);
      }

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: !isEdit ? postUrl : updateUrl,
        headers: { "Content-Type": "multipart/form-data" },
        data: data,
      };
      // console.log((config))
      axios
        .request(config)
        .then(response => {
          console.log(response);
          notify("success", response);
          setFormData({});
          setProductFiles([]);
          if (type === "admin") {
            router.push(`/admin`);
          } else {
            if (localStorage.getItem("last_url")) {
              router.push(`${localStorage.getItem("last_url")}`);
            } else {
              router.push(`/${role.substring(5).toLowerCase()}/profile`);
            }
          }
        })
        .catch(function (error) {
          console.log("Error-", error);
          if (error.message === "Request failed with status code 400") {
            toast.error(error?.response?.data?.error);
          } else if (error.message === "Request failed with status code 500") {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong");
          }
          setFormData({});
        });
    }
  };

  const handleBrandChange = e => {
    if (e.target.value == "") {
      setFormData({});
      setDisableText(false);
    } else {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/dealer/product-detail`, {
          id: e.target.value,
        })
        .then(resp => {
          // console.log("Show all designs for users", resp)
          const responseData = resp.data.data;
          setFormData(responseData[0]);
          if (responseData[0]?.serviceLocationState || responseData[0]?.state) {
            setState(
              responseData[0]?.serviceLocationState || responseData[0]?.state
            );
          }

          if (responseData[0]?.serviceLocationCity || responseData[0]?.city) {
            setCity(
              responseData[0]?.serviceLocationCity || responseData[0]?.city
            );
          }
          setDisableText(true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleApprovalStatus = (id, approval) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: approvalUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        _id: id,
        approvalStatus: approval,
        comment: approval == "Approved" ? "" : content,
      },
    };
    // console.log(config);
    axios
      .request(config)
      .then(response => {
        // console.log(response)
        toast(response.data.message);
        handleClose();
        window.location.reload();
      })
      .catch(function (error) {
        notify("error", error);
        console.log(error);
      });
  };

  const notify = (type, message) => {
    console.log(type, message);
    if (type === "success" && message.status === 200) {
      toast(message.data.message);
    } else {
      toast(message.response.data.message);
    }
  };

  const handleStatusChange = label => {
    if (label == "Rejected") {
      handleOpenOrder();
    } else {
      let data = new FormData();

      data.append("id", orderId);
      data.append("approvalStatus", label);
      data.append("comment", "");

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_PATH}/api/user/update-order-status`,
        headers: { "Content-Type": "multipart/form-data" },
        data: data,
      };

      axios
        .request(config)
        .then(async resp => {
          if (resp?.data.data) {
            if (label === "Dispatched") {
              await axios.post(
                `${process.env.REACT_APP_BASE_PATH}/api/user/send-delivery-otp`,
                {
                  id: orderId,
                }
              );
            }
            router.back()
          } else {
            window.location.reload();
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const resendDeliveryOtp = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/send-delivery-otp`, {
        id: orderId,
      })
      .then(response => {
        notify("success", response);
        router.back();
      })
      .catch(function (error) {
        notify("error", error);
        console.log(error);
      });
  };

  const handleRejectStatus = () => {
    let data = new FormData();
    data.append("id", orderId);
    data.append("approvalStatus", "Rejected");
    data.append("comment", content);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_PATH}/api/user/update-order-status`,
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    };

    axios
      .request(config)
      .then(resp => {
        if (resp?.data.data) {
          router.back();
        } else {
          window.location.reload();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleInvoiceStatusChange = () => {
    let data = new FormData();
    for (let i = 0; i < invoiceFiles.length; i++) {
      data.append("invoicefiles", invoiceFiles[i]);
    }

    data.append("id", orderId);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_PATH}/api/user/update-order-status`,
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    };

    axios
      .request(config)
      .then(resp => {
        if (resp?.data.data) {
          window.location.reload();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleUploadInvoice = (files, type) => {
    if (type == "productImage") {
      const uploaded = [];
      console.log(productsFiles);
      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setProductFiles(uploaded);
    }
    if (type == "profileImage") {
      const uploaded = [...profileFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setProfileFiles(uploaded);
    }
    if (type == "twoDImage") {
      const uploaded = [...twoDIFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setTwoDIFiles(uploaded);
    }
    if (type == "threeDImage") {
      const uploaded = [...threeDIFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setThreeDIFiles(uploaded);
    }
    if (type == "cadImage") {
      const uploaded = [...cadFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setCadFiles(uploaded);
    }
    if (type == "gstImage") {
      const uploaded = [...gstFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setGstFiles(uploaded);
    }
    if (type == "panImage") {
      const uploaded = [...panFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setPanFiles(uploaded);
    }
    if (type == "bankDetailsImage") {
      const uploaded = [...bankStatementFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setBankStatementFiles(uploaded);
    }
    if (type == "coaLicenseImage") {
      const uploaded = [...coaLicenseFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setCoaLicenseFiles(uploaded);
    }
    if (type == "otherLicenseImage") {
      const uploaded = [...otherLicenseFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setOtherLicenseFiles(uploaded);
    }
    if (type == "aadharImage") {
      const uploaded = [...aadharFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setAadharFiles(uploaded);
    }
    if (type == "categoryImage") {
      const uploaded = [...categoryFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setCategoryFiles(uploaded);
    }
    if (type == "invoice") {
      const uploaded = [...invoiceFiles];

      files.some(file => {
        if (uploaded.findIndex(f => f.name === file.name) === -1) {
          uploaded.push(file);
        }
      });
      setInvoiceFiles(uploaded);
    }
  };

  const handleFileEvent = (e, type) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadInvoice(chosenFiles, type);
  };

  const handlePaymentSuccess = paymentStatus => {
    let data = new FormData();
    data.append("id", orderId);
    data.append("CodPaymentStatus", paymentStatus);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_PATH}/api/user/update-order-status`,
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    };

    axios
      .request(config)
      .then(resp => {
        if (resp?.data.data) {
          router.back();
        } else {
          window.location.reload();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div className="single">
      {/* <AdminSidebar /> */}
      <div className="singleContainer">
        {/* <AdminNavbar /> */}
        <div className="adminNewUser">
          <div className="newContainer">
            <div className="topContainer">
              <h1>{title}</h1>
            </div>
            {alert && alertMessage && (
              <div className="topContainer">
                <Alert severity="info">{alertMessage}</Alert>
              </div>
            )}
            <div className="bottomContainer">
              <div className="bottomRightContainer">
                {type === "orders" &&
                  role?.substring(5).toLowerCase() === "user" && (
                    <div className="col-lg-12">
                      <Typography className="rating float-end">
                        <span
                          onClick={() => handleReviewOpen(formData)}
                          className="review-button mt-2 text-dark bg-warning rounded-1"
                        >
                          Rate & Review Product
                        </span>
                      </Typography>
                    </div>
                  )}
                <div className="form">
                  {inputs.map((input, index) =>
                    input.type === "select" && input.placeholder === "State" ? (
                      <>
                        <div className="formInputContainer" key={index}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select State</option>
                            {input.option !== null && input.option !== undefined
                              ? input.option.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options}
                                  >
                                    {options}
                                  </option>
                                ))
                              : states.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options.name}
                                  >
                                    {options.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "City" ? (
                      <>
                        <div className="formInputContainer" key={index}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select City</option>
                            {input.option !== null && input.option !== undefined
                              ? input.option.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options}
                                  >
                                    {options}
                                  </option>
                                ))
                              : cities.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options.name}
                                  >
                                    {options.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "Category" ? (
                      <>
                        <div className="formInputContainer" key={index}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select Category</option>
                            {input.option !== null && input.option !== undefined
                              ? input.option.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options}
                                  >
                                    {options}
                                  </option>
                                ))
                              : categories.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options.name}
                                  >
                                    {options.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "Product" ? (
                      <>
                        <div className="formInputContainer" key={index}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Add Product</option>
                            {input.option !== null && input.option !== undefined
                              ? input.option.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options}
                                  >
                                    {options}
                                  </option>
                                ))
                              : products.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options.name}
                                  >
                                    {options.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "Product Unit" ? (
                      <>
                        <div className="formInputContainer" key={index}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select Unit</option>
                            {unit?.map((options, index) => (
                              <option
                                key={index}
                                name={input?.name}
                                value={options.unit}
                              >
                                {options.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "Country" ? (
                      <>
                        <div className="formInputContainer" key={input?.id}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select Country</option>
                            <option value={suitableCountry} name={input?.name}>
                              {suitableCountry}
                            </option>
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" &&
                      input.placeholder === "Country" ? (
                      <>
                        <div className="formInputContainer" key={input?.id}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select Country</option>
                            <option value={suitableCountry} name={input?.name}>
                              {suitableCountry}
                            </option>
                          </select>
                        </div>
                      </>
                    ) : input.type === "select" ? (
                      <>
                        <div className="formInputContainer" key={input?.id}>
                          <label htmlFor={input?.name}>{input?.label}</label>
                          <select
                            style={{ width: "100%", height: "25px" }}
                            disabled={isView}
                            name={input?.name}
                            value={
                              formData && formData[input?.name]
                                ? formData[input?.name]
                                : ""
                            }
                            onChange={e => handleFormData(e)}
                          >
                            <option value="">Select</option>
                            {input.option !== null &&
                              input.option !== undefined &&
                              input.option.map((options, index) => (
                                <option key={index} value={options}>
                                  {options}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    ) : input.type === "file" ? (
                      <>
                        <div className="formInputContainer" key={input?.id}>
                          <label>{input?.label}</label>
                          {isView && formData && formData[input?.name] ? (
                            <>
                              <br />
                              {formData[input?.name]?.map(image =>
                                image.includes(".jpg") ||
                                image.includes(".jpeg") ||
                                image.includes(".png") ||
                                image.includes(".in") ? (
                                  <img
                                    class="img-fluid side-img m-2"
                                    src={
                                      String(image).includes("files") &&
                                      !String(image).includes("bucket.s3")
                                        ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                        : image
                                    }
                                    alt="Produts"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleOpenImage(
                                        String(image).includes("files") &&
                                          !String(image).includes("bucket.s3")
                                          ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                          : image
                                      )
                                    }
                                  />
                                ) : (
                                  <a
                                    href={
                                      String(image).includes("")
                                        ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                        : image
                                    }
                                  >
                                    <DownloadIcon />
                                    {} Download
                                  </a>
                                )
                              )}
                            </>
                          ) : (
                            !selectedImage && (
                              <input
                                // value={formData[input?.name]}
                                disabled={isView}
                                type={input?.type}
                                placeholder={input?.placeholder}
                                name={input?.name}
                                multiple
                                accept="application/pdf, image/png"
                                onChange={e => handleFormData(e)}
                              />
                            )
                          )}
                          {input?.name == "productImage" &&
                            productsFiles.length > 0 &&
                            productsFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "profileImage" &&
                            profileFiles.length > 0 &&
                            profileFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "twoDImage" &&
                            twoDIFiles.length > 0 &&
                            twoDIFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "threeDImage" &&
                            threeDIFiles.length > 0 &&
                            threeDIFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "cadImage" &&
                            cadFiles.length > 0 &&
                            cadFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "gstImage" &&
                            gstFiles.length > 0 &&
                            gstFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "panImage" &&
                            panFiles.length > 0 &&
                            panFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "bankDetailsImage" &&
                            bankStatementFiles.length > 0 &&
                            bankStatementFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "coaLicenseImage" &&
                            coaLicenseFiles.length > 0 &&
                            coaLicenseFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "otherLicenseImage" &&
                            otherLicenseFiles.length > 0 &&
                            otherLicenseFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "aadharImage" &&
                            aadharFiles.length > 0 &&
                            aadharFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                          {input?.name == "categoryImage" &&
                            categoryFiles.length > 0 &&
                            categoryFiles?.map(file => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Profile"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  marginTop: "15px",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleOpenImage(URL.createObjectURL(file))
                                }
                              />
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className="formInputContainer" key={input?.id}>
                        <label>{input?.label}</label>
                        {/* <label>"HELLO!!!!!!!!"</label> */}
                        <input
                          disabled={
                            disableText
                              ? disableText
                              : isView
                              ? isView
                              : input?.disabled
                          }
                          value={
                            formData && formData[input?.name]
                              ? formData[input?.name]
                              : ""
                          }
                          type={input?.type}
                          placeholder={input?.placeholder}
                          name={input?.name}
                          onChange={e => handleFormData(e)}
                        />
                      </div>
                    )
                  )}
                  <Formik>
                    <Form>
                      {inputs.map((input, index) =>
                        input.type === "select" &&
                        input.placeholder === "State" ? (
                          <>
                            <div className="formInputContainer" key={index}>
                              <label htmlFor={input?.name}>"HELLOOOOO"</label>
                              <Field
                                as="select"
                                name="Formik"
                                style={{ width: "100%", height: "25px" }}
                              >
                                <option value="">Select State</option>
                                {input.option !== null &&
                                input.option !== undefined
                                  ? input.option.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options}
                                      >
                                        {options}
                                      </option>
                                    ))
                                  : states.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options.name}
                                      >
                                        {options.name}
                                      </option>
                                    ))}
                              </Field>
                              {/* <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select State</option>
                                {input.option !== null &&
                                input.option !== undefined
                                  ? input.option.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options}
                                      >
                                        {options}
                                      </option>
                                    ))
                                  : states.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options.name}
                                      >
                                        {options.name}
                                      </option>
                                    ))}
                              </select> */}
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "City" ? (
                          <>
                            <div className="formInputContainer" key={index}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select City</option>
                                {input.option !== null &&
                                input.option !== undefined
                                  ? input.option.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options}
                                      >
                                        {options}
                                      </option>
                                    ))
                                  : cities.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options.name}
                                      >
                                        {options.name}
                                      </option>
                                    ))}
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "Category" ? (
                          <>
                            <div className="formInputContainer" key={index}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select Category</option>
                                {input.option !== null &&
                                input.option !== undefined
                                  ? input.option.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options}
                                      >
                                        {options}
                                      </option>
                                    ))
                                  : categories.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options.name}
                                      >
                                        {options.name}
                                      </option>
                                    ))}
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "Product" ? (
                          <>
                            <div className="formInputContainer" key={index}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Add Product</option>
                                {input.option !== null &&
                                input.option !== undefined
                                  ? input.option.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options}
                                      >
                                        {options}
                                      </option>
                                    ))
                                  : products.map((options, index) => (
                                      <option
                                        key={index}
                                        name={input?.name}
                                        value={options.name}
                                      >
                                        {options.name}
                                      </option>
                                    ))}
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "Product Unit" ? (
                          <>
                            <div className="formInputContainer" key={index}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select Unit</option>
                                {unit?.map((options, index) => (
                                  <option
                                    key={index}
                                    name={input?.name}
                                    value={options.unit}
                                  >
                                    {options.unit}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "Country" ? (
                          <>
                            <div className="formInputContainer" key={input?.id}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select Country</option>
                                <option
                                  value={suitableCountry}
                                  name={input?.name}
                                >
                                  {suitableCountry}
                                </option>
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" &&
                          input.placeholder === "Country" ? (
                          <>
                            <div className="formInputContainer" key={input?.id}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select Country</option>
                                <option
                                  value={suitableCountry}
                                  name={input?.name}
                                >
                                  {suitableCountry}
                                </option>
                              </select>
                            </div>
                          </>
                        ) : input.type === "select" ? (
                          <>
                            <div className="formInputContainer" key={input?.id}>
                              <label htmlFor={input?.name}>
                                {input?.label}
                              </label>
                              <select
                                style={{ width: "100%", height: "25px" }}
                                disabled={isView}
                                name={input?.name}
                                value={
                                  formData && formData[input?.name]
                                    ? formData[input?.name]
                                    : ""
                                }
                                onChange={e => handleFormData(e)}
                              >
                                <option value="">Select</option>
                                {input.option !== null &&
                                  input.option !== undefined &&
                                  input.option.map((options, index) => (
                                    <option key={index} value={options}>
                                      {options}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </>
                        ) : input.type === "file" ? (
                          <>
                            <div className="formInputContainer" key={input?.id}>
                              <label>{input?.label}</label>
                              {isView && formData && formData[input?.name] ? (
                                <>
                                  <br />
                                  {formData[input?.name]?.map(image =>
                                    image.includes(".jpg") ||
                                    image.includes(".jpeg") ||
                                    image.includes(".png") ||
                                    image.includes(".in") ? (
                                      <img
                                        class="img-fluid side-img m-2"
                                        src={
                                          String(image).includes("files") &&
                                          !String(image).includes("bucket.s3")
                                            ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                            : image
                                        }
                                        alt="Produts"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleOpenImage(
                                            String(image).includes("files") &&
                                              !String(image).includes(
                                                "bucket.s3"
                                              )
                                              ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                              : image
                                          )
                                        }
                                      />
                                    ) : (
                                      <a
                                        href={
                                          String(image).includes("")
                                            ? `${process.env.REACT_APP_BASE_PATH}${image}`
                                            : image
                                        }
                                      >
                                        <DownloadIcon />
                                        {} Download
                                      </a>
                                    )
                                  )}
                                </>
                              ) : (
                                !selectedImage && (
                                  <input
                                    // value={formData[input?.name]}
                                    disabled={isView}
                                    type={input?.type}
                                    placeholder={input?.placeholder}
                                    name={input?.name}
                                    multiple
                                    accept="application/pdf, image/png"
                                    onChange={e => handleFormData(e)}
                                  />
                                )
                              )}
                              {input?.name == "productImage" &&
                                productsFiles.length > 0 &&
                                productsFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "profileImage" &&
                                profileFiles.length > 0 &&
                                profileFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "twoDImage" &&
                                twoDIFiles.length > 0 &&
                                twoDIFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "threeDImage" &&
                                threeDIFiles.length > 0 &&
                                threeDIFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "cadImage" &&
                                cadFiles.length > 0 &&
                                cadFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "gstImage" &&
                                gstFiles.length > 0 &&
                                gstFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "panImage" &&
                                panFiles.length > 0 &&
                                panFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "bankDetailsImage" &&
                                bankStatementFiles.length > 0 &&
                                bankStatementFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "coaLicenseImage" &&
                                coaLicenseFiles.length > 0 &&
                                coaLicenseFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "otherLicenseImage" &&
                                otherLicenseFiles.length > 0 &&
                                otherLicenseFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "aadharImage" &&
                                aadharFiles.length > 0 &&
                                aadharFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                              {input?.name == "categoryImage" &&
                                categoryFiles.length > 0 &&
                                categoryFiles?.map(file => (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Profile"
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      marginTop: "15px",
                                      marginRight: "15px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleOpenImage(URL.createObjectURL(file))
                                    }
                                  />
                                ))}
                            </div>
                          </>
                        ) : (
                          <div className="formInputContainer" key={input?.id}>
                            {/* <label>{input?.label}</label> */}
                            <label>"HELLO!!!!!!!!"</label>
                            <input
                              disabled={
                                disableText
                                  ? disableText
                                  : isView
                                  ? isView
                                  : input?.disabled
                              }
                              value={
                                formData && formData[input?.name]
                                  ? formData[input?.name]
                                  : ""
                              }
                              type={input?.type}
                              placeholder={input?.placeholder}
                              name={input?.name}
                              onChange={e => handleFormData(e)}
                            />
                          </div>
                        )
                      )}
                    </Form>
                  </Formik>
                  {role?.substring(5).toLowerCase() === "dealer" &&
                    type === "dealer" && (
                      <div className="formInputContainer" key={13}>
                        <label>Commission for Product (%)</label>
                        <input
                          disabled={
                            disableText ? disableText : isView ? isView : ""
                          }
                          value={
                            formData && formData["productCommission"]
                              ? formData["productCommission"]
                              : ""
                          }
                          type="text"
                          placeholder="Enter commission to admin for product in %"
                          name="productCommission"
                          onChange={e => handleFormData(e)}
                        />
                      </div>
                    )}
                </div>
                {role == "ROLE_USER" &&
                title !== "Profile Details" &&
                title !== "Add Address" ? (
                  <></>
                ) : (
                  <>
                    {type == "admin_order" ||
                    (role == "ROLE_DEALER" && params?.approvalStatus) ? (
                      id === numberRequest?.architectId && (
                        <div style={{ marginTop: "30px" }}>
                          {approvalStatus == "Delievered" ? (
                            <span
                              style={{
                                backgroundColor: "#fec20e",
                                padding: "4px 6px",
                                border: "1px solid #fec20e",
                                borderRadius: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              Order Delievered
                            </span>
                          ) : approvalStatus == "Dispatched" ? (
                            <>
                              <Button
                                style={{
                                  marginRight: "15px",
                                  marginTop: "10px",
                                }}
                                onClick={() => resendDeliveryOtp()}
                                variant="contained"
                                size="small"
                              >
                                Send OTP
                              </Button>
                              <Button
                                style={{
                                  marginRight: "15px",
                                  marginTop: "10px",
                                }}
                                onClick={() => handleStatusChange("Delievered")}
                                variant="contained"
                                size="small"
                              >
                                DELIEVER
                              </Button>
                            </>
                          ) : (
                            nextstatus.map((status, index) => (
                              <Button
                                key={index}
                                style={{
                                  marginRight: "15px",
                                  marginTop: "10px",
                                }}
                                onClick={() => handleStatusChange(status.label)}
                                variant={
                                  status?.label === approvalStatus
                                    ? "contained"
                                    : "outlined"
                                }
                                size="small"
                              >
                                {status?.name}
                              </Button>
                            ))
                          )}
                          {numberRequest?.invoiceImage.length > 0 &&
                            numberRequest?.paymentType == "COD" && (
                              <>
                                <Button
                                  style={{
                                    marginRight: "15px",
                                    marginTop: "10px",
                                  }}
                                  onClick={() =>
                                    handlePaymentSuccess("Payment Success")
                                  }
                                  variant="contained"
                                  size="small"
                                >
                                  Mark Payment Success
                                </Button>
                                <Button
                                  style={{
                                    marginRight: "15px",
                                    marginTop: "10px",
                                  }}
                                  onClick={() =>
                                    handlePaymentSuccess("Payment Failed")
                                  }
                                  variant="outlined"
                                  size="small"
                                >
                                  Mark Payment Failed
                                </Button>
                              </>
                            )}
                        </div>
                      )
                    ) : isView && status === "approval" ? (
                      <>
                        <div className="{`cellWithStatus ${formData.approvalStatus}`}">
                          {formData?.approvalStatus == "Approved" ? (
                            role?.substring(5).toLowerCase() === "admin" ? (
                              formData.uploadingUser === id ? (
                                <div
                                  className="createUserSubmitBTN"
                                  onClick={() => editForm(type, Pid)}
                                >
                                  Edit
                                </div>
                              ) : (
                                <div className="createUserSubmitBTN">
                                  Approved
                                </div>
                              )
                            ) : (
                              <>
                                <div
                                  className="createUserSubmitBTN"
                                  onClick={() => editForm(type, Pid)}
                                >
                                  Edit
                                </div>
                              </>
                            )
                          ) : formData?.approvalStatus == "Rejected" ? (
                            role?.substring(5).toLowerCase() === "admin" ? (
                              <div className="createUserSubmitBTN">
                                Rejected
                              </div>
                            ) : (
                              <>
                                <div
                                  className="createUserSubmitBTN"
                                  onClick={() => editForm(type, Pid)}
                                >
                                  Edit
                                </div>
                              </>
                            )
                          ) : role?.substring(5).toLowerCase() === "admin" ? (
                            <>
                              <div
                                className="createUserSubmitBTN"
                                onClick={() =>
                                  handleApprovalStatus(Pid, "Approved")
                                }
                              >
                                Approve
                              </div>
                              <div
                                className="createUserSubmitBTN1"
                                onClick={handleOpen}
                              >
                                Reject
                              </div>
                            </>
                          ) : (
                            <div
                              className="createUserSubmitBTN"
                              onClick={() => editForm(type, Pid)}
                            >
                              Edit
                            </div>
                          )}
                        </div>
                      </>
                    ) : isView ? (
                      <div
                        className="createUserSubmitBTN"
                        onClick={() => editForm(type, Pid)}
                      >
                        Edit
                      </div>
                    ) : (
                      <div
                        className="createUserSubmitBTN"
                        onClick={submitFormData}
                      >
                        {!isEdit ? "Submit" : "Update"}
                      </div>
                    )}
                  </>
                )}
                {(type == "admin_order" ||
                  role == "ROLE_DEALER" ||
                  role == "ROLE_USER") &&
                  params?.approvalStatus &&
                  numberRequest?.paymentType == "COD" &&
                  id === numberRequest?.architectId && (
                    <Button
                      style={{ marginRight: "15px", marginTop: "15px" }}
                      onClick={handleOpenInvoice}
                      variant="contained"
                      size="small"
                    >
                      Upload Invoice
                    </Button>
                  )}
                {(type == "admin_order" || type == "orders") &&
                  numberRequest?.comment && (
                    <div style={{ marginTop: "40px" }}>
                      <h3>
                        <b>Reason for rejection: </b>
                      </h3>
                      <Typography>{numberRequest?.comment}</Typography>
                    </div>
                  )}
                {(type == "admin_order" || type == "orders") &&
                  numberRequest?.invoiceImage.length > 0 && (
                    <div style={{ marginTop: "40px" }}>
                      <h3>
                        <b>Invoice: </b>
                      </h3>
                      {numberRequest?.invoiceImage?.map(image => (
                        <img
                          class="img-fluid side-img m-2"
                          src={image}
                          alt="Floor Plans"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenImage(image)}
                        />
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Enter reason for rejection"
            id="outlined-multiline-static"
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={e => handleContentChange(e)}
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            onClick={() => handleApprovalStatus(Pid, "Rejected")}
          >
            Reject
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openOrder}
        onClose={handleCloseOder}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Enter reason for rejection"
            id="outlined-multiline-static"
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={e => handleContentChange(e)}
            multiline
            rows={4}
          />
          <Button variant="contained" onClick={handleRejectStatus}>
            Reject
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openInvoice}
        onClose={handleCloseInvoice}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input
            name="invoicefiles"
            id="invoicefiles"
            type="file"
            multiple
            accept="application/pdf, image/png"
            style={{ marginBottom: "10px" }}
            onChange={e => handleFileEvent(e, "invoice")}
          />
          <Button
            variant="contained"
            onClick={() => handleInvoiceStatusChange()}
          >
            Upload
          </Button>
          {invoiceFiles.length > 0 && (
            <div style={{ marginTop: "10px" }} className="uploaded-files-list">
              <Typography variant="h6">Files: </Typography>
              {invoiceFiles?.map(file => (
                <div>{file?.name}</div>
              ))}
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={openImage}
        onClose={handleCloseImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <img
              src={image}
              style={{ width: "100%", height: "100%" }}
              alt="pic"
            />
            <a href={image} Download="Invoice Image">
              <button
                className="btn btn-primary btn-sm mt-3"
                size="small"
                variant="contained"
                type="button"
              >
                Download{" "}
              </button>
            </a>
          </div>
        </Box>
      </Modal>

      {/* Modal box for adding product review */}
      <Modal
        open={reviewOpen}
        onClose={handleReviewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="datatable">
            <div className="datatableTitle fs-5">Rate this product</div>
            <Rating
              name="hover-feedback"
              value={ratingValue}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            {ratingValue !== null && (
              <Box sx={{ ml: 1 }}>
                {labels[hover !== -1 ? hover : ratingValue]}
              </Box>
            )}
            <hr />
            <div className="datatableTitle fs-5">Review this product</div>
            <TextField
              // id="filled-multiline-flexible"
              placeholder="Description required..."
              onChange={e => setRatingComment(e.target.value)}
              multiline
              className="w-100"
            />
            <hr />
            <div className="datatableTitle fs-5">Title(optional)</div>
            <TextField
              // id="filled-multiline-flexible"
              placeholder="Title..."
              onChange={e => setRatingCommentTitle(e.target.value)}
              multiline
              className="w-100"
            />
            <br />
            <br />
            <Button variant="outlined" onClick={addNewRating}>
              Submit
            </Button>
            <Button
              variant="outlined"
              style={{ marginLeft: "10px" }}
              onClick={handleReviewClose}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminNewForm;
