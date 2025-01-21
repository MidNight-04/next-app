"use client";
import { Box } from "@mui/material";
import dummyImageCad from "../../public/assets/dummy-image-cad.png";

const DownloadDesign = ({
  paid,
  cadImage,
  designDetails,
  image,
  makePayment,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      {paid && cadImage == undefined ? (
        <div>
          <p>You need to pay to see the CAD design</p>
          <button
            className="btn btn-primary btn-sm mt-3"
            size="small"
            variant="contained"
            type="button"
            onClick={() =>
              makePayment(
                `${designDetails?.cadImagePrice}`,
                "INR",
                "Image Download",
                "Online",
                designDetails?.uploadingUser
              )
            }
          >
            Pay &#x20B9;{designDetails?.cadImagePrice} to Download
          </button>
        </div>
      ) : (
        <div>
          <img
            src={dummyImageCad}
            style={{ width: "100%", height: "100%" }}
            alt="design"
          />
          <a href={image} Download="Design Image">
            <button
              className="btn btn-primary btn-sm mt-3"
              size="small"
              variant="contained"
              type="button"
            >
              Download{" "}
            </button>
          </a>
        </div>
      )}
      ;
    </Box>
  );
};

export default DownloadDesign;
