"use client";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import dummyImagePdf from "../../public/assets/dummy-image-pdf.jpg";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineExpandAlt } from "react-icons/ai";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { postEndpoint, postUserEndpoint } from "../../helpers/endpoints";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const [bedroom, setBedroom] = useState("");
  const [toilet, setToilet] = useState("");
  const [floor, setFloor] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vastu, setVastu] = useState("");
  const [stilt, setStilt] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [searchCities, setSearchCities] = useState([]);
  const [searchStates, setSearchStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const [
    { data: designData, isLoading: designIsLoading },
    { data: statesData, isLoading: statesIsLoading },
    { data: citiesData, isLoading: citiesIsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["design"],
        queryFn: () =>
          postUserEndpoint({
            endpoint: "filterDesign",
          }),
      },
      {
        queryKey: ["getStates"],
        queryFn: () =>
          postEndpoint({
            endpoint: "auth/getStates",
            data: {
              country: "India",
            },
          }),
      },
      {
        queryKey: [`${filterState}/cities`],
        queryFn: () =>
          postEndpoint({
            endpoint: "auth/getCities",
            data: {
              state_name: filterState,
            },
          }),
        enabled: !filterState ? false : true,
      },
    ],
  });

  const filterLocationByState = e => {
    let query = e.target.value;
    let updatedList = [...searchStates];
    // Include all the elements which inlcudes the search query
    if (query === "") {
      setStates(searchStates);
    } else {
      updatedList = updatedList.filter(item => {
        return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setStates(updatedList);
    }
  };

  const filterLocationBySearch = e => {
    let query = e.target.value;
    let updatedList = [...searchCities];
    // Include all the elements which inlcudes the search query
    if (query === "") {
      setCities(searchCities);
    } else {
      updatedList = updatedList.filter(item => {
        return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setCities(updatedList);
    }
  };

  const clearFilterData = () => {
    setFilterState("");
    setFilterCity("");
    setBedroom("");
    setToilet("");
    setFloor("");
    setBuildingType("");
    setPurpose("");
    setVastu("");
    setStilt("");
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <Header />
      <main className="flex flex-col">
        <section id="filters" className="w-full flex justify-center my-4">
          <div className="bg-blue-200 shadow-md p-4 rounded-lg min-w-2xl -lg:w-full">
            <div className="flex flex-row gap-2 justify-between w-full items-center -lg:flex-wrap -lg:justify-start -lg:[&_label]:text-xs -lg:[&_div]:text-xs">
              <div className="text-lg font-semibold text-nowrap">
                Select Filters
              </div>
              <FormControl
                sx={{ width: "7.5rem" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Bedrooms</InputLabel>
                <Select
                  labelId="select-standard-bedroom-label"
                  id="select-standard-bedroom"
                  value={bedroom}
                  onChange={e => setBedroom(e.target.value)}
                  label="Bedrooms"
                  size="small"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={`bedroom${i}`} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "90px" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Toilets</InputLabel>
                <Select
                  labelId="select-standard-toilet-label"
                  id="select-standard-toilet"
                  value={toilet}
                  onChange={e => setToilet(e.target.value)}
                  label="Toilet"
                  size="small"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={`toilet${i}`} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "80px" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Floor</InputLabel>
                <Select
                  labelId="select-standard-Floor-label"
                  id="select-standard-Floor"
                  value={floor}
                  onChange={e => setFloor(e.target.value)}
                  label="Floor"
                  size="small"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={`floor${i}`} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "140px" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Building Type</InputLabel>
                <Select
                  labelId="select-standard-buildingtype-label"
                  id="select-standard-Floor"
                  value={buildingType}
                  onChange={e => setBuildingType(e.target.value)}
                  label="Building Type"
                  size="small"
                >
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="ResclassNameintal">
                    ResclassNameintal
                  </MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Hospital">Hospital</MenuItem>
                  <MenuItem value="Mixed Use">Mixed Use</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "6.5rem" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Purpose</InputLabel>
                <Select
                  labelId="select-standard-vastu-label"
                  id="select-standard-vastu"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  label="vastu"
                  size="small"
                >
                  <MenuItem value="Rental">Rental</MenuItem>
                  <MenuItem value="Self Use">Self Use</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "84px" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Vastu</InputLabel>
                <Select
                  labelId="select-standard-vastu-label"
                  id="select-standard-vastu"
                  value={vastu}
                  onChange={e => setVastu(e.target.value)}
                  label="vastu"
                  size="small"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "80px" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">Stilt</InputLabel>
                <Select
                  labelId="select-standard-stilt-label"
                  id="select-standard-stilt"
                  value={stilt}
                  onChange={e => setStilt(e.target.value)}
                  label="Stilt"
                  size="small"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: "8rem" }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">State</InputLabel>
                <Select
                  labelId="select-standard-state-label"
                  id="select-standard-state"
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  label="State"
                  size="small"
                >
                  {statesData?.states.map(state => (
                    <MenuItem key={state.name} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  width: "8rem",
                  marginBottom: !filterState ? "-16px" : "0px",
                }}
                variant="outlined"
                size="small"
              >
                <InputLabel size="small">City</InputLabel>
                <Select
                  labelId="select-standard-City-label"
                  id="select-standard-City"
                  value={filterCity}
                  onChange={e => setFilterCity(e.target.value)}
                  label="City"
                  size="small"
                  disabled={!filterState && !citiesIsLoading}
                >
                  {citiesData?.cities.map(city => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {!filterState ? (
                  <div className="text-xs text-red-500 text-nowrap">
                    Select state first.*
                  </div>
                ) : (
                  ""
                )}
              </FormControl>
              <div className="flex justify-center">
                <Button
                  variant="contained"
                  type="button"
                  color="error"
                  sx={{ width: "8rem" }}
                  onClick={clearFilterData}
                >
                  Clear Filter
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="desings" className="col-start-2 col-span-6">
          <div className="grid grid-cols-5 gap-2 w-100 px-6 -2xl:px-2 -2xl:grid-cols-4 -md:grid-cols-3 -sm:grid-cols-2 mb-4">
            {designData?.data.length > 0 ? (
              <>
                {!designIsLoading &&
                  designData.data
                    ?.filter(item => {
                      if (bedroom > 0) {
                        return bedroom == item.numberOfBedrooms;
                      }
                      return true;
                    })
                    .filter(item => {
                      console.log(item.toilet);
                      if (toilet > 0) {
                        return toilet == item.numberOfToilets;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (floor > 0) {
                        return floor == item.numberOfFloor;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (buildingType.length > 0) {
                        return buildingType === item.buildingType;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (purpose.length > 0) {
                        return purpose == item.purpose;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (vastu.length > 0) {
                        return vastu === item.isVastu;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (stilt.length > 0) {
                        return stilt === item.isStiltdParking;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (filterState.length > 0) {
                        return filterState === item.serviceLocationState;
                      }
                      return true;
                    })
                    .filter(item => {
                      if (filterCity.length > 0) {
                        return filterCity === item.serviceLocationCity;
                      }
                      return true;
                    })
                    .map((item, index) => (
                      <Card key={index}>
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
                              height={200}
                              width={500}
                              alt="dummy"
                              className="h-72 object-cover w-full"
                            />
                          ) : (
                            <Image
                              height={200}
                              width={200}
                              alt="dummy"
                              // src={img2}
                              src={dummyImagePdf}
                              className="h-72 object-cover w-full"
                            />
                          )}
                          <div className="mt-2 font-semibold mb-1 px-3 truncate">
                            {`${item.plotLength}X${item.plotWidth} ${item.title}`}
                          </div>
                          <div className="flex flex-row justify-between md:px-2 py-1 bg-blue-100 rounded-[6px] -md:px-1 mx-2 mb-2">
                            <div className="flex flex-row gap-1 items-center">
                              <AiOutlineExpandAlt className="text-red-500 text-2xl -md:text-xl" />
                              {parseInt(item.plotLength) *
                                parseInt(item.plotWidth)}
                              sqft
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                              <FaRetweet className="text-red-500 text-2xl -md:text-xl" />
                              {`${item.plotLength}X${item.plotWidth}`}
                            </div>
                          </div>
                        </CardActionArea>
                      </Card>
                    ))}
              </>
            ) : (
              <h4 className="text-lg font-semibold">No Design Available</h4>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
