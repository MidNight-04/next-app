"use client";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Chip,
  Button,
  Modal,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Document, pdfjs } from "react-pdf";
import AsideContainer from "../../../components/AsideContainer";
import { useAuthStore } from "../../../store/useAuthStore";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 25,
  p: 4,
};

const Page = () => {
  const linkRef = useRef(null);
  const [document, setDocument] = useState([]);
  const id = useAuthStore(state => state.userId);

  const [documentStatusOpen, setDocumentStatusOpen] = useState(false);
  const [documentViewOpen, setDocumentViewOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [pdfURL, setPdfURL] = useState("");

  const columns = [
    { field: "seriel", headerName: "SNo.", width: 80 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "siteID", headerName: "SiteID", width: 120 },
    { field: "uploadedby", headerName: "Uploaded By", width: 220 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  useEffect(() => {
    getAllDocument();
  }, []);

  const getAllDocument = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/client/project-document/byclient/${id}`
      )
      .then(response => {
        setDocument(response?.data?.data);
        // console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleDocumentUpdateDialog = (documentId, clientid) => {
    // alert(documentId)
    setDocumentID(documentId);
    setDocumentStatusOpen(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_PATH}/api/client/project-document/byid/${documentId}`
      )
      .then(response => {
        setStatus(response?.data?.data[0]?.status);
        setCurrentStatus(response?.data?.data[0]?.status);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDocumentStatusClose = () => {
    setDocumentStatusOpen(false);
  };

  const handleViewDocumentDialog = doc => {
    const pdfUrl = doc;
    linkRef.current.href = pdfUrl;
    linkRef.current.download = "document.pdf";
    linkRef.current.click();
  };
  const handleViewDocumentCancel = () => {
    setDocumentViewOpen(false);
  };

  const handleDocumentStatusUpdate = () => {
    if (currentStatus === "Accepted") {
      toast.warning("Client already accepted document", {
        position: "top-center",
      });
    } else {
      const data = {
        id: documentID,
        status: status,
      };
      axios
        .put(
          `${process.env.REACT_APP_BASE_PATH}/api/client/project-document/update-statusbyclient`,
          data
        )
        .then(response => {
          setStatus("");
          setCurrentStatus("");
          toast.success(response?.data?.message, {
            position: "top-center",
          });
          getAllDocument();
        })
        .catch(error => {
          toast.error("Error while update status", {
            position: "top-center",
          });
          console.log(error);
        });
    }
    setDocumentStatusOpen(false);
  };

  const arrayData = [];
  document?.map((row, index) => {
    return arrayData.push({
      id: row?._id,
      siteID: row?.siteID,
      clientID: row?.clientID,
      seriel: index + 1,
      name: row?.name,
      uploadedby: row?.uploadingUserName,
      date: row?.updatedAt,
      status: row?.status,
      document: row?.document[0],
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 280,
      renderCell: params => {
        return (
          <div>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: "16px", marginRight: "4px" }}
              onClick={() =>
                handleDocumentUpdateDialog(
                  params?.row?.id,
                  params?.row?.clientID
                )
              }
            >
              Update Status
            </Button>
            <a ref={linkRef} style={{ display: "none" }}></a>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: "16px" }}
              onClick={() => handleViewDocumentDialog(params?.row?.document)}
            >
              Download
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <AsideContainer>
      <h1 className="text-[25px] font-ubuntu font-bold my-2 -md:text-lg">
        Project Document List
      </h1>
      <div className="bg-white p-8 rounded-3xl h-90vh -lg:p-4">
        <DataGrid
          rows={arrayData}
          columns={columns.concat(actionColumn)}
          pageSize={10}
          rowsPerPageOptions={[10]}
          localeText={{ noRowsLabel: "No Data Available..." }}
        />
      </div>

      {/* update document accepted status by client dialog */}
      <Dialog open={documentStatusOpen} onClose={handleDocumentStatusClose}>
        <DialogTitle>Update Document Status</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <FormControl fullWidth className="mt-1 mb-1">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDocumentStatusClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDocumentStatusUpdate} color="primary">
            Update Document Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* view document content dialog */}
      {/* <Dialog open={documentViewOpen} onClose={handleViewDocumentCancel}>
          <DialogTitle>View Document</DialogTitle>
          <DialogContent style={{ width: "600px" }}>
            <iframe src={pdfURL} width="100%"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewDocumentCancel} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog> */}
    </AsideContainer>
  );
};

export default Page;
