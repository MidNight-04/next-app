'use client';
import { Button } from '@mui/material';
import api from '../../../../lib/api';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';
import AsideContainer from '../../../../components/AsideContainer';

const AddPaymentStagesForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');
  const [points, setPoints] = useState('');
  const [floorList, setFloorList] = useState([]);
  const [floor, setFloor] = useState('');
  const [stages, setStages] = useState('');

  useEffect(() => {
    api
      .get(`/floor/getall`)
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
      toast('Floor is required');
    } else if (!stages) {
      toast('Payment stages is required');
    } else {
      // console.log(process,points)
      const formData = new FormData();
      formData.append('floor', floor);
      formData.append('stages', stages);
      api
        .post(
          `/paymentstages/add`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .then(resp => {
          toast(resp.data.message);
          setFloor('');
          setStages('');
          router.push('/admin/paymentstages/list');
        })
        .catch(err => {
          //   console.log(err);
          toast('Error while upload construction points');
        });
    }
  };

  const handleSampleDownload = () => {
    // Define headers as an array of arrays (e.g., [['Name', 'Age', 'Occupation']])
    const headers = [['payment', 'stages']];

    // Convert the headers array to a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(headers);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a binary Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert the buffer to a Blob
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    // Save the Blob as an Excel file
    saveAs(dataBlob, 'paymentstagesample.xlsx');
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
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <h1>Add Payment Stages</h1>
              <Button
                variant="contained"
                size="small"
                style={{
                  backgroundColor: 'green',
                  fontWeight: '600',
                }}
                className="mx-2 float-end"
                onClick={handleSampleDownload}
              >
                Download Sample Format
              </Button>
            </div>

            <div className="box-body table-responsive">
              <p className="text-center">
                <span className="fw-bold">Fields - </span>payment, stages
              </p>
              <table
                className="table table-striped table-bordered table-hover m-4"
                id="sampledata"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Payment(In %)</span>
                    </th>
                    <th>
                      <span className="text-danger">*</span>
                      <span>Stages</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1.5</td>
                    <td>Booking</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bottomContainer">
              <div className="bottomRightContainer">
                <div className="form">
                  <div className="formInputContainer">
                    <label>
                      Floor<span className="text-danger">*</span>
                    </label>
                    <select
                      style={{ width: '100%', height: '30px' }}
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
                    </select>
                  </div>
                  <div className="formInputContainer">
                    <label>
                      Stages<span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      name="stages"
                      onChange={e => setStages(e.target.files[0])}
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

export default AddPaymentStagesForm;
