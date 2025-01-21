import axios from "axios";

export const postEndpoint = async ({ data, endpoint }) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_PATH}/api/${endpoint}`,
    data
  );
  return response.data;
};
export const getAuthEndpoint = async ({ data, endpoint }) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_PATH}/api/auth/${endpoint}`,
    data
  );
  return response.data;
};

export const postCategoryList = async () => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_PATH}/api/admin/category/list`
  );
  return response.data.data;
};
export const getCategoryList = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_PATH}/api/admin/category/list`
  );
  return response.data.data;
};

export const postDealerEndpoint = async ({ endpoint, data }) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_PATH}/api/dealer/${endpoint}`,
    data
  );

  return response.data;
};

export const getDealerEndpoint = async ({ endpoint, data }) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_PATH}/api/dealer/${endpoint}`,
    data
  );
  return response.data;
};

export const postUserEndpoint = async ({ endpoint, data }) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_PATH}/api/user/${endpoint}`,
    data
  );
  return response.data;
};

export const getUserEndpoint = async ({ endpoint, data }) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_PATH}/api/user/${endpoint}`,
    data
  );
  return response.data;
};

export const postNotificationEndpoint = async ({ data }) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_PATH}/api/notification/createNotification`,
    data
  );
  return response.data;
};

export const getClientEndpoint = async ({ endpoint, data }) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_PATH}/api/client/${endpoint}`
  );
  return response.data;
};
