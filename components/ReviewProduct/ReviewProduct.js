import * as yup from "yup";
import { Field, Form, Formik, useField } from "formik";
import { Button, Card, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserEndpoint, postUserEndpoint } from "../../helpers/endpoints";

const labels = {
  0: "",
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};
function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const style = { color: "red", fontSize: ".75rem", paddingLeft: ".25rem" };

const StarComponent = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [hover, setHover] = useState(0);
  return (
    <div style={{ position: "relative" }}>
      <Rating
        name="rating"
        defaultValue={0}
        getLabelText={getLabelText}
        size="large"
        sx={{ fontSize: "8rem" }}
        icon={<StarIcon sx={{ fontSize: "2rem" }} />}
        emptyIcon={<StarIcon sx={{ fontSize: "2rem", opacity: ".5" }} />}
        onChangeActive={(e, newHover) => {
          setHover(newHover);
        }}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div style={{ ...style, marginTop: "-0.5rem" }}>{meta.error}</div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: ".1rem",
          left: "12rem",
          fontSize: "1.25rem",
        }}
      >
        {labels[hover >= 0 ? hover : meta.value]}
      </div>
    </div>
  );
};
const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <textarea
        {...field}
        {...props}
        style={{
          padding: ".5rem",
          width: "100%",
          height: "10rem",
          minHeight: "10rem",
          maxHeight: "10rem",
          overflow: "none",
          border: "1px solid gray",
          borderRadius: "6px",
        }}
      />
      {meta.comments && meta.comments ? <div>{meta.comments}</div> : null}
    </>
  );
};

const reviewSchema = yup.object({
  rating: yup.number().required("Rating is required."),
  title: yup
    .string("Enter your review")
    .min(2, "Review should be of minimum 20 characters length.")
    .max(50, "Review should be of below 50 characters length.")
    .required("Title is required."),
  comments: yup
    .string("Enter your review")
    .min(5, "Review should be of minimum 50 characters length.")
    .max(200, "Review should be of below 200 characters length.")
    .required("Comment is required."),
});

const ReviewProduct = ({ userId, productId, handleReviewClose }) => {
  const { userData, userDataIsLoading } = useQuery({
    queryKey: [`singleProfile/${userId}`],
    queryFn: () =>
      getUserEndpoint({
        endpoint: `single-profile/${userId}`,
      }),
  });
  const postProductReviewMutation = useMutation({
    mutationFn: async data => {
      await postUserEndpoint({
        endpoint: "post-product-rating",
        data,
      });
    },
    onSuccess: () => {
      toast("Your review has been successfully posted");
      handleReviewClose();
    },
    onError: () => toast("Some error occured, while getting user data"),
  });

  const addNewRating = formData => {
    try {
      if (!userDataIsLoading) {
        const data = {
          productid: productId,
          username: userData?.data?.data?.username,
          userId: userId,
          date: new Date(),
          ...formData,
        };
        postProductReviewMutation.mutate(data);
      }
    } catch (err) {
      console.log(err);
      toast("Some error occured");
    }
  };

  return (
    <Card
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        boxShadow: 24,
        p: 4,
      }}
    >
      <div className="datatable">
        <div
          className="datatableTitle"
          style={{
            color: "black",
            fontSize: "2rem",
          }}
        >
          Rate this product
        </div>
        <Formik
          initialValues={{
            comments: "",
            title: "",
            rating: null,
          }}
          validationSchema={reviewSchema}
          onSubmit={values => {
            addNewRating(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <StarComponent id="rating" name="rating" />
              <hr />
              <div className="mt-4">
                <label htmlFor="title" className="datatableTitle fs-5">
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  placeholder="Enter Title"
                  style={{
                    padding: ".5rem",
                    width: "100%",
                    border: "1px solid gray",
                    borderRadius: "6px",
                  }}
                />
                {errors.title && touched.title ? (
                  <div style={style}>{errors.title}</div>
                ) : null}
              </div>
              <div className="my-4">
                <label htmlFor="description">Write Review</label>
                <TextArea
                  id="comments"
                  name="comments"
                  placeholder="Enter your Review"
                />
                {errors.comments && touched.comments ? (
                  <div
                    style={{
                      ...style,
                      marginTop: "-6px",
                    }}
                  >
                    {errors.comments}
                  </div>
                ) : null}
              </div>
              <Button
                variant="outlined"
                type="submit"
                sx={{
                  "marginTop": ".5rem",
                  "background": "black",
                  "color": "white",
                  "borderColor": "black",
                  "&:hover": {
                    color: "black",
                    background: "#ffc107",
                    borderColor: "#ffc107",
                  },
                }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                sx={{
                  "marginTop": ".5rem",
                  "marginLeft": ".75rem",
                  "background": "white",
                  "color": "red",
                  "borderColor": "red",
                  "&:hover": {
                    color: "white",
                    background: "red",
                    borderColor: "red",
                  },
                }}
                onClick={handleReviewClose}
              >
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
};

export default ReviewProduct;
