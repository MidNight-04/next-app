"use client";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import AsideContainer from "../../../../components/AsideContainer";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { FiDownload } from "react-icons/fi";

const AddPaymentStagesForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [points, setPoints] = useState("");
  const [floorList, setFloorList] = useState([]);
  const [floor, setFloor] = useState("");
  const [stages, setStages] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_PATH}/api/floor/getall`)
      .then(response => {
        if (response) {
          //   console.log(response.data.data);
          setFloorList(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const submitFormData = () => {
    // console.log(role)
    if (!floor) {
      toast("Floor is required", {
        position: "top-center",
      });
    } else if (!stages) {
      toast("Payment stages is required", {
        position: "top-center",
      });
    } else {
      // console.log(process,points)
      const formData = new FormData();
      formData.append("floor", floor);
      formData.append("file", stages);
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/paymentstages/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(resp => {
          toast(resp.data.message, {
            position: "top-center",
          });
          setFloor("");
          setStages("");
          router.push("/admin/payment-stages");
        })
        .catch(err => {
          //   console.log(err);
          toast("Error while upload construction points", {
            position: "top-center",
          });
        });
    }
  };

  const handleSampleDownload = () => {
    // Define headers as an array of arrays (e.g., [['Name', 'Age', 'Occupation']])
    const headers = [["payment", "stages"]];

    // Convert the headers array to a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(headers);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Convert the buffer to a Blob
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    // Save the Blob as an Excel file
    saveAs(dataBlob, "paymentstagesample.xlsx");
  };

  return (
    <AsideContainer>
      {/* <AdminSidebar /> */}
      <div className="singleContainer">
        {/* <AdminNavbar /> */}
        <div className="adminNewUser">
          <div className="newContainer">
            <div
              className="topContainer"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="flex flex-row items-center justify-between w-full my-3">
                <div className="flex flex-row gap-2 items-center">
                  <IoIosArrowBack
                    className="text-2xl cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
                    onClick={() => router.back()}
                  />
                  <h1 className="text-2xl font-semibold font-ubuntu -md:mb-2 -md:text-lg">
                    Add Payment Stages
                  </h1>
                </div>
                <div className="flex flex-row items-center justify-end">
                  <button
                    className="flex flex-row items-center p-2 px-3 font-ubuntu text-sm font-semibold bg-secondary border-[1px] border-secondary text-primary rounded-full cursor-pointer"
                    onClick={handleSampleDownload}
                  >
                    <FiDownload className="text-xl mr-1" />
                    Download Sample Format
                  </button>
                </div>
              </div>
            </div>
            <div>
              <table className="w-full shadow-md rounded-3xl mb-4">
                <thead className="h-12 text-primary bg-secondary">
                  <tr>
                    <th className="rounded-tl-3xl">Payment (In %)</th>
                    <th className="rounded-tr-3xl">Stages</th>
                  </tr>
                </thead>
                <tbody className="text-center text-secondary font-semibold text-sm [&_tr]:h-14">
                  <tr className="bg-primary-foreground">
                    <td>1.5%</td>
                    <td>Before Initiation</td>
                  </tr>
                  <tr className="bg-secondary-foreground">
                    <td>15%</td>
                    <td>Booking</td>
                  </tr>
                  <tr className="bg-primary-foreground">
                    <td className="rounded-bl-3xl">15%</td>
                    <td className="rounded-br-3xl">After Piling</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white shadow-2xl p-5 rounded-3xl">
              <div className="flex flex-row w-full gap-4">
                <div className="w-full flex flex-col gap-2">
                  <label className="text-secondary text-lg font-semibold">
                    Floor<span className="text-red-500">*</span>
                  </label>
                  <Select
                    onValueChange={value => setFloor(value)}
                    className="h-12"
                  >
                    <SelectTrigger className="h-12 border border-primary px-4 text-gray-400 rounded-[7px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorList?.map((item, index) => {
                        return (
                          <SelectItem key={index} value={item.name}>
                            {item?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {/* <select
                      style={{ width: "100%", height: "30px" }}
                      className="mt-2"
                      name="floor"
                      value={floor}
                      onChange={e => setFloor(e.target.value)}
                    >
                      <option value="">Select</option>
                      {floorList?.map((item, index) => {
                        return (
                          <option key={index} value={index}>
                            {item?.name}
                          </option>
                        );
                      })}
                    </select> */}
                </div>
                <div className="w-full h-12 flex flex-col gap-2">
                  <label className="text-secondary text-lg font-semibold ">
                    Stages<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="stages"
                    onChange={e => setStages(e.target.files[0])}
                    className=" w-full text-gray-400 font-semibold text-sm bg-white border border-primary rounded-[7px] file:cursor-pointer cursor-pointer file:border-0 file:py-[14px] file:px-3 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end items-center mt-4">
                <div
                  className="p-2  font-semibold bg-secondary text-center border-[1px] border-secondary text-primary rounded-full cursor-pointer w-[84px] "
                  onClick={submitFormData}
                >
                  Submit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default AddPaymentStagesForm;
