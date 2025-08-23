import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useProjectMutations = () => {
  const qc = useQueryClient();

  const updateProject = useMutation({
    mutationFn: data => api.patch('/project/update', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projectDetail'] }),
  });

  const uploadDocument = useMutation({
    mutationFn: ({ formData, id }) =>
      api.patch(`/project/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projectDetail'] }),
  });

  const addStep = useMutation({
    mutationFn: data => api.post('/project/step', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projectDetail'] }),
  });

  const deleteStep = useMutation({
    mutationFn: id => api.delete(`/project/step/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projectDetail'] }),
  });

  return { updateProject, uploadDocument, addStep, deleteStep };
};
