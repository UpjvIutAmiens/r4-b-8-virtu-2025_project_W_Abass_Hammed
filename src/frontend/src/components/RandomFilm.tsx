"use client";

import Image from "next/image";
import { Film, Calendar, Clock, Award, RefreshCw, Trophy } from "lucide-react";
import { Badge } from "@/components/badge";
import MovieRating from "./Ratings";
import { useFilmQuery } from "@/data/films/get-film";
import { FilmDetails } from "@/types";
import Loading from "./loading";
import { Button } from "./button";
import { Dispatch, SetStateAction } from "react";

interface RandomFilmProps {
  showBestRated: Dispatch<SetStateAction<boolean>>;
}

const RandomFilm = ({ showBestRated }: RandomFilmProps) => {
  const { data: movie, isLoading, error, refetch } = useFilmQuery();

  const PosterCard = ({ movie }: { movie: FilmDetails }) => (
    <div className="border bg-background relative overflow-hidden grid grid-cols-12 rounded-lg p-5 md:p-8">
      <div className="col-span-full flex flex-col md:flex-row xl:flex-col justify-between gap-3">
        <div className="md:max-w-xs shrink w-fit xl:max-w-none">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <Image
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              width={300}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <Film className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <MovieRating tconst={movie.tconst} />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full w-full bg-alternative max-w-none">
        <div className="max-w-7xl px-5 mx-auto py-8 sm:pb-16 sm:pt-12 xl:pt-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loading />
            <p className="text-foreground-light">Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="h-full w-full bg-alternative border-b max-w-none mb-16 md:mb-12 xl:mb-0">
        <div className="max-w-7xl px-5 mx-auto py-8 sm:pb-16 sm:pt-12 xl:pt-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load movie</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-10 w-full bg-alternative border-b max-w-none mb-16 md:mb-12 xl:mb-0"
      style={{
        backgroundImage:
          movie.Poster && movie.Poster !== "N/A"
            ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${movie.Poster})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl px-5 mx-auto py-8 sm:pb-16 sm:pt-12 xl:pt-16 flex flex-col xl:flex-row justify-between gap-12 xl:gap-12">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center w-full max-w-xl xl:max-w-[33rem]">
          <div className="flex flex-col">
            <h1 className="m-0 mb-3 text-2xl sm:text-3xl text-foreground font-bold">
              {movie.Title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {movie.Year}
              </Badge>
              <Badge variant="outline">{movie.Rated}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {movie.Runtime}
              </Badge>
            </div>

            <p className="m-0 text-foreground-light mb-4 leading-relaxed">
              {movie.Plot}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">
                  Genre:
                </span>
                <span className="text-foreground-light">{movie.Genre}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">
                  Director:
                </span>
                <span className="text-foreground-light">{movie.Director}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">
                  Actors:
                </span>
                <span className="text-foreground-light">{movie.Actors}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">
                  Released:
                </span>
                <span className="text-foreground-light">{movie.Released}</span>
              </div>
              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <span className="text-foreground-light">{movie.Awards}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <Button
                onClick={() => refetch()}
                variant="default"
                size="lg"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Movie
              </Button>
              <Button
                onClick={() => showBestRated(true)}
                variant={"outline"}
                size="lg"
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Classement
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full xl:max-w-[440px] -mb-40">
          <PosterCard movie={movie} />
        </div>
      </div>
    </div>
  );
};

export default RandomFilm;
