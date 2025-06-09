"use client";

import { RefreshCw } from "lucide-react";
import RandomFilm from "@/components/RandomFilm";
import { useFilmQuery } from "@/data/films/get-film";
import { useState } from "react";

export default function HomePage() {
  const [showBestRated, setShowBestRated] = useState(false);
  const { refetch } = useFilmQuery();

  const handleNewMovie = () => {
    refetch();
  };

  return (
    <div>
      <RandomFilm showBestRated={setShowBestRated} />
    </div>
  );
}
