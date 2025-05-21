"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import AsideContainer from "../../../../components/AsideContainer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FiDownload } from "react-icons/fi";

const ConstructionStepForm = () => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState();
  const [points, setPoints] = useState("");
  const router = useRouter();

  const submitFormData = () => {
    // console.log(role)
    if (!name) {
      toast("Name is required");
    } else if (!priority) {
      toast("Priority is required");
    } else if (!points) {
      toast("Points is required");
    } else {
      // console.log(process,points);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("priority", priority);
      formData.append("file", points);
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/constructionstep/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(resp => {
          toast(`${response.data.message}`);
          setName("");
          setPriority("");
          // redirect("/admin/constructionstep");
        })
        .catch(err => {
          //   console.log(err);
          toast("Error while upload construction points");
        });
    }
  };

  const handleSampleDownload = () => {
    // Define headers as an array of arrays (e.g., [['Name', 'Age', 'Occupation']])
    const headers = [
      [
        "point",
        "content",
        "duration",
        "issueMember",
        "checkList",
        "checkListName",
      ],
    ];

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
    saveAs(dataBlob, "constructionstepsample.xlsx");
  };

  return (
    <AsideContainer className="single">
      <div className="flex flex-row justify-between my-4">
        <div className="flex flex-row items-center text-2xl font-bold gap-2 -md:text-lg">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
          />
          <h1>Add Contruction Step</h1>
        </div>
        <div className="flex flex-row items-center justify-end -md:text-xs">
          <button
            className="flex flex-row items-center p-2 px-3 font-ubuntu text-sm -md:text-xs font-semibold bg-secondary border-[1px] border-secondary text-primary rounded-full cursor-pointer"
            onClick={handleSampleDownload}
          >
            <FiDownload className="text-xl mr-1 -md:text-xs" />
            Download Sample Format
          </button>
        </div>
      </div>
      <div className="newContainer">
        <div className="box-body table-responsive">
          <table className="w-full" id="sampledata">
            <thead>
              <tr className="bg-secondary text-primary font-semibold text-lg -md:text-xs text-wrap py-5 rounded-t-3xl">
                <th className="py-5 rounded-tl-3xl">
                  <span>Point</span>
                </th>
                <th>
                  <span>Content</span>
                </th>
                <th>
                  <span>
                    Duration
                    <br />
                    (In Days)
                  </span>
                </th>
                <th>
                  <span>
                    Issue Member
                    <br />
                    (Devide by /)
                  </span>
                </th>
                <th>
                  <span>
                    Check List
                    <br />
                    (Yes/No)
                  </span>
                </th>
                <th className="py-5 rounded-tr-3xl">
                  <span>Check List Name</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-center -md:text-xs">
              <tr>
                <td className="p-5">1</td>
                <td>content-1</td>
                <td>2</td>
                <td>admin/sr.engineer</td>
                <td>no</td>
                <td className=" p-5">checklist-1</td>
              </tr>
              <tr className="bg-secondary-foreground">
                <td className="p-5">2</td>
                <td>content-2</td>
                <td>2</td>
                <td>admin/sr.engineer</td>
                <td>no</td>
                <td className="p-5">checklist-2</td>
              </tr>
              <tr>
                <td className="rounded-bl-3xl p-5">3</td>
                <td>content-3</td>
                <td>2</td>
                <td>admin/sr.engineer</td>
                <td>no</td>
                <td className="rounded-br-3xl p-5">checklist-3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-xl mt-8">
          <div className="grid grid-cols-2 gap-4 mb-4 -md:grid-cols-1">
            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>Name</label>
              <input
                className="h-[54px] border border-primary px-4 text-gray-600 outline-none rounded-[7px] bg-gray-100"
                value={name}
                type="text"
                placeholder="Enter step"
                name="name"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>Priority</label>
              <input
                className="h-[54px] border border-primary px-4  text-gray-600 outline-none rounded-[7px] bg-gray-100"
                value={priority}
                type="number"
                placeholder="Enter priority"
                name="priority"
                min={1}
                onChange={e => setPriority(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 [&_label]:font-semibold">
              <label>Points</label>
              <input
                type="file"
                name="points"
                onChange={e => setPoints(e.target.files[0])}
                className="w-full text-gray-400 text-sm bg-gray-100 border py-[6px] px-2 file:cursor-pointer cursor-pointer  file:rounded-[7px] border-primary file:py-2 file:px-3 file:mr-4 file:bg-primary-foreground file:border file:border-primary file:text-secondary file:hover:bg-secondary file:hover:text-primary rounded-[7px]"
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-end">
            <button
              className="border cursor-pointer font-semibold text-primary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-secondary border-secondary -md:px-4 -md:py-2 -md:text-sm"
              onClick={submitFormData}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default ConstructionStepForm;
