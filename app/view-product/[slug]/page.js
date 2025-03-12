"use client";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import dummyImagePdf from "../../../public/assets/dummy-image-pdf.jpg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaRupeeSign } from "react-icons/fa";
import ReviewProduct from "../../../components/ReviewProduct/ReviewProduct";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
  postDealerEndpoint,
  postNotificationEndpoint,
  postUserEndpoint,
} from "../../../helpers/endpoints";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Image from "next/image";
import Footer from "../../../components/Footer";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";

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

const Page = () => {
  const { slug } = useParams();
  const path = usePathname();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [dealerOpen, setDealerOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleDealerClose = () => setDealerOpen(false);
  const isAuth = useAuthStore(store => store.isAuth);
  const setUrl = useAuthStore(store => store.setUrl);
  const userType = useAuthStore(store => store.userType);
  const userId = useAuthStore(store => store.userId);
  const logout = useAuthStore(store => store.logout);
  const [getDealer, setGetDealer] = useState(false);

  const productDealerPage = () => {
    if (isAuth) {
      router.push(`/view-product-dealer/${slug}`);
      // navigate(`/view-product-dealer/${slug}`);
    } else {
      // setUrl(location.pathname);
      // navigate("/login");
      router.push("/login");
    }
  };
  const handleOpen = () => {
    if (isAuth) {
      setOpen(true);
    } else {
      // setUrl(location.pathname);
      router.push("/login");
      // navigate("/login");
    }
  };

  const makeCodPaymentMutaton = useMutation({
    mutationFn: data =>
      postUserEndpoint({
        endpoint: "make-payment-cod",
        data,
      }),
  });
  const makeNotificationMutaton = useMutation({
    mutationFn: data =>
      postNotificationEndpoint({
        data,
      }),
  });

  const makeVerifyPaymentMutation = useMutation({
    mutationFn: data =>
      postUserEndpoint({
        endpoint: "verify-payment",
        data,
      }),
  });

  const dealerNotification = (architectId, orderId) => ({
    receiverId: architectId,
    message: `Your product placed successfully for order Id ${orderId}`,
    url: path,
    userType: "ROLE_DEALER",
  });
  const adminNotification = orderId => ({
    receiverId: "admin",
    message: `Product placed successfully for order Id ${orderId}`,
    url: path,
    userType: "ROLE_ADMIN",
  });

  const userNotification = orderId => ({
    receiverId: userId,
    message: `Your new order placed successfully for order Id ${orderId}`,
    url: path,
    userType: "ROLE_USER",
  });

  const handleWishChange = async (id, wish) => {
    if (userId) {
      const data = {
        designId: id,
        wish: wish,
        userId: userId,
      };
      // console.log(data)
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/user/addProductWishList`,
          data
        )
        .then(resp => {
          axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}/api/dealer/product-detail`,
              {
                id: id,
              }
            )
            .then(resp => {
              // console.log(resp)
              setdetailsData?.data[0](resp?.data?.data[0]);
              // getArchitectRating(resp?.data?.data[0].uploadingUser);
              setSelectedImage(resp?.data?.data[0]?.productImage[0]);
            })
            .catch(err => {
              console.error(err);
            });
          if (wish === true) {
            toast(`Design added to your wishlist`);
          } else {
            toast(`Design remove from your wishlist`);
          }
        })
        .catch(err => {
          console.error(err);
          toast(`Something went wrong`);
        });
    } else {
      // localStorage.setItem("last_url", location.pathname);
      navigate("/login");
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
            designId: params.productID,
            userId: userId,
            contactType: contactType,
            paymentType: paymentType,
            productDetail: detailsData?.data[0],
            addressId: selectedAddress,
            orderId: orderId,
          };

          makeVerifyPaymentMutation.mutate({
            data,
          });

          switch (
            makeVerifyPaymentMutation.data.data.paymentInformation.body
              .resultInfo.resultStatus
          ) {
            case "TXN_SUCCESS":
              toast(
                "Congratulations, your order has been successfully confirmed!"
              );
              makeNotificationMutaton.mutate({
                data: dealerNotification(architectId, orderId),
              });
              makeNotificationMutaton.mutate({
                data: adminNotification(orderId),
              });
              makeNotificationMutaton.mutate({
                data: userNotification(orderId),
              });
              break;
            case "TXN_FAILURE":
              toast(
                makeVerifyPaymentMutation.data.data.paymentInformation.body
                  .resultInfo.resultMsg
              );
              break;
            case "PENDING":
              toast(
                makeVerifyPaymentMutation.data.data.paymentInformation.body
                  .resultInfo.resultMsg
              );
              break;
            case "NO_RECORD_FOUND":
              toast(
                makeVerifyPaymentMutation.data.data.paymentInformation.body
                  .resultInfo.resultMsg
              );
              break;
            default:
              toast("Something went wrong. Please try again!");
              break;
          }
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

  const makePaymentCOD = async (
    amount,
    currency,
    contactType,
    paymentType,
    architectId
  ) => {
    let orderId = "ORDER" + new Date().getTime();

    const data = {
      architectId: architectId,
      designId: slug,
      userId: userId,
      contactType: contactType,
      paymentType: paymentType,
      productDetail: detailsData?.data[0],
      addressId: selectedAddress,
      orderId: orderId,
      paymentInformation: {
        body: {
          orderId: orderId,
          txnAmount: amount,
          paymentMode: "COD",
          txnDate: new Date(),
        },
      },
    };

    if (selectedAddress !== "") {
      makeCodPaymentMutaton.mutate({ data });

      if (makeCodPaymentMutaton.isError) {
        toast("Something went wrong!, Please try again later.");
      }
      if (makeCodPaymentMutaton.isSuccess) {
        toast("Congratulations, your order has been successfully confirmed!");
        makeNotificationMutaton.mutate({
          data: dealerNotification(architectId, orderId),
        });
        makeNotificationMutaton.mutate({
          data: adminNotification(orderId),
        });
        makeNotificationMutaton.mutate({
          data: userNotification(orderId),
        });
      }
    } else {
      toast("Please select Address of Delivery");
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
    let orderId = "ORDER" + new Date().getTime();
    if (selectedAddress !== "") {
      axios
        .post(`${process.env.REACT_APP_BASE_PATH}/api/user/initiate-payment`, {
          orderId,
          amount,
          path,
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
    } else {
      toast("Please select Address of Delivery");
    }
  };
  const [
    { data: detailsData, isLoading: detailsIsLoading },
    {
      data: productRatingData,
      isLoading: productRatingIsLoading,
      refetch: refetchProductRatingData,
    },
    { data: productsData, isLoading: productsIsLoading },
    { data: dealerData, isLoading: dealerIsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: [`productDetail/${slug}`],
        queryFn: () =>
          postDealerEndpoint({
            endpoint: "product-detail",
            data: { id: slug },
          }),
      },
      {
        queryKey: [`getRatingByProductId/${slug}`],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "get-rating-by-product-id",
            data: { productid: slug },
          }),
        staleTime: 1000,
      },
      {
        queryKey: [`filterProducts`],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "filterProducts",
          }),
      },
      {
        queryKey: [`dealerDetails`],
        queryFn: () =>
          postDealerEndpoint({
            endpoint: "detail",
            data: {
              id: detailsData?.data[0].uploadingUser,
            },
          }),
        enabled: getDealer,
      },
    ],
  });

  useEffect(() => {
    refetchProductRatingData();
  });

  const handleReviewClose = () => {
    setReviewOpen(false);
  };

  const { data: dealerRatingData, isLoading: dealerRatingIsLoading } = useQuery(
    {
      queryKey: [`getDealerRatingById/${slug}`],
      queryFn: () =>
        postDealerEndpoint({
          endpoint: "get-dealer-rating-by-id",
          data: {
            id: detailsData?.data[0].uploadingUser,
          },
        }),
      enabled: !!detailsData?.data[0].uploadingUser ? true : false,
    }
  );
  const { data: addressData, isLoading: addressIsLoading } = useQuery({
    queryKey: [`getAddress/${slug}`],
    queryFn: () =>
      postUserEndpoint({
        endpoint: "get-address",
        data: {
          uploadingUser: detailsData?.data[0].uploadingUser,
        },
      }),
    enabled: !!detailsData?.data[0].uploadingUser ? true : false,
  });

  const reduceRating = dealerRatingData?.data.reduce(
    (acc, curr) => acc + parseInt(curr.rating),
    0
  );

  const handleReviewOpen = () => {
    if (isAuth) {
      setReviewOpen(true);
    } else {
      setUrl(path);
      router.push("/login");
      // navigate("/login");
    }
  };

  const addNewAddress = () => {
    // localStorage.setItem("last_url", location.pathname);
    navigate(`/${userType.substring(5).toLowerCase()}/add-address`);
  };

  // const deleteReview = (id) => {
  //   const data = {
  //     id: id,
  //   };
  //   axios
  //     .post(`${process.env.REACT_APP_BASE_PATH}/delete-product-rating`, data)
  //     .then((resp) => {
  //       if (resp.data.data) {
  //         toast("Your review has been deleted successfully", {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //       }
  //       handleReviewClose();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       toast("Some error occured", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     });
  // };

  const handleQuantityChange = (
    e,
    productPrice,
    minimumQuantity,
    maximumQuantity
  ) => {
    setQuantity(e.target.value);
    handlePrice(productPrice);
    if (
      e.target.value >= parseInt(minimumQuantity) &&
      e.target.value <= parseInt(maximumQuantity)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const handlePrice = productPrice => {
    const changePrice = parseInt(quantity * parseInt(productPrice));
    setPrice(changePrice);
  };

  return (
    <>
      <Header />
      <section className="px-4 py-6">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="flex justify-center items-center">
            {!detailsIsLoading
              ? detailsData?.data[0]?.productImage?.map((file, index) => (
                  <div key={index}>
                    <Image
                      src={
                        file && file.match(/jpg|jpeg|png|gif|in/)
                          ? String(file).includes("files") &&
                            !String(selectedImage).includes("bucket.s3")
                            ? `${process.env.REACT_APP_BASE_PATH}${file}`
                            : file
                          : dummyImagePdf
                      }
                      height={500}
                      width={500}
                      className="w-auto h-[600px] object-center self-center"
                      alt={`product-${index + 1}`}
                      onClick={() => setSelectedImage(file)}
                    />
                  </div>
                ))
              : ""}
          </div>
          <div>
            <h5 className="text-xl font-semibold">
              {detailsData?.data[0]?.name}
            </h5>
            <div className="text-[#878787] flex flex-row items-center gap-2 font-semibold">
              {!productRatingIsLoading &&
              productRatingData?.data?.length > 0 ? (
                <div className="p-1 !pb-[2px] text-xs font-semibold text-white bg-green-600 inline-block rounded-sm items-center">
                  {Math.floor(
                    productRatingData.data.reduce(
                      (acc, curr) => acc + +curr.rating,
                      0
                    ) / productRatingData.data.length
                  )}
                  {console.log(
                    Array.from({
                      length: Math.floor(
                        productRatingData.data.reduce(
                          (acc, curr) => acc + +curr.rating,
                          0
                        ) / productRatingData.data.length
                      ),
                    }).length
                  )}
                  <StarIcon
                    className="mb-1 ml-[2px] text-light"
                    style={{ fontSize: "14px" }}
                  />
                </div>
              ) : (
                <button className="p-review">
                  {0}{" "}
                  <StarIcon
                    className="mb-1 text-light"
                    style={{ fontSize: "12px" }}
                  />
                </button>
              )}
              {!productRatingIsLoading && (
                <span>
                  {productRatingData?.data.length > 0
                    ? productRatingData.data.length
                    : 0}{" "}
                  Ratings & Reviews
                </span>
              )}

              {detailsData?.data[0]?.wishUser.includes(userId) ? (
                <span>
                  <FavoriteIcon
                    fontSize="large"
                    style={{ cursor: "pointer", color: "#ff4343" }}
                    onClick={() =>
                      handleWishChange(detailsData?.data[0]._id, false)
                    }
                  />
                </span>
              ) : (
                <span>
                  <FavoriteBorderIcon
                    fontSize="large"
                    style={{ cursor: "pointer", fill: "#c2c2c2" }}
                    onClick={() =>
                      handleWishChange(detailsData?.data[0]._id, true)
                    }
                  />
                </span>
              )}
            </div>
            <br />
            <div className="">
              {/* <h6 className="text-lg font-semibold my-2 leading-none">
                Specifications -
              </h6> */}

              <span>
                {detailsData?.data[0]?.descriptionOne
                  ? detailsData?.data[0]?.descriptionOne
                  : ""}
              </span>
              <br />
              <span>
                {detailsData?.data[0]?.descriptionTwo
                  ? detailsData?.data[0]?.descriptionTwo
                  : ""}
              </span>
              <br />
              <span>
                {detailsData?.data[0]?.descriptionThree
                  ? detailsData?.data[0]?.descriptionThree
                  : ""}
              </span>
            </div>
            <div sx={{ mt: 2, mb: 2 }}>
              <div className="flex flex-row gap-36">
                <div className="col-lg-3 mt-1 font-semibold text-[#878787]">
                  Seller
                </div>
                <div className="col-lg-9">
                  <Button
                    onClick={() => setDealerOpen(true)}
                    sx={{
                      fontWeight: "600",
                      fontSize: "12px",
                    }}
                  >
                    {detailsData?.data[0]?.uploadingUserName}&nbsp;
                    <div className="ml-2 bg-blue-600 text-white px-2 rounded-lg">
                      {reduceRating > 0 && reduceRating}
                      <StarIcon
                        sx={{
                          fontSize: "12px",
                          marginLeft: "4px",
                        }}
                      />
                    </div>
                  </Button>
                  <br />
                  <button
                    onClick={productDealerPage}
                    className="mx-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#2874f0",
                    }}
                  >
                    See other sellers
                  </button>
                </div>
              </div>
            </div>
            <h5 className="font-semibold text-xl mb-2">Product Description</h5>
            <TableContainer
              component={Box}
              sx={{ border: "1px solid #efefef", borderRadius: "7px" }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head">Supplier</TableCell>
                    <TableCell>
                      {detailsData?.data[0]?.uploadingUserName} (
                      {detailsData?.data[0]?.userRating}{" "}
                      <Link
                        href={`/view-profile/product/${detailsData?.data[0]?.uploadingUser}`}
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
                  <TableRow sx={{ backgroundColor: "#eee9da" }}>
                    <TableCell variant="head">Category</TableCell>
                    <TableCell>{detailsData?.data[0]?.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Location</TableCell>
                    <TableCell>
                      {detailsData?.data[0]?.serviceLocationState}
                      {detailsData?.data[0]?.serviceLocationCity
                        ? `(${detailsData?.data[0].serviceLocationCity})`
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#eee9da" }}>
                    <TableCell variant="head">Price</TableCell>
                    <TableCell>
                      {/* <FaRupeeSign /> */}
                      {`${detailsData?.data[0]?.price}`}
                      {detailsData?.data[0]?.unit
                        ? `/${detailsData?.data[0]?.unit}`
                        : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head">Minimum Quantity</TableCell>
                    <TableCell>{`${detailsData?.data[0]?.minQuantity} ${detailsData?.data[0]?.unit}`}</TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#eee9da" }}>
                    <TableCell variant="head">Maximum Quantity</TableCell>
                    <TableCell>{`${detailsData?.data[0]?.maxQuantity} ${detailsData?.data[0]?.unit}`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              *Quantiy should be in between minimum & maximum quantity.
            </p>
            <div className="flex flex-row mt-2">
              <div className="flex gap-2 items-center">
                <label className="font-semibold text-yellow-500">
                  Quantity:
                </label>
                <TextField
                  type="number"
                  size="small"
                  min="0"
                  sx={{
                    "& .MuiFormControl-root": {
                      outline: "1px solid #efefef",
                    },
                    "& .MuiInputBase-input": { background: "#fafafa" },
                    "width": "50%",
                    "& input[type=number]": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                  value={quantity}
                  onChange={e =>
                    handleQuantityChange(
                      e,
                      detailsData?.data[0]?.price,
                      detailsData?.data[0]?.minQuantity,
                      detailsData?.data[0]?.maxQuantity
                    )
                  }
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <label className="font-semibold text-yellow-500">
                  Total Price:
                </label>
                <TextField
                  type="tel"
                  size="small"
                  className="qyt-text-box"
                  value={price}
                  disabled
                  sx={{
                    "& .MuiFormControl-root": {
                      outline: "1px solid #efefef",
                    },
                    "& .MuiInputBase-input": { background: "#fafafa" },
                    "width": "50%",
                    "appearance": "textfield",
                    "& input::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Button
                  variant="contained"
                  sx={{ background: "#eab308", margin: "" }}
                  disabled={buttonDisabled}
                  onClick={handleOpen}
                >
                  Order
                </Button>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-20">
          <div className="flex flex-row justify-between">
            <h4 className="text-2xl font-semibold">Ratings & Reviews</h4>
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
                background: "#e5e5e5",
                color: "black",
              }}
              onClick={() => {
                handleReviewOpen(detailsData?.data[0]);
              }}
            >
              Rate Product
            </Button>
          </div>
          <hr className="my-3" />
          <div className="grid grid-cols-5 gap-4">
            {!productRatingIsLoading && productRatingData?.data.length > 0 ? (
              productRatingData?.data.slice(0, 6).map((item, index) => (
                <Card sx={{ padding: "1.5rem 1rem" }} key={index}>
                  <div className="mb-2">
                    <div className="p-1 !pb-[2px] text-xs font-semibold text-white bg-green-600 inline-block rounded-sm items-center [&_svg]:text-sm">
                      {item.rating} <StarIcon className="mb-1" />
                    </div>
                    &nbsp;&nbsp;
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <p className="card-text mb-4" style={{ fontSize: "14px" }}>
                    {item.comments}
                  </p>
                  <p style={{ fontSize: "13px", color: "#878787" }}>
                    <span>{item.username}</span>
                    {`, `}
                    <span>
                      {month[new Date(item.date).getMonth()]}
                      {`, ${new Date(item.date).getFullYear()}`}
                    </span>
                  </p>
                </Card>
              ))
            ) : (
              <div className="text-lg font-semibold p-8 text-center col-span-5">
                No reviews posted for this product.
              </div>
            )}
          </div>
        </section>
      </section>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          sx={{
            background: "white",
            height: "50%",
            width: "800px",
            position: "absolute",
            top: "20%",
            left: "30%",
          }}
        >
          <div className="p-4">
            <div className="flex flex-row justify-between mb-6">
              <div className="text-lg font-semibold">
                Select/Add New Address
              </div>
              <Button size="small" variant="outlined" onClick={addNewAddress}>
                Add Address
              </Button>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Zip Code</TableCell>
                    <TableCell>Near by</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Delivery Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map(row => (
                    <TableRow key={row?._id}>
                      <TableCell>{row?.address}</TableCell>
                      <TableCell>{row?.city}</TableCell>
                      <TableCell>{row?.state}</TableCell>
                      <TableCell>{row?.zipCode}</TableCell>
                      <TableCell>{row?.nearBy}</TableCell>
                      <TableCell>{row?.phoneNumber}</TableCell>
                      <TableCell>{row?.country}</TableCell>
                      <TableCell>
                        <div>
                          <ul>
                            <li style={{ listStyle: "none" }}>
                              <Stack direction="row" spacing={0.3}>
                                <input
                                  type="radio"
                                  id="html"
                                  name="deliveryAddress"
                                  onChange={e =>
                                    setSelectedAddress(e.target.value)
                                  }
                                  value={row?._id}
                                />
                              </Stack>
                            </li>
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <br />
            <Button
              variant="contained"
              style={{ marginRight: "10px" }}
              onClick={() =>
                makePayment(
                  `${price}`,
                  "INR",
                  "Material Purchase",
                  "Online",
                  detailsData?.data[0]?.uploadingUser
                )
              }
            >
              Pay with Paytm
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                makePaymentCOD(
                  `${price}`,
                  "INR",
                  "Material Purchase",
                  "COD",
                  detailsData?.data[0]?.uploadingUser
                )
              }
            >
              Cash on Delivery
            </Button>
          </div>
        </Card>
      </Modal>

      <Modal
        open={reviewOpen}
        onClose={handleReviewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReviewProduct
          handleReviewClose={handleReviewClose}
          productId={slug}
          userId={userId}
        />
      </Modal>
      <Modal
        open={dealerOpen}
        onClose={handleDealerClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          sx={{
            height: "50%",
            width: "40%",
            position: "absolute",
            top: "20%",
            right: "30%",
          }}
        >
          <div className="p-4 flex flex-col">
            <button className="ml-auto" onClick={handleDealerClose}>
              ✕
            </button>
            <div className="">
              <div className="text-xl font-semibold">About the Seller</div>
              <hr className="my-3" />
              <div className="flex gap-2 items-center">
                <div className="text-lg font-semibold">
                  {dealerData?.data[0]?.name}
                </div>
                <div className="mb-1 [&_svg]:text-base">
                  <StarIcon />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {dealerData?.data && (
                  <>
                    <div className="text-sm">
                      {dealerData?.data[0].companyNameShopName}
                    </div>
                    <div className="Zd3XrH">
                      <span className="tRZ73o">Seller since - &nbsp;</span>
                      <span className="font-semibold">
                        {dealerData?.data[0].dateOfCompanyFormation}
                      </span>
                    </div>
                    <div className="jk582P">
                      <span className="tRZ73o">
                        Service location state - &nbsp;
                      </span>
                      <span className="font-semibold">
                        {dealerData?.data[0].serviceLocationState}
                      </span>
                    </div>
                    <div className="jk582P">
                      <span className="tRZ73o ">
                        Service location city - &nbsp;
                      </span>
                      <span className="font-semibold">
                        {dealerData?.data[0].serviceLocationCity}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Modal>
      <section className="px-4 mt-2">
        <h2 className="text-2xl mb-3 font-semibold">Related Products</h2>
        <hr />
        <div className="grid md:grid-cols-5 gap-4 my-3 -md:grid-cols-3">
          {!productsIsLoading && productsData?.data.length > 0 ? (
            productsData?.data.map(
              (item, index) =>
                item?.approvalStatus == "Approved" &&
                item?._id !== slug &&
                item?.category === detailsData?.data[0]?.category && (
                  <Card
                    key={index}
                    onClick={() => router.push(`/view-product/${item?._id}`)}
                  >
                    <CardActionArea>
                      <div className="p-4">
                        <Image
                          alt={item?.name}
                          height={200}
                          width={300}
                          src={
                            String(item?.productImage[0]).includes("files") &&
                            !String(item?.productImage[0]).includes("bucket.s3")
                              ? `${process.env.REACT_APP_BASE_PATH}${item?.productImage[0]}`
                              : item?.productImage[0]
                          }
                          className="object-contain w-full h-[10rem]"
                        />
                        <div className="flex flex-col items-center mt-4 justify-center">
                          <div className="font-semibold flex flex-row">
                            Category: {detailsData?.data[0]?.category}
                          </div>
                          <p className="prod-p mt-2">{item.name}</p>
                        </div>
                      </div>
                    </CardActionArea>
                  </Card>
                )
            )
          ) : (
            <div className="text-lg font-semibold p-8 text-center col-span-5">
              No related products found.
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
