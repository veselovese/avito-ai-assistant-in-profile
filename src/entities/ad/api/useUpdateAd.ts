import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdById } from './api';
import type { Ad, AdUpdateIn } from '../model/types';
import { getDescriptionPrompt, getPricePrompt } from '../../../features/ai/model/promts';
import { generateDescription, suggestPrice } from '../../../features/ai/api/api';

export const useUpdateAd = () => {
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

export const useGenerateDescription = () => {
  return useMutation({
    mutationFn: async (ad: Ad) => {
      const prompt = getDescriptionPrompt(ad);
      const improvedText = await generateDescription(prompt);
      return improvedText;
    },
  });
};

export const useSuggestPrice = () => {
  return useMutation({
    mutationFn: async (ad: Ad) => {
      const prompt = getPricePrompt(ad);
      const priceSuggestion = await suggestPrice(prompt);
      return parseInt(priceSuggestion.replace(/\D/g, ''), 10) || 0; 
    },
  });
}