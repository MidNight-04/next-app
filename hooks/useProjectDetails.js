// hooks/useProjectQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectService from '../services/projectService';

// ✅ Main query hook
export const useProjectDetailQuery = slug =>
  useQuery({
    queryKey: ['projectDetail', slug],
    queryFn: () => projectService.getProjectDetail(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ✅ Generic mutation hook with invalidation
const useMutationWithInvalidate = (mutationFn, slug) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetail', slug] });
    },
  });
};

// ✅ Specific hooks
export const useAddPointMutation = slug =>
  useMutationWithInvalidate(projectService.addPoint, slug);

export const useDeleteStepMutation = slug =>
  useMutationWithInvalidate(projectService.deleteStep, slug);

export const useUploadDocumentMutation = slug =>
  useMutationWithInvalidate(projectService.uploadDocument, slug);

export const useChangeIssueMemberMutation = slug =>
  useMutationWithInvalidate(projectService.changeIssueMember, slug);

export const useUpdateInspectionListMutation = slug =>
  useMutationWithInvalidate(projectService.updateInspectionList, slug);
