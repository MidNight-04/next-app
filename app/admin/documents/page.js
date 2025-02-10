"use client";
import { useEffect, useRef, useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
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
import { GrUpdate } from "react-icons/gr";
import { MdOutlineFileDownload } from "react-icons/md";
import { styled } from "@mui/material/styles";

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

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    "backgroundColor": "#f8fbfc",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    "backgroundColor": "#eee9da",
    "&:hover": {
      "backgroundColor": "#93bfcf",
      "color": "#eee9da",
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#93bfcf",
    },
  },
}));

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
    {
      field: "seriel",
      headerName: "S. No.",
      width: 140,
    },
    { field: "name", headerName: "Name", width: 300 },
    { field: "siteID", headerName: "Site ID", width: 100 },
    { field: "uploadedby", headerName: "Uploaded By", width: 233 },
    { field: "date", headerName: "Date", width: 233 },
    { field: "status", headerName: "Status", width: 233 },
  ];

  useEffect(() => {
    getAllDocument();
  }, [id]);

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
      date: new Date(row?.updatedAt).toDateString(),
      status: row?.status,
      document: row?.document[0],
    });
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 335,
      renderCell: params => {
        return (
          <div>
            <Button
              variant="outlined"
              size="small"
              sx={{
                "borderRadius": "16px",
                "marginRight": "4px",
                "borderColor": "#0b192c",
                "& span": {
                  color: "#0b192c",
                },
              }}
              onClick={() =>
                handleDocumentUpdateDialog(
                  params?.row?.id,
                  params?.row?.clientID
                )
              }
            >
              <span className="flex flex-row gap-2 items-center">
                <GrUpdate />
                Update Status
              </span>
            </Button>
            <a ref={linkRef} style={{ display: "none" }}></a>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: "16px", borderColor: "#0b192c" }}
              onClick={() => handleViewDocumentDialog(params?.row?.document)}
            >
              <span className="flex flex-row gap-2 items-center text-secondary">
                <MdOutlineFileDownload />
                Download
              </span>
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
      <div className=" flex justify-center items-center">
        <div className="bg-white rounded-3xl h-90vh w-full">
          <StripedDataGrid
            rows={arrayData}
            columns={columns.concat(actionColumn)}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowClassName={params =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            localeText={{ noRowsLabel: "No Data Available..." }}
            sx={{
              "fontFamily": "ubuntu",
              "fontSize": "16px",
              ".MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-filler": { background: "#0b192c" },
              "& .MuiDataGrid-columnHeaderTitle": { color: "#93bfcf" },
              "& .MuiDataGrid-menuOpen": { background: "#0b192c" },
              "&.MuiDataGrid-root": {
                borderRadius: "16px",
                // color: "#93bfcf",
                background: "#0b192c",
              },
              "& .MuiDataGrid-columnHeader": {
                background: "#0b192c",
                color: "#93bfcf",
              },
              "& .MuiDataGrid-columnHeader--sortable": {
                color: "#93bfcf",
              },
              "& .MuiDataGrid-withBorderColor": {
                color: "#93bfcf",
              },
              "& .MuiDataGrid-menuIcon": {
                background: "#0b192c",
                color: "#93bfcf",
              },
              "& .MuiDataGrid-columnHeaders": {
                background: "#0b192c",
                color: "#93bfcf",
              },
              "& .MuiDataGrid-sortIcon": {
                opacity: "inherit !important",
                color: "#93bfcf",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                background: "#0b192c",
                color: "#93bfcf",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "& .MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar":
                {
                  display: "none",
                },
              "& .MuiToolbar-root ": {
                color: "#93bfcf",
              },
              "& .MuiButtonBase-root": {
                color: "#93bfcf",
              },
              "& .MuiDataGrid-overlay": {
                background: "#eee9da",
                color: "#0b192c",
              },
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
        </div>
      </div>

      {/* update document accepted status by client dialog */}
      <Modal
        open={documentStatusOpen}
        onClose={handleDocumentStatusClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="w-1/3 -md:w-11/12 bg-white p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-center font-ubuntu mb-4">
            Update Document Status
          </h2>
          <FormControl fullWidth className="mt-1 mb-1">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              label="Status"
              id="status-select"
              value={status}
              name="status"
              onChange={e => setStatus(e.target.value)}
              sx={{ borderRadius: "16px", background: "#f3f4f6" }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <div className="flex flex-row gap-4 mt-4 justify-end">
            <button
              onClick={handleDocumentStatusClose}
              className="border-2 cursor-pointer font-semibold text-secondary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-transparent border-secondary -md:px-4 -md:py-2 -md:text-sm hover:bg-secondary hover:text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleDocumentStatusUpdate}
              className="border-2 cursor-pointer font-semibold text-primary font-ubuntu text-sm px-4 py-2 rounded-3xl bg-secondary border-secondary -md:px-4 -md:py-2 -md:text-sm"
            >
              Update Document Status
            </button>
          </div>
        </div>
      </Modal>

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
