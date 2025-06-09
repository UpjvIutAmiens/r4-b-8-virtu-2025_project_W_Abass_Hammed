"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Film, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { TopFilm } from "@/types";

interface BestRatedCardProps {
  movie: TopFilm;
}
function BestRatedCard({ movie }: BestRatedCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= Math.round(rating);

      return (
        <Star
          key={index}
          className={`w-4 h-4 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        "group/panel h-full relative rounded-lg md:rounded-xl p-px bg-surface-75 bg-gradient-to-b from-border to-border/50 dark:to-surface-100 transition-all hover:shadow-md flex items-center justify-center",
        "hover:bg-none hover:!bg-border-stronger",
      )}
    >
      <div
        className={cn(
          "relative z-10 w-full h-full rounded-[7px] md:rounded-[11px] bg-surface-75 overflow-hidden text-foreground-light",
          "bg-surface-75 group/panel",
        )}
      >
        <div className="flex flex-col justify-between">
          <div className="relative w-full aspect-[3/1] bg flex items-center justify-center gap-4 overflow-hidden">
            {movie.Poster && movie.Poster !== "N/A" ? (
              <Image
                src={movie.Poster || "/placeholder.svg"}
                alt={`${movie.Title} poster`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Film className="w-12 h-12 text-muted-foreground" />
            )}

            {/* Rank badge */}
            {/* <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                #{movie.rank}
              </span>
            </div> */}
          </div>

          <div className="p-5 flex flex-col gap-2 border-t border-muted">
            <div className="flex items-start justify-between">
              <h4 className="text-foreground text-lg font-semibold">
                {movie.Title}
              </h4>
            </div>
            <p className="text-sm text-foreground-lighter">
              {movie.Year} • {movie.Director}
            </p>
            <p className="text-sm text-foreground-lighter line-clamp-2">
              {movie.Genre}
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-between p-5 pt-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {renderStars(movie.averageRating)}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {movie.averageRating.toFixed(1)}/5.0
                </div>
                <div className="text-xs text-foreground-lighter">
                  {movie.voteCount} votes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestRatedCard;
