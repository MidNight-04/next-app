"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AsideContainer from "../../../../components/AsideContainer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const ConstructionStepForm = () => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState();
  const [points, setPoints] = useState("");

  const submitFormData = () => {
    // console.log(role)
    if (!name) {
      toast.error("Name is required", {
        position: "top-center",
      });
    } else if (!priority) {
      toast.error("Priority is required", {
        position: "top-center",
      });
    } else if (!points) {
      toast.error("Points is required", {
        position: "top-center",
      });
    } else {
      // console.log(process,points)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("priority", priority);
      formData.append("points", points);
      axios
        .post(
          `${process.env.REACT_APP_BASE_PATH}/api/constructionstep/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(resp => {
          toast.success(resp.data.message, {
            position: "top-center",
          });
          setName("");
          setPriority("");
          // redirect("/admin/constructionstep");
        })
        .catch(err => {
          //   console.log(err);
          toast.error("Error while upload construction points", {
            position: "top-center",
          });
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
      {/* <AdminSidebar /> */}
      <div className="singleContainer">
        {/* <AdminNavbar /> */}
        <div className="adminNewUser">
          <div className="newContainer">
            <div
              className="topContainer"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h1>Add Contruction Step</h1>
              <Button
                variant="contained"
                size="small"
                style={{
                  backgroundColor: "green",
                  fontWeight: "600",
                }}
                className="mx-2 float-end"
                onClick={handleSampleDownload}
              >
                Download Sample Format
              </Button>
            </div>

            <div className="box-body table-responsive">
              <p className="text-center">
                <span className="fw-bold">Fields - </span>point, content,
                duration, issueMember, checkList, checkListName{" "}
              </p>
              <table
                className="table table-striped table-bordered table-hover m-4"
                id="sampledata"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Point</span>
                    </th>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Content</span>
                    </th>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Duration(In days)</span>
                    </th>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Issue Member(devide by /)</span>
                    </th>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Check List(yes/no)</span>
                    </th>
                    <th>
                      {/* <span className="text-danger">*</span> */}
                      <span>Check List Name</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>content1</td>
                    <td>2</td>
                    <td>admin/sr.engineer</td>
                    <td>no</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bottomContainer w-100">
              <div className="bottomRightContainer">
                <div className="form">
                  <div className="formInputContainer">
                    <label>
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      value={name}
                      type="text"
                      placeholder="Enter step"
                      name="name"
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Priority<span className="text-danger">*</span>
                    </label>
                    <input
                      value={priority}
                      type="number"
                      placeholder="Enter priority"
                      name="priority"
                      min={1}
                      onChange={e => setPriority(e.target.value)}
                    />
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Points<span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      name="points"
                      onChange={e => setPoints(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="createUserSubmitBTN" onClick={submitFormData}>
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

export default ConstructionStepForm;
