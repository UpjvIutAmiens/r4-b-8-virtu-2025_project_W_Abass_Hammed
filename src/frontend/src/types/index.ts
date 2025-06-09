export interface FilmDetails {
  tconst: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Website: string;
}

interface RatingSummary {
  tconst: string;
  averageRating: number;
  voteCount: number;
}

interface TopFilm extends FilmDetails, RatingSummary {}
