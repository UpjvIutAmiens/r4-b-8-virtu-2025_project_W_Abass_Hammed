"use client";

import { RefreshCw } from "lucide-react";
import RandomFilm from "@/components/RandomFilm";
import { useFilmQuery } from "@/data/films/get-film";

export default function HomePage() {
  const { refetch } = useFilmQuery();

  const handleNewMovie = () => {
    refetch();
  };

  return (
    <div>
      <RandomFilm />
    </div>
  );
}
