import { Box, Button, Card } from "@mui/material";
import React from "react";
import * as yup from "yup";
import { Form, Formik, useField } from "formik";

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
          borderRadius: "6px",
          border: "1px solid gray",
        }}
      />
      {meta.comments && meta.comments ? (
        <div className="text-xs text-red-600">{meta.comments}</div>
      ) : (
        <div />
      )}
    </>
  );
};

const editDesignSchem = yup.object({
  comments: yup
    .string()
    .min(50, "Comment should be of minimum 50 characters length.")
    .max(500, "Comment should be of below 500 characters length.")
    .required("Comment/Notes is required."),
});

const EditDesign = ({ handler }) => {
  const submitHandler = formData => {
    handler(formData);
  };

  return (
    <Card
      sx={{
        position: "absolute",
        height: "auto",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "40%",
        bgcolor: "background.paper",
        boxShadow: 24,
        padding: 4,
      }}
    >
      <Formik
        initialValues={{
          comments: "",
        }}
        validationSchema={editDesignSchem}
        onSubmit={values => {
          submitHandler(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <h2 className="text-lg font-semibold">Edit Design Request</h2>
            <br />
            <TextArea
              id="comments"
              name="comments"
              placeholder="Enter your design requirements."
            />
            {errors.comments && touched.comments ? (
              <div className="text-xs text-red-600 mb-1">
                {errors.comments}*
              </div>
            ) : (
              <div className="h-4 mb-1" />
            )}
            <Button variant="contained" type="submit">
              Pay &#x20B9;20 and Submit Request
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default EditDesign;
