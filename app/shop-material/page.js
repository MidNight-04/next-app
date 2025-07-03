'use client';
import React, { useEffect, useState } from 'react';
import imageUrl from '../../constant/imageUrl';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import api from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import {
  getCategoryList,
  postEndpoint,
  postDealerEndpoint,
} from '../../helpers/endpoints';
import { Button, Card, CardActionArea, styled } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('../../components/Header'), { ssr: false });
const Footer = dynamic(() => import('../../components/Footer'), { ssr: false });

const MyCheckbox = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-row gap-2">
      <input
        type="checkbox"
        value={value}
        name={label}
        onChange={e => {
          onChange(e.target.value);
        }}
        id={label}
      />
      <label htmlFor="myCheckbox" className="text-sm">
        {label}
      </label>
    </div>
  );
};

const Page = () => {
  // const { userData } = useSelector(store => store.userReducer);
  const userData = {};
  // const [featuredData, setFeaturedData] = useState([]);
  const [suitableLocation, setCity] = React.useState('');
  const [suitableCountry, setCountry] = React.useState('');
  const [suitableState, setState] = React.useState('');
  const [category, setCategory] = React.useState([]);
  const [searchCities, setSearchCities] = useState([]);
  const [searchStates, setSearchStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [showMoreDealer, setShowMoreDealer] = React.useState(false);
  const [showMoreCategory, setShowMoreCategory] = React.useState(false);
  const [showMoreCities, setShowMoreCities] = React.useState(false);
  const [showMoreStates, setShowMoreStates] = React.useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const router = useRouter();

  const [
    { data: categoriesData, isLoading: categoriesIsLoading },
    { data: featuredData, isLoading: featuredIsLoading },
    { data: statesData, isLoading: statesIsLoading },
    { data: citiesData, isLoading: citiesIsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: getCategoryList,
      },
      {
        queryKey: ['products'],
        queryFn: () =>
          postDealerEndpoint({
            endpoint: 'products/all',
          }),
      },
      {
        queryKey: ['states'],
        queryFn: () =>
          postEndpoint({
            endpoint: 'auth/getStates',
            data: {
              country_name: 'India',
            },
          }),
        enabled: false,
      },
      {
        queryKey: [`${selectedState}/cities`],
        queryFn: () =>
          postEndpoint({
            endpoint: 'getStates',
            data: {
              state_name: 'state',
            },
          }),
        enabled: false,
      },
    ],
  });

  const getStates = () => {
    api
      .post(`/auth/getStates`, {
        country_name: suitableCountry,
      })
      .then(resp => {
        const array = resp?.data?.states;
        array.unshift(
          array.splice(
            array.findIndex(elt => elt.name === suitableState),
            1
          )[0]
        );
        setStates(resp.data.states);
        setSearchStates(resp.data.states);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getCities = state => {
    api
      .post(`/auth/getCities`, {
        state_name: state,
      })
      .then(resp => {
        const array = resp?.data?.cities;
        array.unshift(
          array.splice(
            array.findIndex(elt => elt.name === suitableLocation),
            1
          )[0]
        );
        setCities(resp.data.cities);
        setSearchCities(resp.data.cities);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const filterLocationByState = e => {
    let query = e.target.value;
    if (query === '') {
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
    if (query === '') {
      setCities(searchCities);
    } else {
      updatedList = updatedList.filter(item => {
        return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setCities(updatedList);
    }
  };

  const handleSupplierChange = value => {
    const index = selectedSupplier.indexOf(value);
    if (index > -1) {
      setSelectedSupplier(prev => {
        const newSuppliers = [...prev];
        newSuppliers.splice(index, 1);
        return newSuppliers;
      });
    } else {
      setSelectedSupplier(prev => [...prev, value]);
    }
  };

  const handleCategoryChange = value => {
    const index = selectedCategory.indexOf(value);
    if (index > -1) {
      setSelectedCategory(prev => {
        const newCategory = [...prev];
        newCategory.splice(index, 1);
        return newCategory;
      });
    } else {
      setSelectedCategory(prev => [...prev, value]);
    }
  };

  const clearFilterData = () => {
    setSelectedCategory([]);
    setSelectedSupplier([]);
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };

  const sortByProductCommission = (a, b) => {
    const aPrice = a.price || ''; // Handle undefined or null by defaulting to empty string
    const bPrice = b.price || ''; // Handle undefined or null by defaulting to empty string

    if (a.productCommission === '' && b.productCommission !== '') {
      return 1; // Place null after non-null values
    } else if (a.productCommission !== '' && b.productCommission === '') {
      return -1; // Place null before non-null valuesz
    } else if (a.productCommission !== b.productCommission) {
      return b.productCommission - a.productCommission; // Sort by product commission
    } else {
      // If product commission are the same or both are null, sort by price
      if (aPrice === '' && bPrice !== '') {
        return 1; // Place null after non-null values
      } else if (aPrice !== '' && bPrice === '') {
        return -1; // Place null before non-null values
      } else if (aPrice !== '' && bPrice !== '') {
        return aPrice.localeCompare(bPrice); // Sort by price using localeCompare
      } else {
        return 0; // If both prices are null or empty, consider them equal
      }
    }
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-7 px-4 gap-4 -xl:grid-cols-5 -xl:gap-2 -lg:grid-cols-4 -md:grid-cols-3 mt-4">
        <aside id="default-sidebar" aria-label="Sidebar">
          <div className="flex flex-col justify-center items-center text-center text-lg text-white font-semibold w-full bg-blue-400 rounded-t-lg">
            Filters
          </div>
          <div className="bg-blue-200 p-4 rounded-b-lg">
            <div className="flex justify-center">
              <Button
                variant="contained"
                type="button"
                color="error"
                sx={{ width: '8rem' }}
                onClick={clearFilterData}
              >
                Clear Filter
              </Button>
            </div>
            <h6 className="my-2 font-semibold text-center">
              Filter by Supplier
            </h6>
            {!featuredIsLoading &&
            featuredData?.data.length > 0 &&
            showMoreDealer
              ? featuredData?.data
                  .filter(
                    (obj, index) =>
                      featuredData?.data.findIndex(
                        item => item.uploadingUserName === obj.uploadingUserName
                      ) === index
                  )
                  .slice(0, 5)
                  .map(
                    dealer =>
                      dealer?.userStatus === 'active' && (
                        <MyCheckbox
                          key={dealer.uploadingUser}
                          label={dealer.uploadingUserName}
                          value={dealer.uploadingUser}
                          onChange={handleSupplierChange}
                        />
                      )
                  )
              : featuredData?.data
                  .filter(
                    (obj, index) =>
                      featuredData?.data.findIndex(
                        item => item.uploadingUserName === obj.uploadingUserName
                      ) === index
                  )
                  .slice(0, 5)
                  .map(
                    dealer =>
                      dealer?.userStatus === 'active' && (
                        <MyCheckbox
                          key={dealer.uploadingUser}
                          label={dealer.uploadingUserName}
                          value={dealer.uploadingUser}
                          onChange={handleSupplierChange}
                        />
                      )
                  )}
            <div className="flex justify-center">
              <Button
                variant="text"
                size="small"
                onClick={() => setShowMoreDealer(!showMoreDealer)}
              >
                {showMoreDealer ? 'Show less' : 'Show more'}
              </Button>
            </div>
            <h6 className="my-2 font-semibold text-center">
              Filter by Category
            </h6>
            {!categoriesIsLoading &&
            categoriesData?.length > 0 &&
            showMoreCategory
              ? categoriesData.map(category => (
                  <MyCheckbox
                    key={category.name}
                    label={category.name}
                    value={category.name}
                    onChange={handleCategoryChange}
                  />
                ))
              : categoriesData
                  ?.slice(0, 5)
                  ?.map(category => (
                    <MyCheckbox
                      key={category.name}
                      label={category.name}
                      value={category.name}
                      onChange={handleCategoryChange}
                    />
                  ))}
            <div className="flex justify-center">
              <Button
                variant="text"
                size="small"
                onClick={() => setShowMoreCategory(!showMoreCategory)}
              >
                {showMoreCategory ? 'Show less' : 'Show more'}
              </Button>
            </div>
            {/* <FormControl margin="dense" size="small">
              <FormLabel id="demo-controlled-radio-buttons-group">
                Filter by State
              </FormLabel>

              <div className="checkbox-container">
                <input
                  type="search"
                  id="myCheckbox1"
                  onChange={filterLocationByState}
                />
              </div>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={selectedState}
                onChange={stateChangeHandler}
                sx={{
                  "& span": {
                    fontSize: "14px",
                    // paddingTop: "2px",
                    // paddingBottom: "2px",
                  },
                }}
              >
                {!statesIsLoading &&
                statesData?.states.length > 0 &&
                showMoreStates
                  ? statesData?.states.map((state, index) => (
                      <FormControlLabel
                        key={index}
                        value={state.name}
                        control={<BpRadio />}
                        label={state.name}
                      />
                    ))
                  : statesData?.states
                      .slice(0, 5)
                      ?.map((state, index) => (
                        <FormControlLabel
                          key={index}
                          value={state.name}
                          control={<BpRadio />}
                          label={state.name}
                        />
                      ))}
              </RadioGroup>
              <button
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => setShowMoreStates(!showMoreStates)}
              >
                {showMoreStates ? "Show less" : "Show more"}
              </button>
            </FormControl> */}
            {/* <div>
              <h6 className="mt-3">Filter by City</h6>
              <div className="checkbox-container">
                <input
                  type="search"
                  id="myCheckbox1"
                  onChange={filterLocationBySearch}
                />
              </div>
              {cities.length > 0 && showMoreCities
                ? cities?.map((city, index) => (
                    <div className="checkbox-container" key={index}>
                      <input
                        type="checkbox"
                        checked={city?.name === suitableLocation ? true : false}
                        name="city"
                        value={city?.name}
                        onChange={e => {
                          const data = {
                            category: category,
                            state: suitableState ? suitableState : "",
                            city: e.target.value,
                          };
                          setCity(e.target.value);
                          filterProduct(data);
                        }}
                        id={city?.name}
                      />
                      <label htmlFor="myCheckbox">{city?.name}</label>
                    </div>
                  ))
                : cities?.slice(0, 5)?.map((city, index) => (
                    <div className="checkbox-container" key={index}>
                      <input
                        type="checkbox"
                        checked={city?.name === suitableLocation ? true : false}
                        name="city"
                        value={city?.name}
                        onChange={e => {
                          const data = {
                            category: category,
                            state: suitableState ? suitableState : "",
                            city: e.target.value,
                          };
                          setCity(e.target.value);
                          filterProduct(data);
                        }}
                        id={city?.name}
                      />
                      <label htmlFor="myCheckbox">{city?.name}</label>
                    </div>
                  ))}
              <button
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => setShowMoreCities(!showMoreCities)}
              >
                {showMoreCities ? "Show less" : "Show more"}
              </button>
            </div> */}
          </div>
        </aside>
        <section className="col-start-2 col-span-6">
          <div className="grid grid-cols-4 gap-2 w-100 h-full -2xl:px-2 -2xl:grid-cols-3 -md:grid-cols-2 -sm:grid-cols-2">
            {!featuredIsLoading &&
              featuredData?.data.length > 0 &&
              featuredData?.data
                ?.sort(sortByProductCommission)
                .filter(item => {
                  if (selectedSupplier.length > 0) {
                    return selectedSupplier.includes(item.uploadingUser);
                  }
                  return true;
                })
                .filter(item => {
                  if (selectedCategory.length > 0) {
                    return selectedCategory.includes(item.category);
                  }
                  return true;
                })
                .map(item => {
                  return (
                    item.approvalStatus === 'Approved' &&
                    item.userStatus === 'active' && (
                      <div
                        className="cursor-pointer mb-4 text-black bg-cyan-50 rounded-2xl"
                        key={item._id}
                      >
                        <Card
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            alignContent: 'center',
                          }}
                        >
                          <CardActionArea
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              alignContent: 'center',
                              background: '#E9EAEC',
                            }}
                            onClick={() =>
                              router.push(`/view-product/${item._id}`)
                            }
                          >
                            <div className="text-black mb-2 flex flex-row gap-1 items-center w-full mr-auto p-2">
                              <div className="font-semibold -xl:text-sm ">
                                Product Category:
                              </div>
                              <div className="text-sm font-semibold text-yellow-500">
                                {item?.category
                                  ? item?.category
                                  : 'Not Available'}
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <Image
                                src={
                                  String(item?.productImage[0]).includes(
                                    'files'
                                  ) &&
                                  !String(item?.productImage[0]).includes(
                                    'bucket.s3'
                                  )
                                    ? `${process.env.BACKEND_BASE_URL}${item?.productImage[0]}`
                                    : item?.productImage[0]
                                }
                                alt={item?.name}
                                height={500}
                                width={500}
                                className="h-80 w-auto object-cover -xl:h-56 -sm:h-32"
                                loading="lazy"
                              />
                            </div>
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
                  );
                })}
            {featuredData?.data.length === 0 && (
              <h4 className="text-center mt-5">No Product Available</h4>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Page;
