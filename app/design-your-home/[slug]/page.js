"use client";
import { useParams, usePathname } from "next/navigation";
import {
  Button,
  Card,
  CardActionArea,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import dummyImagePdf from "../../../public/assets/dummy-image-pdf.jpg";
import dummyImageCad from "../../../public/assets/dummy-image-cad.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import ReviewProduct from "../../../components/ReviewProduct/ReviewProduct";
import DownloadDesign from "../../../components/Download Design/DownloadDesign";
import EditDesign from "../../../components/Edit Design/EditDesign";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueries } from "@tanstack/react-query";
import { postEndpoint, postUserEndpoint } from "../../../helpers/endpoints";
import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useAuthStore } from "../../../store/useAuthStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// const labels = {
//   1: "Very Bad",
//   2: "Bad",
//   3: "Good",
//   4: "Very Good",
//   5: "Excellent",
// };
// function getLabelText(value) {
//   return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
// }

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ViewDesignsPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [getRatings, setGetRatings] = useState("");
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [architectOpen, setArchitectOpen] = React.useState(false);
  const [designDetails, setDesignDetails] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState("");
  const [cadImage, setCadImage] = useState("");
  const [comment, setComment] = useState("");
  const [paid, setPaid] = useState(false);
  const [openEditDesign, setOpenEditDesign] = useState(false);
  const [featuredData, setFeaturedData] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const handleClose = () => setOpen(false);
  const handleReviewClose = () => setReviewOpen(false);
  const handleArchitectClose = () => setArchitectOpen(false);
  const handleEditDesignClose = () => setOpenEditDesign(false);
  // const location = useLocation();
  // let userId = localStorage.getItem("activeUser");
  // let userRole = localStorage.getItem("role");
  const path = usePathname();
  const isAuth = useAuthStore(state => state.isAuth);
  const userId = useAuthStore(state => state.userId);
  const token = useAuthStore(state => state.token);
  const userRole = useAuthStore(state => state.userType);
  const [architectRating, setArchitectRating] = useState(0);
  const [reviewPeople, setReviewPeople] = useState([]);
  const [architectDetails, setArchitectDetails] = useState("");

  const [
    { data: designData, isLoading: designIsLoading },
    { data: ratingData, isLoading: ratingIsLoading },
    { data: allDesignData, isLoading: allDesignIsLoading },
    { data: architectData, isLoading: architectIsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: [`${slug}`],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "get-design-by-id",
            data: {
              id: slug,
            },
          }),
      },
      {
        queryKey: [`design/${slug}`],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "get-rating-by-product-id",
            data: {
              productid: slug,
            },
          }),
      },
      {
        queryKey: ["design"],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "filterDesign",
          }),
      },
      {
        queryKey: [`architect/${slug}`],
        queryFn: () =>
          postEndpoint({
            endpoint: "architect/detail",
            data: {
              id: designDetails?.uploadingUser,
            },
          }),
        enabled: false,
      },
    ],
  });

  const wishlistMutation = useMutation({
    mutationKey: ["wishlistDesign"],
    mutationFn: data =>
      postUserEndpoint({
        endpoint: "addWishList",
        data,
      }),
    onSuccess: () => {
      if (designDetails?.wishUser.includes(userId)) {
        toast.success(`Design added to your wishlist`);
      } else {
        toast.error(`Design remove from your wishlist`);
      }
    },
  });

  const designArchitecturePage = () => {
    isAuth
      ? router.push(`/view-design-architecture/${slug}`)
      : router.push("/login");
  };

  const handleOpen = (image, type) => {
    setImage(image);
    setOpen(true);
    if (type === "cadImage") {
      setPaid(true);
    } else {
      setPaid(false);
    }
  };

  const handleReviewOpen = productDetails => {
    if (isAuth) {
      setReviewOpen(true);
    } else {
      router.push("/login");
    }
  };

  const handleArchitectOpen = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/architect/detail`, {
        id: designDetails?.uploadingUser,
      })
      .then(resp => {
        console.log(resp?.data?.data[0]);
        setArchitectDetails(resp?.data?.data[0]);
      })
      .catch(err => {
        console.error(err);
      });
    setArchitectOpen(true);
  };

  const reduceRating = ratingData?.data
    .reduce((acc, curr) => acc + parseInt(curr.rating), 0)
    .toFixed(1);

  const getAllDesigns = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/filterDesign`)
      .then(resp => {
        setFeaturedData(resp?.data?.data);
        handleClose();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleEditDesignOpen = () => {
    if (token) {
      setOpenEditDesign(true);
    } else {
      router.push("/login");
    }
  };

  const initialize = (
    mid,
    orderId,
    amount,
    token,
    contactType,
    paymentType,
    architectId
  ) => {
    var config = {
      root: "",
      style: {
        bodyBackgroundColor: "#fafafb",
        bodyColor: "",
        themeBackgroundColor: "#0FB8C9",
        themeColor: "#ffffff",
        headerBackgroundColor: "#284055",
        headerColor: "#ffffff",
        errorColor: "",
        successColor: "",
        card: {
          padding: "",
          backgroundColor: "",
        },
      },
      data: {
        orderId: orderId,
        token: token,
        tokenType: "TXN_TOKEN",
        amount: amount /* update amount */,
      },
      payMode: {
        labels: {},
        filter: {
          exclude: [],
        },
        order: ["CC", "DC", "NB", "UPI", "PPBL", "PPI", "BALANCE"],
      },
      website: "DEFAULT",
      flow: "DEFAULT",
      merchant: {
        mid: mid,
        redirect: false,
      },
      handler: {
        transactionStatus: function (paymentStatus) {
          console.log("paymentStatus handler function called");
          const data = {
            architectId: architectId,
            designId: slug,
            userId: userId,
            comment: comment,
            contactType: contactType,
            paymentType: paymentType,
            productDetail: designDetails,
            orderId: orderId,
          };
          axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}/api/user/verify-payment`,
              data
            )
            .then(resp => {
              console.log("transaction token", resp.data);
              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "TXN_SUCCESS"
              ) {
                toast.success(
                  "Congratulations, your order has been successfully sent. You will be contacted soon!",
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );

                const dealerNotification = {
                  receiverId: architectId,
                  message: `Payment done Successfully for order ID ${orderId}`,
                  url: path,
                  userType: "ROLE_DEALER",
                };
                const adminNotification = {
                  receiverId: "admin",
                  message: `Payment done Successfully for order ID ${orderId}`,
                  url: path,
                  userType: "ROLE_ADMIN",
                };

                const userNotification = {
                  receiverId: userId,
                  message: `Payment done Successfully for order ID ${orderId}`,
                  url: path,
                  userType: "ROLE_USER",
                };

                axios
                  .post(
                    `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
                    userNotification
                  )
                  .then(resp => {
                    console.log(resp.data);
                  })
                  .catch(err => {
                    console.error(err);
                  });

                axios
                  .post(
                    `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
                    adminNotification
                  )
                  .then(resp => {
                    console.log(resp.data);
                  })
                  .catch(err => {
                    console.error(err);
                  });
                axios
                  .post(
                    `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
                    dealerNotification
                  )
                  .then(resp => {
                    console.log(resp.data);
                  })
                  .catch(err => {
                    console.error(err);
                  });
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "TXN_FAILURE"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "PENDING"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }

              if (
                resp.data.data.paymentInformation.body.resultInfo
                  .resultStatus == "NO_RECORD_FOUND"
              ) {
                toast.error(
                  resp.data.data.paymentInformation.body.resultInfo.resultMsg,
                  {
                    position: toast.POSITION.TOP_RIGHT,
                  }
                );
              }
            })
            .catch(err => {
              console.error(err);
              toast.error("Something went wrong. Please try again!", {
                position: toast.POSITION.TOP_RIGHT,
              });
            });
          setTimeout(() => window.location.reload(), 1500);
          console.log(paymentStatus);
        },
        notifyMerchant: function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        },
      },
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("Error => ", error);
        });
    }
  };

  const makePayment = (
    amount,
    currency,
    contactType,
    paymentType,
    architectId
  ) => {
    // Sandbox Credentials
    let mid = "WBJIwm08119302462954"; // Merchant ID
    let orderId = "Order_" + new Date().getTime();
    const callbackUrl = path;
    const userId = userId;
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/initiate-payment`, {
        orderId,
        amount,
        callbackUrl,
        currency,
        userId,
      })
      .then(resp => {
        // console.log("transaction token", resp.data.data)
        if (resp.data.data.body.resultInfo.resultStatus == "S") {
          const transactionToken = resp.data.data.body.txnToken;
          initialize(
            mid,
            orderId,
            amount,
            transactionToken,
            contactType,
            paymentType,
            architectId
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleWishChange = async wish => {
    if (isAuth) {
      const data = {
        designId: slug,
        wish,
        userId,
      };
      // wishlistMutation.mutate(data);
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/addWishList`, data)
        .then(resp => {
          // console.log(resp.data);
          axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}/api/user/get-design-by-id`,
              {
                id: slug,
              }
            )
            .then(resp => {
              // console.log("Show all designs for users", resp?.data?.data[0]);
              setDesignDetails(resp?.data?.data[0]);
              getArchitectRating(resp?.data?.data[0].uploadingUser);
              setSelectedImage(resp?.data?.data[0]?.threeDImage[0]);
            })
            .catch(err => {
              console.error(err);
            });
          if (wish === true) {
            toast.success(`Design added to your wishlist`, {
              position: "top-right",
            });
          } else {
            toast.error(`Design remove from your wishlist`, {
              position: "top-right",
            });
          }
        })
        .catch(err => {
          console.error(err);
          notify("error", err);
        });
    } else {
      router.push("/login");
    }
  };

  const notify = (type, message) => {
    if (type == "success" && message.status == 200) {
      toast.success(message.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (message.status == 202) {
      toast.error(message.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/get-design-by-id`, {
        id: slug,
      })
      .then(resp => {
        // console.log("Show all designs for users", resp?.data?.data[0]);
        setDesignDetails(resp?.data?.data[0]);
        getArchitectRating(resp?.data?.data[0].uploadingUser);
        setSelectedImage(resp?.data?.data[0]?.threeDImage[0]);
      })
      .catch(err => {
        console.error(err);
      });

    axios
      .post(`${process.env.REACT_APP_BASE_PATH}/api/user/order-details`, {
        designId: slug,
        userId: userId,
        contactType: "Image Download",
      })
      .then(resp => {
        // console.log("Show image", resp.data)
        setCadImage(resp?.data?.data[0]?.productDetail?.cadImage);
      })
      .catch(err => {
        console.error(err);
      });
  }, [slug]);

  const getArchitectRating = id => {
    const data = {
      id: id,
    };
    axios
      .post(
        `${process.env.REACT_APP_BASE_PATH}/api/dealer/get-dealer-rating-by-id`,
        data
      )
      .then(resp => {
        let rate = 0;
        for (let i = 0; i < resp.data.data.length; i++) {
          rate += parseInt(resp.data.data[i].rating);
        }
        setArchitectRating(parseFloat(rate / resp.data.data.length).toFixed(1));
      })
      .catch(err => {
        console.error(err);
      });
  };

  const architectContact = (architectId, contactType) => {
    if (token) {
      const data = {
        architectId: architectId,
        designId: slug,
        userId: userId,
        comment: comment,
        contactType: contactType,
        productDetail: designDetails,
      };
      const architectNotification = {
        receiverId: architectId,
        message: `New User Contact Query raised for design id ${slug}`,
        url: path,
        userType: userRole ? userRole : "",
      };

      const userNotification = {
        receiverId: userId,
        message: `Your Query to contact Architect with design id ${slug} Placed Successfully`,
        url: path,
        userType: "ROLE_ADMIN",
      };

      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
          userNotification
        )
        .then(resp => {
          console.log(resp.data);
        })
        .catch(err => {
          console.error(err);
        });

      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
          architectNotification
        )
        .then(resp => {
          console.log(resp.data);
        })
        .catch(err => {
          console.error(err);
        });

      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/architect/order`, data)
        .then(resp => {
          if (resp) {
            toast.success(
              "Your query for design has been successfully sent. You will be contacted soon!",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
          }
        })
        .catch(err => {
          console.error(err);
          toast.error("Something went wrong. Please try again!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    } else {
      // localStorage.setItem("last_url", location.pathname);
      navigate("/login");
    }
  };

  const editDesignHandler = formData => {
    setComment(formData.comments);
    makePayment("20", "INR", "Design Modify");
  };

  return (
    <>
      <Header />
      <section className="my-4 px-4">
        <div className="flex flex-row gap-6 justify-between">
          <div className="w-[100rem] h-full">
            <div className="flex items-center justify-center mb-4">
              <TransformWrapper>
                <TransformComponent>
                  <Image
                    src={
                      selectedImage &&
                      selectedImage.match(/jpg|jpeg|png|gif|webp/)
                        ? String(selectedImage).includes("files") &&
                          !String(selectedImage).includes("bucket.s3")
                          ? `${process.env.REACT_APP_BASE_PATH}${selectedImage}`
                          : selectedImage
                        : dummyImagePdf
                    }
                    alt="dummy-image"
                    width={500}
                    height={500}
                    className="h-[40rem] w-[50rem]"
                    priority
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
            <div className="flex justify-evenly">
              {designDetails?.twoDImage.length > 0 &&
                designDetails?.twoDImage?.map((file, i) => (
                  <div key={i * 753}>
                    <Image
                      onClick={() => setSelectedImage(file)}
                      height={100}
                      width={100}
                      src={
                        file && file.match(/jpg|jpeg|png|gif/)
                          ? String(file).includes("files") &&
                            !String(file).includes("bucket.s3")
                            ? `${process.env.REACT_APP_BASE_PATH}${file}`
                            : file
                          : dummyImagePdf
                      }
                      alt="product"
                      priority
                      className={
                        selectedImage === file
                          ? "img-fluid side-img mt-3 slide-active"
                          : "img-fluid side-img mt-3"
                      }
                    />
                  </div>
                ))}
              {designDetails?.threeDImage.length > 0 &&
                designDetails?.threeDImage?.map((file, i) => (
                  <Image
                    height={100}
                    width={100}
                    key={i * 153}
                    onClick={() => setSelectedImage(file)}
                    src={
                      file && file.match(/jpg|jpeg|png|gif/)
                        ? String(file).includes("files") &&
                          !String(file).includes("bucket.s3")
                          ? `${process.env.REACT_APP_BASE_PATH}${file}`
                          : file
                        : dummyImagePdf
                    }
                    alt="product"
                    priority
                    className="h-auto object-contain"
                  />
                ))}
              {designDetails?.cadImage.length > 0 &&
                designDetails?.cadImage?.map((file, i) => (
                  <Image
                    height={100}
                    width={100}
                    key={i * 951}
                    src={
                      file && file.match(/jpg|jpeg|png|gif/)
                        ? String(file).includes("files") &&
                          !String(file).includes("bucket.s3")
                          ? `${process.env.REACT_APP_BASE_PATH}${file}`
                          : file
                        : dummyImagePdf
                    }
                    alt="Floor Plans"
                    priority
                    onClick={() => handleOpen(file, "cadImage")}
                    className="object-fill blur-[1px]"
                  />
                ))}
            </div>
            <div className="text-center mt-4">
              <a
                href={`${process.env.REACT_APP_BASE_PATH}${selectedImage}`}
                download="Design Image"
              >
                <Button
                  variant="contained"
                  sx={{
                    background: "#eab308",
                    color: "black",
                  }}
                >
                  Download
                </Button>
              </a>
            </div>
          </div>
          <div className="w-full">
            <h5 className="text-xl font-semibold">{`${
              designDetails?.plotLength
            }X${designDetails?.plotWidth}${" "}${designDetails?.title}`}</h5>
            <div className="flex flex-row gap-4 items-center">
              {getRatings > 0 ? (
                <div className="flex flex-row gap-2">
                  <span className="bg-green-700 text-xs rounded-sm text-white p-1">
                    {reduceRating.toFixed(1) / 2}{" "}
                    <StarIcon
                      className="mb-1 text-light"
                      style={{ fontSize: "12px" }}
                    />
                  </span>
                  <div className="font-semibold text-[#878787]">
                    {reviewPeople.length > 0 ? reviewPeople.length : 0} Ratings
                    &amp; Reviews
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <span className="bg-green-700 text-xs rounded-sm text-white p-1">
                    {0}{" "}
                    <StarIcon
                      className="mb-1 text-light"
                      style={{ fontSize: "12px" }}
                    />
                  </span>
                  <div className="font-semibold text-[#878787]">
                    {reviewPeople.length > 0 ? reviewPeople.length : 0} Ratings
                    &amp; Reviews
                  </div>
                </div>
              )}
              <>
                <div className="review-people">
                  {designDetails?.wishUser.includes(userId) ? (
                    <span>
                      <FavoriteIcon
                        fontSize="large"
                        style={{ cursor: "pointer", color: "#ff4343" }}
                        onClick={() => handleWishChange(false)}
                      />
                    </span>
                  ) : (
                    <span>
                      <FavoriteBorderIcon
                        fontSize="large"
                        style={{ cursor: "pointer", fill: "#c2c2c2" }}
                        onClick={() => handleWishChange(true)}
                      />
                    </span>
                  )}
                </div>
                <br />
              </>
            </div>
            <div className="product-quality mt-3">
              <div className="font-semibold text-xl">Design Description - </div>
              <div>
                {designDetails?.description ? designDetails?.description : ""}
              </div>
            </div>
            <div className="flex flex-row gap-16 my-4">
              <div style={{ fontWeight: "500", color: "#878787" }}>Seller</div>
              <div className="text-blue-500 font-semibold text-sm mt-[2px]">
                <div
                  className="flex flex-row gap-2 mb-1 cursor-pointer"
                  onClick={handleArchitectOpen}
                >
                  <div>{designDetails?.uploadingUserName}</div>
                  <div className="bg-blue-500 text-xs rounded-md text-white p-1">
                    {architectRating > 0 ? (
                      <span>{architectRating}</span>
                    ) : (
                      <span>0</span>
                    )}
                    <StarIcon
                      className="mb-1 text-light"
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                </div>
                <Button
                  variant="text"
                  size="small"
                  onClick={designArchitecturePage}
                  sx={{ fontWeight: "600" }}
                >
                  See other sellers
                </Button>
              </div>
            </div>
            <h5> Plan Details</h5>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head">Supplier</TableCell>
                    <TableCell>
                      {designDetails?.uploadingUserName} (
                      {designDetails?.userRating}{" "}
                      <Link
                        href={`/view-profile/design/${designDetails?.uploadingUser}`}
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        View Details
                      </Link>
                      )
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Location</TableCell>
                    <TableCell>
                      {`${designDetails?.serviceLocationState} (${designDetails?.serviceLocationCity})`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Plot Length</TableCell>
                    <TableCell>{designDetails?.plotLength}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Plot Width</TableCell>
                    <TableCell>{designDetails?.plotWidth}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Number of Bedrooms</TableCell>
                    <TableCell>{designDetails?.numberOfBedrooms}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Number of Toilets </TableCell>
                    <TableCell>{designDetails?.numberOfToilets}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Number of Floors</TableCell>
                    <TableCell>{designDetails?.numberOfFloor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Building Type</TableCell>
                    <TableCell>{designDetails?.buildingType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Vastu</TableCell>
                    <TableCell>
                      {designDetails?.isVastu == false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Stiltd Parking</TableCell>
                    <TableCell>
                      {designDetails?.isStiltdParking == false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Purpose</TableCell>
                    <TableCell>{designDetails?.purpose}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Special Feature</TableCell>
                    <TableCell>
                      {designDetails?.specialFeature == false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex justify-evenly mt-4 text-nowrap">
              <Button
                variant="contained"
                sx={{
                  background: "#eab308",
                  color: "black",
                }}
                onClick={() =>
                  architectContact(
                    designDetails?.uploadingUser,
                    "Architect Contact"
                  )
                }
              >
                Contact Architect
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "#eab308",
                  color: "black",
                }}
                onClick={handleEditDesignOpen}
              >
                Modify Design
              </Button>
            </div>
          </div>
        </div>
        <div className=" mt-8">
          <div className="flex justify-between">
            <h4 className="text-lg font-semibold">Ratings & Reviews</h4>
            <Button
              size="small"
              variant="contained"
              sx={{
                marginY: ".25rem",
              }}
              onClick={() => handleReviewOpen(designDetails)}
            >
              Rate Design
            </Button>
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-5 gap-4">
            {reviewPeople?.length > 0 &&
              reviewPeople.slice(0, 4).map(item => {
                return (
                  <Card key={item.username}>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="bg-green-700 text-xs rounded-sm text-white p-1">
                          {item.rating}{" "}
                          <StarIcon
                            className="mb-1 text-light"
                            style={{ fontSize: "12px" }}
                          />
                        </span>
                        <span className="text-lg ml-2">{item.title}</span>
                      </div>
                      <div className="mb-2">{item.comments}</div>
                      <p style={{ fontSize: "13px", color: "#878787" }}>
                        <span>{item.username}</span>
                        {`, `}
                        <span>
                          {month[new Date(item.date).getMonth()]}
                          {`, ${new Date(item.date).getFullYear()}`}
                        </span>
                      </p>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>
      <section className="px-4">
        <div>
          <h2 className="font-semibold text-2xl mb-2">Related Designs</h2>
          <div className="grid grid-cols-5 gap-2 w-100 h-full -2xl:px-2 -2xl:grid-cols-3 -md:grid-cols-2 -sm:grid-cols-2 mb-4">
            {!designIsLoading &&
              designData?.data.map(
                (item, index) =>
                  item._id !== slug &&
                  item?.approvalStatus === "Approved" && (
                    <div className="inline-block" key={item.title}>
                      <Card>
                        <CardActionArea
                          onClick={() =>
                            router.push(`/design-your-home/${item?._id}`)
                          }
                        >
                          {item?.twoDImage[index] ||
                          (item?.threeDImage[index] &&
                            item?.twoDImage[index].match(
                              /jpg|jpeg|png|gif|webp/
                            )) ? (
                            <Image
                              src={
                                String(item?.twoDImage[index]).includes(
                                  "files"
                                ) &&
                                !String(item?.twoDImage[index]).includes(
                                  "bucket.s3"
                                )
                                  ? `${process.env.REACT_APP_BASE_PATH}${item?.twoDImage[index]}`
                                  : item?.twoDImage[index]
                              }
                              alt="item"
                              height={0}
                              width={500}
                              className="h-72 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              height={0}
                              width={500}
                              alt="img"
                              src={dummyImagePdf}
                              className="h-72 object-cover"
                              loading="lazy"
                              priority
                            />
                          )}
                          <div className="mt-2 font-semibold mb-1 px-3 truncate">
                            {`${item.plotLength}X${item.plotWidth} ${item.title}`}
                          </div>
                          <div className="flex flex-row justify-between md:px-2 py-1 bg-blue-100 rounded-[6px] -md:px-1 mx-2 mb-2">
                            <div className="flex flex-row items-center gap-2">
                              <AiOutlineExpandAlt className="text-red-500 text-2xl -md:text-xl" />
                              {parseInt(item.plotLength) *
                                parseInt(item.plotWidth)}
                              sqft
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <FaRetweet className="text-red-500 text-2xl -md:text-xl" />
                              {`${item.plotLength}X${item.plotWidth}`}
                            </div>
                          </div>
                        </CardActionArea>
                      </Card>
                    </div>
                  )
              )}
          </div>
        </div>
      </section>

      {/* Modal box for adding design review */}
      <Modal
        open={reviewOpen}
        onClose={handleReviewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReviewProduct
          userId={userId}
          productId={productId}
          handleReviewClose={handleReviewClose}
        />
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DownloadDesign
          cadImage={cadImage}
          designDetails={designDetails}
          image={image}
          makePayment={makePayment}
          paid={paid}
        />
      </Modal>
      <Modal
        open={openEditDesign}
        onClose={handleEditDesignClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditDesign handler={editDesignHandler} />
      </Modal>
      <Modal
        open={architectOpen}
        onClose={handleArchitectClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="_1TWLMK icF5zO">
          <div className="_8mqQwQ">
            <button
              className="QqFHMw gtm1So"
              fdprocessedid="l23he"
              onClick={handleArchitectClose}
            >
              ✕
            </button>
            <div className="lIB9gI">
              <div>
                <div className="yxtCxJ">About the Seller</div>
                <div className="_63f5PG">
                  <div className="_0E1ql9">
                    <div className="yeLeBC">
                      <div> {designDetails?.uploadingUserName}&nbsp;&nbsp;</div>
                      <div className="XQDdHH uuhqql">
                        <span className="sellerp-review">
                          {architectRating > 0 && architectRating}
                          <StarIcon
                            className="mb-1 text-light"
                            style={{ fontSize: "12px" }}
                          />
                        </span>
                      </div>
                    </div>
                    {architectDetails && (
                      <>
                        <div className="Z51YTA">
                          <div className="ebYP20">
                            <span className="KalC6f">
                              {architectDetails?.companyNameShopName}
                            </span>
                            <span className="iQx8rI XJHjWY"></span>
                          </div>
                        </div>
                        <div className="jk582P">
                          <div className="Zd3XrH">
                            <span className="tRZ73o">
                              Seller since - &nbsp;
                            </span>
                            <span className="_5A5n4W">
                              {architectDetails?.dateOfCompanyFormation}
                            </span>
                          </div>
                        </div>
                        <div className="jk582P">
                          <div className="Zd3XrH">
                            <span className="tRZ73o">
                              Service location state - &nbsp;
                            </span>
                            <span className="_5A5n4W">
                              {architectDetails?.serviceLocationState}
                            </span>
                          </div>
                        </div>
                        <div className="jk582P">
                          <div className="Zd3XrH">
                            <span className="tRZ73o ">
                              Service location city - &nbsp;
                            </span>
                            <span className="_5A5n4W">
                              {architectDetails?.serviceLocationCity}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Modal>
      <Footer />
    </>
  );
};

export default ViewDesignsPage;
