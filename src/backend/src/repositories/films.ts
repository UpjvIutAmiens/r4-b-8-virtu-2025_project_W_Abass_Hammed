import { QueryResultRow } from 'pg';
import Database from '../model/db';
import { dbConfig } from '../model/connect';
import fetch from 'node-fetch';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const OMDb_API_KEY = process.env.OMDB_API_KEY!;
const REDIS_URL = process.env.REDIS_URL!;

interface FilmDetails {
  tconst: string;
  title: string;
  year: string;
  director: string;
  poster: string;
}

interface RatingSummary {
  tconst: string;
  averageRating: number;
  voteCount: number;
}

interface TopFilm extends FilmDetails, RatingSummary {}

export default class FilmsRepository {
  private query: <T extends QueryResultRow>(sql: string, params?: any[]) => Promise<T[]>;
  private redis: Redis;

  constructor() {
    const db = new Database(dbConfig);
    this.query = db.query.bind(db);
    this.redis = new Redis(REDIS_URL);
  }

  async getRandomFilm(): Promise<FilmDetails> {
    const films = await this.query<{ tconst: string }>(
      `SELECT tconst FROM films TABLESAMPLE SYSTEM (0.1) LIMIT 1`,
    );

    if (films.length === 0) {
      throw new Error('No films found in database');
    }

    const tconst = films[0].tconst;
    return this.getFilmDetails(tconst);
  }

  async getFilmDetails(tconst: string): Promise<FilmDetails> {
    const cacheKey = `film:${tconst}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const response = await fetch(`http://www.omdbapi.com/?i=${tconst}&apikey=${OMDb_API_KEY}&`);

    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;

    if (data.Response === 'False') {
      throw new Error(`OMDb error: ${data.Error}`);
    }

    const filmDetails: FilmDetails = {
      tconst,
      title: data.Title,
      year: data.Year,
      director: data.Director,
      poster: data.Poster,
    };

    await this.redis.set(cacheKey, JSON.stringify(filmDetails), 'EX', 86400);

    return filmDetails;
  }

  async saveRating(tconst: string, rating: number, voteToken: string): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Invalid rating value');
    }

    const tokenKey = `vote:${tconst}:${voteToken}`;
    const tokenExists = await this.redis.exists(tokenKey);

    if (tokenExists) {
      throw new Error('Duplicate vote detected');
    }

    await this.query(`INSERT INTO ratings (tconst, rating) VALUES ($1, $2)`, [tconst, rating]);

    await this.redis.set(tokenKey, '1', 'EX', 2592000);
  }

  async getFilmRating(tconst: string): Promise<RatingSummary> {
    const result = await this.query<{ avg: string; count: string }>(
      `SELECT
        COALESCE(AVG(rating), 0) AS avg,
        COUNT(*) AS count
       FROM ratings
       WHERE tconst = $1`,
      [tconst],
    );

    return {
      tconst,
      averageRating: parseFloat(result[0]?.avg || '0'),
      voteCount: parseInt(result[0]?.count || '0', 10),
    };
  }

  async getTopFilms(page: number = 1, pageSize: number = 10): Promise<TopFilm[]> {
    const offset = (page - 1) * pageSize;

    const topFilms = await this.query<{ tconst: string; avg: number; count: number }>(
      `SELECT
        r.tconst,
        AVG(r.rating) AS avg,
        COUNT(r.rating) AS count
       FROM ratings r
       GROUP BY r.tconst
       HAVING COUNT(r.rating) >= 5
       ORDER BY avg DESC, count DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    );

    const results: TopFilm[] = [];

    for (const film of topFilms) {
      try {
        const details = await this.getFilmDetails(film.tconst);
        results.push({
          ...details,
          averageRating: film.avg,
          voteCount: film.count,
        });
      } catch (error) {
        console.error(`Skipping film ${film.tconst}:`, error.message);
      }

      // Rate limiting: 2 requests per second (OMDb limit: 1000/day)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  generateVoteToken(): string {
    return uuidv4();
  }
}
