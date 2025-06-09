import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { get, handleError } from "../fetcher";
import { ResponseError } from "@/types/base";
import { FilmDetails } from "@/types";

async function getFilm(signal?: AbortSignal) {
  const { data, error } = await get("/api/v1/film", {
    signal,
  });

  if (error) handleError(error);

  return data as unknown as FilmDetails;
}

type FilmQueryKey = ["film"];

export const useFilmQuery = <TData = FilmDetails>({
  enabled = true,
  ...options
}: Omit<
  UseQueryOptions<FilmDetails, ResponseError, TData, FilmQueryKey>,
  "queryKey" | "queryFn"
> = {}) =>
  useQuery<FilmDetails, ResponseError, TData, FilmQueryKey>({
    queryKey: ["film"],
    queryFn: ({ signal }) => getFilm(signal),
    ...options,
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
