"use client";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EastIcon from "@mui/icons-material/East";
import dummyImagePdf from "../../public/assets/dummy-image-pdf.jpg";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import {
  getCategoryList,
  postDealerEndpoint,
  postUserEndpoint,
} from "../../helpers/endpoints";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardActionArea } from "@mui/material";
import dynamic from "next/dynamic";
import Slider from "../../components/Slider";
import { MdArrowOutward } from "react-icons/md";
const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const [
    { data: categoriesData, isLoading: categoriesIsLoading },
    { data: featuredData, isLoading: featuredDataIsLoading },
    { data: featuredDesign, isLoading: featuredDesignIsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: getCategoryList,
      },
      {
        queryKey: ["products"],
        queryFn: () =>
          postDealerEndpoint({
            endpoint: "products/all",
          }),
      },
      {
        queryKey: ["designs"],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "filterDesign",
          }),
      },
    ],
  });

  const sortByProductCommission = (a, b) => {
    const aPrice = a.price || "";
    const bPrice = b.price || "";

    if (a.productCommission === "" && b.productCommission !== "") {
      return 1;
    } else if (a.productCommission !== "" && b.productCommission === "") {
      return -1;
    } else if (a.productCommission !== b.productCommission) {
      return b.productCommission - a.productCommission;
    } else {
      if (aPrice === "" && bPrice !== "") {
        return 1;
      } else if (aPrice !== "" && bPrice === "") {
        return -1;
      } else if (aPrice !== "" && bPrice !== "") {
        return aPrice.localeCompare(bPrice);
      } else {
        return 0;
      }
    }
  };

  return (
    <>
      <Header />
      {/* <Image
        // src={"/assets/jamar-penny-ZgmGq_eFmUs-unsplash.jpg"}
        src={"/assets/profilebg.jpg"}
        width={1300}
        height={1000}
        className="h-[calc(100vh-64px)] w-full top-0 left-0 object-cover -md:h-[55vh]"
        alt="hero"
        loading="eager"
      /> */}
      <Slider />
      <main className="bg-gray-100">
        <section id="categories">
          <div className="px-4 pb-4 flex flex-row justify-between">
            <h4 className="font-bold pl-4 -xl:font-semibold font-ubuntu text-4xl">
              Categories
            </h4>
            <div className="[&_svg]:hover:text-primary [&_p]:hover:text-primary">
              <Link href="/all-categories">
                <div className="text-secondary font-semibold group transition duration-300">
                  <span className="flex flex-row items-center">
                    <p className="inline-block mr-2 mb-0">View more</p>
                    <MdArrowOutward className="text-xl" />
                  </span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
                </div>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-7 px-6 mb-4  xl:gap-4 -xl:gap-2 w-100 -2xl:px-2 -2xl:grid-cols-4 -sm:grid-cols-2">
            {!categoriesIsLoading &&
              categoriesData?.slice(0, 7).map(
                (item, index) =>
                  item.active && (
                    <div key={index}>
                      <div className="bg-white">
                        <Image
                          quality={100}
                          height={500}
                          width={500}
                          className="h-48 w-48 -xl:h-32 -xl:w-32 -sm:h-40 -sm:w-auto object-cover"
                          src={item?.categoryImage[0]}
                          alt="img"
                          loading="lazy"
                        />
                        <div className="text-lg font-semibold text-center p-1 -2xl:text-sm -lg:text-xs">
                          <div>{item.name}</div>
                        </div>
                      </div>
                    </div>
                  )
              )}
          </div>
        </section>
        <section id="products">
          <div className="px-4 py-2 flex flex-row justify-between">
            <h4 className="font-bold pl-4 -xl:font-semibold font-ubuntu text-4xl">
              Products
            </h4>
            <div className="[&_svg]:hover:text-primary [&_p]:hover:text-primary">
              <Link href="/shop-material">
                <div className="text-secondary font-semibold group transition duration-300">
                  <span className="flex flex-row items-center">
                    <p className="inline-block mr-2 mb-0">View more</p>
                    <MdArrowOutward className="text-xl" />
                  </span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
                </div>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 w-100 h-full px-6 -2xl:px-2 -2xl:grid-cols-4 -md:grid-cols-3 -sm:grid-cols-2">
            {!featuredDataIsLoading &&
              featuredData?.data
                ?.sort(sortByProductCommission)
                ?.slice(0, 10)
                .map(
                  (item, index) =>
                    item.approvalStatus === "Approved" &&
                    item.userStatus === "active" && (
                      <div
                        className="cursor-pointer my-5 text-black bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:scale-105 transition duration-300"
                        key={index}
                      >
                        <span className="text-secondary mb-2 text-end gap-1 items-center bg-primary -mt-5 rounded-md font-ubuntu text-sm p-2 float-end mr-2">
                          Product Category:{" "}
                          {item?.category ? item?.category : "Not Available"}
                        </span>
                        <div
                          className="p-6"
                          onClick={() =>
                            router.push(`/view-product/${item._id}`)
                          }
                        >
                          <div className="border border-gray-200 rounded-lg overflow-clip">
                            <Image
                              height={500}
                              width={500}
                              src={item?.productImage[0]}
                              alt="img"
                              className="h-80 w-full object-cover -xl:h-56 -sm:h-32"
                              loading="lazy"
                            />
                          </div>
                          <div className="font-bold text-black -xl:text-sm -xl:truncate mt-2">
                            {item?.name}
                            <div className="text-primary">
                              Price:
                              <CurrencyRupeeIcon sx={{ fontSize: "14px" }} />
                              {item.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
          </div>
        </section>
        <div className="px-4 py-2 flex flex-row justify-between">
          <h4 className="font-bold pl-4 -xl:font-semibold font-ubuntu text-4xl">
            Designs
          </h4>
          <div className="[&_svg]:hover:text-primary [&_p]:hover:text-primary">
            <Link href="/design-your-home">
              <div className="text-secondary font-semibold group transition duration-300">
                <span className="flex flex-row items-center">
                  <p className="inline-block mr-2 mb-0">View more</p>
                  <MdArrowOutward className="text-xl" />
                </span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
              </div>
            </Link>
          </div>
        </div>
        {/* <div className="flex flex-row flex-auto flex-wrap gap-2 w-100 px-6"> */}
        <div className="grid grid-cols-3 gap-4 -xl:grid-cols-2 w-100 h-full px-6 -2xl:px-2 -md:grid-cols-1   mb-4">
          {!featuredDesignIsLoading &&
            featuredDesign?.data.slice(0, 10).map(
              (item, index) =>
                item.approvalStatus === "Approved" &&
                item.userStatus === "active" && (
                  <div
                    className="cursor-pointer text-black bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:scale-105 transition duration-300"
                    key={index}
                  >
                    <div
                      className="p-5 grid grid-cols-5 gap-2"
                      onClick={() =>
                        router.push(`/design-your-home/${item._id}`)
                      }
                    >
                      <div className="border col-span-2 border-gray-200 rounded-lg overflow-clip w-full object-cover">
                        {item?.twoDImage[index] ||
                        (item?.threeDImage[index] &&
                          item?.twoDImage[index].match(
                            /jpg|jpeg|png|gif|webp/
                          )) ? (
                          <Image
                            height={500}
                            width={500}
                            src={`/assets${item?.twoDImage[index]}`}
                            alt="img"
                            className="h-52 w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Image
                            height={500}
                            width={500}
                            alt="img"
                            src={dummyImagePdf}
                            className="h-24 w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="flex flex-col col-span-3 justify-between ml-2">
                        <div className="font-bold text-xl mb-1 text-wrap font-ubuntu truncate ">
                          {`${item.plotLength}X${item.plotWidth} ${item.title}`}
                        </div>
                        <div className="flex flex-row justify-between -md:text-sm text-primary font-semibold md:px-2 py-1 border border-gray-200 rounded-md -md:px-1  ">
                          <div className="flex flex-row gap-1 items-center ">
                            <AiOutlineExpandAlt className="text-xl -md:text-sm" />
                            Area:{" "}
                            {parseInt(item.plotLength) *
                              parseInt(item.plotWidth)}
                            sqft
                          </div>
                          <div className="flex flex-row gap-1 items-center">
                            <FaRetweet className="text-xl -md:text-sm" />
                            HxW: {`${item.plotLength}x${item.plotWidth}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
