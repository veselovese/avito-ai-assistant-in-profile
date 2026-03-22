import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdById } from './api';
import type { AdUpdateIn } from '../model/types';

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdUpdateIn }) =>
      updateAdById(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
};