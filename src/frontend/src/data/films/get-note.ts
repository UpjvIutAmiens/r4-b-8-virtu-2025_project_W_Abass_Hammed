import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { get, handleError } from "../fetcher";
import { ResponseError } from "@/types/base";
import { RatingSummary } from "@/types";

async function getRating(tconst: string, signal?: AbortSignal) {
  const { data, error } = await get(`/api/v1/note/{tconst}`, {
    params: {
      path: { tconst },
    },
    signal,
  });

  if (error) handleError(error);

  return data as unknown as RatingSummary;
}

type RatingQueryKey = ["rating", string];

export const useRatingQuery = <TData = RatingSummary>(
  tconst: string,
  {
    enabled = true,
    ...options
  }: Omit<
    UseQueryOptions<RatingSummary, ResponseError, TData, RatingQueryKey>,
    "queryKey" | "queryFn"
  > = {},
) =>
  useQuery<RatingSummary, ResponseError, TData, RatingQueryKey>({
    queryKey: ["rating", tconst],
    queryFn: ({ signal }) => getRating(tconst, signal),
    ...options,
    enabled: enabled && !!tconst,
    refetchOnWindowFocus: false,
  });
