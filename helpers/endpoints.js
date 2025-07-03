import api from '../lib/api';
import axios from 'axios';

export const postEndpoint = async ({ data, endpoint }) => {
  const response = await api.post(`${endpoint}`, data);
  return response.data;
};

export const getAuthEndpoint = async ({ data, endpoint }) => {
  const response = await api.get(
    `/auth/${endpoint}`,
    data
  );
  return response.data;
};

export const postCategoryList = async () => {
  const response = await api.post(
    `/admin/category/list`
  );
  return response.data.data;
};
export const getCategoryList = async () => {
  const response = await api.get(
    `/admin/category/list`
  );
  return response.data.data;
};

export const postDealerEndpoint = async ({ endpoint, data }) => {
  const response = await api.post(
    `/dealer/${endpoint}`,
    data
  );

  return response.data;
};

export const getDealerEndpoint = async ({ endpoint, data }) => {
  const response = await api.get(
    `/dealer/${endpoint}`,
    data
  );
  return response.data;
};

export const postUserEndpoint = async ({ endpoint, data }) => {
  const response = await api.post(
    `/user/${endpoint}`,
    data
  );
  return response.data;
};

export const getUserEndpoint = async ({ endpoint, data }) => {
  const response = await api.get(
    `/user/${endpoint}`,
    data
  );
  return response.data;
};

export const postNotificationEndpoint = async ({ data }) => {
  const response = await api.post(
    `/notification/createNotification`,
    data
  );
  return response.data;
};

export const getClientEndpoint = async ({ endpoint, data }) => {
  const response = await api.get(
    `/client/${endpoint}`
  );
  return response.data;
};
export const getTeamMemberEndpoint = async ({ endpoint, data }) => {
  const response = await api.get(
    `/teammember/${endpoint}`
  );
  return response.data;
};
