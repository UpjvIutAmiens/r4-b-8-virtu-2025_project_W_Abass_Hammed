import request from 'supertest';
import app from '../index';
import { dbConfig } from '../src/model/connect';
import Database from '../src/model/db';
import FilmsRepository from '../src/repositories/films';
import { consoleLogger } from '../src/services/logger';
import pg from 'pg';
import Redis from 'ioredis-mock';

import { expect, describe, test, jest, beforeEach } from '@jest/globals';

// Mock external dependencies
jest.mock('pg');
jest.mock('ioredis');
jest.mock('node-fetch');

describe('Middleware Tests', () => {
  test('Requires valid UUIDv4 request ID', async () => {
    // Invalid ID
    await request(app).get('/api/test').set('X-Request-Id', 'invalid-id').expect(400);

    // Missing ID
    await request(app).get('/api/test').expect(400);
  });

  test('SSL configuration handles different environments', () => {
    // Production without cert
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_CA_CERT;
    expect(dbConfig.ssl).toEqual({ rejectUnauthorized: false });

    // With CA cert
    process.env.DATABASE_CA_CERT = 'test-cert';
    expect(dbConfig.ssl).toEqual({
      rejectUnauthorized: true,
      ca: Buffer.from('test-cert', 'base64'),
    });

    // Development
    process.env.NODE_ENV = 'development';
    expect(dbConfig.ssl).toBeUndefined();
  });
});

describe('Database Layer', () => {
  const mockQuery = jest.fn();
  (pg.Pool as unknown as jest.Mock).mockImplementation(() => ({
    query: mockQuery,
  }));

  test('Handles query errors gracefully', async () => {
    const db = new Database(dbConfig);
    mockQuery.mockRejectedValueOnce(new Error('DB error'));

    const result = await db.query('SELECT * FROM films');
    expect(result).toEqual([]);
  });

  test('Formats PostgreSQL errors correctly', () => {
    const db = new Database(dbConfig);
    const error = new Error('Syntax error') as any;
    error.severity = 'ERROR';
    error.code = '42601';
    error.position = '15';
    error.message = 'Invalid syntax';
    error.internalQuery = 'SELECT * FROM';

    const formatted = db['formatPgError'](error, 'SELECT * FROM films');
    expect(formatted.error.formattedError).toContain('LINE');
    expect(formatted.error.formattedError).toContain('^');
  });
});

describe('Film Repository', () => {
  const redis = new Redis() as jest.Mocked<Redis>;
  const mockFetch = jest.fn();
  (global as any).fetch = mockFetch;

  beforeEach(() => {
    redis.get.mockClear();
    redis.set.mockClear();
    mockFetch.mockClear();
  });

  test('Caches film details in Redis', async () => {
    const filmsRepo = new FilmsRepository();
    const testData = { Title: 'Inception', Year: '2010' };

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(testData),
    });

    // First call - fetches from API
    await filmsRepo.getFilmDetails('tt123456');
    expect(redis.set).toHaveBeenCalledWith(
      'film:tt123456',
      JSON.stringify({ tconst: 'tt123456', ...testData }),
      'EX',
      86400,
    );

    // Second call - uses cache
    redis.get.mockResolvedValueOnce(JSON.stringify(testData));
    await filmsRepo.getFilmDetails('tt123456');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test('Handles rating validation', async () => {
    const filmsRepo = new FilmsRepository();

    // Valid rating
    await expect(filmsRepo.saveRating('tt123', 3)).resolves.not.toThrow();

    // Invalid ratings
    await expect(filmsRepo.saveRating('tt123', 0)).rejects.toThrow();
    await expect(filmsRepo.saveRating('tt123', 6)).rejects.toThrow();
  });

  test('Rate limits OMDb API calls', async () => {
    const filmsRepo = new FilmsRepository();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const start = Date.now();
    await Promise.all([filmsRepo.getTopFilms(1, 5), filmsRepo.getTopFilms(2, 5)]);
    const duration = Date.now() - start;

    // Should take at least 2.5s for 5 films (500ms delay each)
    expect(duration).toBeGreaterThanOrEqual(2500);
  });
});

describe('API Routes', () => {
  test('Returns random film', async () => {
    // Mock repository response
    FilmsRepository.prototype.getRandomFilm = jest.fn().mockResolvedValue({ Title: 'The Matrix' });

    await request(app)
      .get('/api/v1/film')
      .set('X-Request-Id', 'd6a98bbf-3e9f-4a5b-bd82-2e9bd9b8c4d1')
      .expect(200)
      .then(res => {
        expect(res.body.Title).toBe('The Matrix');
      });
  });

  test('Handles rating submission errors', async () => {
    FilmsRepository.prototype.saveRating = jest.fn().mockRejectedValue(new Error('Invalid rating'));

    await request(app)
      .post('/api/v1/note')
      .set('X-Request-Id', 'd6a98bbf-3e9f-4a5b-bd82-2e9bd9b8c4d1')
      .send({ tconst: 'tt123', rating: 10 })
      .expect(400)
      .then(res => {
        expect(res.body.error).toBe('Failed to save rating');
      });
  });
});

describe('Logger Service', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  test('Formats messages correctly', () => {
    const logger = consoleLogger;
    logger.error('Database connection failed');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Filmomètre'),
      expect.stringContaining('Database connection failed'),
      expect.stringContaining('\x1b[91m'),
    );
  });
});

describe('Integration Tests', () => {
  test('Full rating flow', async () => {
    const { body: film } = await request(app)
      .get('/api/v1/film')
      .set('X-Request-Id', 'd6a98bbf-3e9f-4a5b-bd82-2e9bd9b8c4d1');

    await request(app)
      .post('/api/v1/note')
      .set('X-Request-Id', 'd6a98bbf-3e9f-4a5b-bd82-2e9bd9b8c4d1')
      .send({ tconst: film.tconst, rating: 5 });

    const { body: rating } = await request(app)
      .get(`/api/v1/note/${film.tconst}`)
      .set('X-Request-Id', 'd6a98bbf-3e9f-4a5b-bd82-2e9bd9b8c4d1');

    expect(rating.voteCount).toBe(1);
    expect(rating.averageRating).toBe(5);
  });
});
