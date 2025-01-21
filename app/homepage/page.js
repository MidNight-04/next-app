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
      <Image
        // src={"/assets/jamar-penny-ZgmGq_eFmUs-unsplash.jpg"}
        src={"/assets/profilebg.jpg"}
        width={1300}
        height={1000}
        className="h-[calc(100vh-64px)] w-full top-0 left-0 object-cover -md:h-[55vh]"
        alt="hero"
        loading="eager"
      />
      <div className="px-4 py-2 flex flex-row justify-between">
        <h4 className="font-bold xl:text-2xl pl-4 -xl:font-semibold">
          Categories
        </h4>
        <div className="[&_svg]:hover:text-yellow-500 [&_p]:hover:text-yellow-500">
          <Link href="/all-categories">
            <span className="text-black font-semibold group transition duration-300">
              <p className="inline-block mr-2 mb-0">View more</p>
              <EastIcon />
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
            </span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-7 px-6 mb-4  xl:gap-4 -xl:gap-2 w-100 -2xl:px-2 -2xl:grid-cols-4 -sm:grid-cols-2">
        {!categoriesIsLoading &&
          categoriesData?.slice(0, 7).map(
            (item, index) =>
              item.active && (
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                  key={index}
                >
                  <CardActionArea
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
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
                  </CardActionArea>
                </Card>
              )
          )}
      </div>
      <div className="px-4 py-2 flex flex-row justify-between">
        <h4 className="font-bold xl:text-2xl pl-4 -xl:font-semibold">
          Products
        </h4>
        <div className="[&_svg]:hover:text-yellow-500 [&_p]:hover:text-yellow-500">
          <Link href="/all-products">
            <span className="text-black font-semibold group transition duration-300">
              <p className="inline-block mr-2 mb-0">View more</p>
              <EastIcon />
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
            </span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 w-100 h-full px-6 -2xl:px-2 -2xl:grid-cols-4 -md:grid-cols-3 -sm:grid-cols-2">
        {!featuredDataIsLoading &&
          featuredData?.data
            ?.sort(sortByProductCommission)
            ?.slice(0, 20)
            .map(
              (item, index) =>
                item.approvalStatus === "Approved" &&
                item.userStatus === "active" && (
                  <div
                    className="cursor-pointer mb-4 text-black bg-cyan-50 rounded-2xl"
                    key={index}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <CardActionArea
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          alignContent: "center",
                          background: "#E9EAEC",
                        }}
                        onClick={() => router.push(`/view-product/${item._id}`)}
                      >
                        <div className="text-black mb-2 flex flex-row justify-between gap-1 items-center  mr-auto p-2">
                          <div className="font-semibold -xl:text-sm ">
                            Product Category:
                          </div>
                          <div className="text-sm font-semibold text-yellow-500">
                            {item?.category ? item?.category : "Not Available"}
                          </div>
                        </div>
                        <Image
                          height={500}
                          width={500}
                          src={item?.productImage[0]}
                          alt="img"
                          className="h-80 w-full object-cover -xl:h-56 -sm:h-32"
                          loading="lazy"
                        />
                        <div className="flex flex-row gap-2 items-center p-2 w-full">
                          <div className="font-semibold text-black -xl:text-sm -xl:truncate">
                            {item?.name}
                          </div>
                          <div className="text-black text-lg flex font-semibold -xl:text-sm border-[1px] border-[#eab308] ml-auto items-end rounded-lg px-2 py-1">
                            <div>
                              <CurrencyRupeeIcon />
                              {item.price}
                            </div>
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                  </div>
                )
            )}
      </div>

      <div className="px-4 py-2 flex flex-row justify-between">
        <h4 className="font-bold xl:text-2xl pl-4 -xl:font-semibold">
          Designs
        </h4>
        <div className="[&_svg]:hover:text-yellow-500 [&_p]:hover:text-yellow-500">
          <Link href="/design-your-home">
            <span className="text-black font-semibold group transition duration-300 ">
              <p className="inline-block mr-2 mb-0">View more</p>
              <EastIcon />
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black" />
            </span>
          </Link>
        </div>
      </div>
      {/* <div className="flex flex-row flex-auto flex-wrap gap-2 w-100 px-6"> */}
      <div className="grid grid-cols-5 gap-2 w-100 h-full px-6 -2xl:px-2 -2xl:grid-cols-4 -md:grid-cols-3 -sm:grid-cols-2 mb-4">
        {!featuredDesignIsLoading &&
          featuredDesign?.data.slice(0, 20).map(
            (item, index) =>
              item.approvalStatus === "Approved" &&
              item.userStatus === "active" && (
                <div
                  className="cursor-pointer h-full bg-cyan-50 rounded-2xl"
                  key={index}
                >
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        router.push(`/design-your-home/${item?._id}`)
                      }
                      className="text-black"
                    >
                      {item?.twoDImage[index] ||
                      (item?.threeDImage[index] &&
                        item?.twoDImage[index].match(
                          /jpg|jpeg|png|gif|webp/
                        )) ? (
                        <Image
                          height={0}
                          width={500}
                          src={`/assets${item?.twoDImage[index]}`}
                          alt="img"
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
                        />
                      )}
                      <div className="mt-2 font-semibold mb-1 px-3 truncate">
                        {`${item.plotLength}X${item.plotWidth} ${item.title}`}
                      </div>
                      <div className="flex flex-row justify-between md:px-2 py-1 bg-blue-100 rounded-[6px] -md:px-1 mb-2 mx-2 ">
                        <div className="flex flex-row gap-1 items-center">
                          <AiOutlineExpandAlt className="text-red-500 text-2xl -md:text-xl" />
                          {parseInt(item.plotLength) * parseInt(item.plotWidth)}
                          sqft
                        </div>
                        <div className="flex flex-row gap-1 items-center">
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
      <Footer />
    </>
  );
};

export default Page;
