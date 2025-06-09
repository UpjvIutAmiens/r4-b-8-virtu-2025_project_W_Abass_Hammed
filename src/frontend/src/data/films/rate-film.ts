import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { post, handleError } from "../fetcher";
import { ResponseError } from "@/types/base";

interface RateFilmInput {
  tconst: string;
  rating: number;
}

interface RateFilmResponse {
  success: boolean;
  message?: string;
}

async function rateFilm(input: RateFilmInput) {
  const { data, error } = await post("/api/v1/note", {
    body: input,
  });

  if (error) handleError(error);

  return data as unknown as RateFilmResponse;
}

export const useRateFilmMutation = (
  options?: UseMutationOptions<RateFilmResponse, ResponseError, RateFilmInput>,
) => {
  return useMutation<RateFilmResponse, ResponseError, RateFilmInput>({
    mutationFn: rateFilm,
    ...options,
  });
};
