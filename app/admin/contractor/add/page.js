'use client'
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

const ContractorTable = () => {
  const router = useRouter();

  return (
    <AsideContainer>
      <div className="">
        <div className="flex flex-row justify-between items-center my-4">
          <IoIosArrowBack
            className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
            Add Contractor
          </h1>
        </div>
         <div className="bg-white rounded-[15px] p-5 mb-5">
          <div className="col-lg-12">
            <div>
              <div style={{ marginLeft: '0px' }}>
                <div>
                  <div className="grid grid-cols-2 gap-4 gap-x-8">
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Name</label>
                      <input
                        value={data.name}
                        type="text"
                        placeholder="Enter Name"
                        name="name"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Site ID</label>
                      <input
                        value={data.siteID}
                        type="text"
                        placeholder="Enter SiteID"
                        name="siteID"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Location</label>
                      <input
                        value={data.location}
                        type="text"
                        placeholder="Enter project location"
                        name="location"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                      <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="branch">Branch</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, branch: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Gurgaon'>Gurgaon</SelectItem>
                            <SelectItem value='Patna'>Patna</SelectItem>
                            <SelectItem value='Ranchi'>Ranchi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="client">Client</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, client: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientList?.map((item, index) => {
                            return (
                              <SelectItem key={index} value={item?._id}>
                                {item?.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Number of Floor</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, floor: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorList?.map((item, index) => (
                            <SelectItem key={index} value={item.name}>
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Select Floor Plan</label>
                      <Select
                        onValueChange={value =>
                          setData({ ...data, plan: value })
                        }
                      >
                        <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages?.map((item, index) => (
                            <SelectItem key={index} value={item._id}>
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Area</label>
                      <input
                        value={data.area}
                        type="text"
                        placeholder="Enter project area"
                        name="area"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Project Cost</label>
                      <input
                        value={data.cost}
                        type="number"
                        placeholder="Enter project cost"
                        name="cost"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Start Date</label>
                      <input
                        value={data.date}
                        type="date"
                        name="date"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label>Duration(In months)</label>
                      <input
                        value={data.duration}
                        type="number"
                        name="duration"
                        min={1}
                        placeholder="Enter Construction duration"
                        onChange={e => handleFormData(e)}
                        className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 font-semibold"
                      />
                    </div>
                    {/* <div className="formInputContainer col-lg-6">
                      <label htmlFor="role">
                        Flow Structure
                      </label>
                      
                    </div> */}
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Project Admin</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, admin: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm => itm.role?.name.toLowerCase() === 'admin'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Project Manager</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, manager: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === 'manager'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div> */}
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Architect</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, architect: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === 'architect'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Sr. Engineer</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, sr_engineer: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() ===
                                  'sr. engineer'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Site Engineer</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, engineer: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() ===
                                  'site engineer'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Accountant</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, accountant: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === 'accountant'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Operation</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, operation: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm =>
                                  itm.role?.name.toLowerCase() === 'operations'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Sales</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, sales: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberList
                              ?.filter(
                                itm => itm.role?.name.toLowerCase() === 'sales'
                              )
                              ?.map((item, index) => (
                                <SelectItem key={index} value={item._id}>
                                  {item?.name} ({item.employeeID})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 [&_label]:font-semibold">
                      <label htmlFor="role">Contractor</label>
                      <div>
                        <Select
                          onValueChange={value =>
                            setData({ ...data, contractor: value })
                          }
                        >
                          <SelectTrigger className="w-full border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100 h-[54px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractorList?.map((item, index) => (
                              <SelectItem key={index} value={item._id}>
                                {item?.name} ({item?.companyNameShopName})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-4"></div>
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    className="px-4 py-2 border border-secondary bg-secondary text-primary rounded-3xl cursor-pointer mt-4"
                    onClick={submitFormData}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default ContractorTable;
