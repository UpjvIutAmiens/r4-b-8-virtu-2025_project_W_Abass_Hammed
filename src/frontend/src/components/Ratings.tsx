"use client";

import { useEffect, useState } from "react";
import { Star, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Alert, AlertDescription } from "@/components/alert";
import { useRatingQuery } from "@/data/films/get-note";
import { toast } from "sonner";

interface MovieRatingProps {
  tconst: string;
}

export default function MovieRating({ tconst }: MovieRatingProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const { data: ratingData, error, isLoading } = useRatingQuery(tconst);

  useEffect(() => {
    const ratedMovies = JSON.parse(localStorage.getItem("ratedMovies") || "{}");
    if (ratedMovies[tconst]) {
      setUserRating(ratedMovies[tconst]);
      setHasRated(true);
    }
  }, [tconst]);

  const handleRating = (rating: number) => {
    const ratedMovies = JSON.parse(localStorage.getItem("ratedMovies") || "{}");

    if (ratedMovies[tconst]) {
      toast.error("You have already rated this movie.");
      return;
    }

    ratedMovies[tconst] = rating;
    localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));

    setUserRating(rating);
    setHasRated(true);

    toast.success("Thank you for your rating!");
    setHoveredRating(0);
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredRating || userRating)
        : starValue <= rating;

      return (
        <Star
          key={index}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            isFilled
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground hover:text-yellow-400"
          }`}
          onClick={interactive ? () => handleRating(starValue) : undefined}
          onMouseEnter={
            interactive ? () => setHoveredRating(starValue) : undefined
          }
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Rate this Movie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User Rating Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Your Rating:</p>
          <div className="flex items-center gap-1">
            {renderStars(userRating, !hasRated)}
          </div>
          {hasRated && (
            <p className="text-xs text-green-600">Thank you for rating!</p>
          )}
        </div>

        {/* Average Rating Section */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Community Rating:</p>

          {isLoading && (
            <p className="text-xs text-muted-foreground">Loading ratings...</p>
          )}

          {error && (
            <Alert className="py-2">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-xs">
                No ratings available yet. Be the first!
              </AlertDescription>
            </Alert>
          )}

          {ratingData && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(ratingData.averageRating))}
                <span className="text-xs font-medium">
                  {ratingData.averageRating.toFixed(1)}/5.0
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{ratingData.voteCount} votes</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
