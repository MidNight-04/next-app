// services/projectService.js
import api from '../lib/api';

// ✅ Queries
export const getProjectDetail = async slug => {
  const res = await api.get(`/project/databyid/${slug}`);
  return res?.data?.data?.[0] || null;
};

// ✅ Mutations
export const deleteStep = async ({ id, name }) => {
  const res = await api.put('/project/deletestep', { id, name });
  return res.data;
};

export const addPoint = async data => {
  const res = await api.put('/project/createnewpoint', data);
  return res.data;
};

export const deletePoint = async data => {
  const res = await api.put('/project/deletepoint', data);
  return res.data;
};

export const uploadDocument = async formData => {
  const res = await api.post(`admin/project-document/add`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    maxBodyLength: Infinity,
  });
  return res.data;
};

export const changeIssueMember = async data => {
  const res = await api.post('/project/changeissuemember', data);
  return res.data;
};

export const updateInspectionList = async data => {
  const res = await api.put('/project/inspectionlist', data);
  return res.data;
};
