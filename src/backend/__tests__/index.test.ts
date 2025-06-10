import request from 'supertest';
import express from 'express';
import { requireRequestId } from '../src/middlewares/base';
import { v4 as uuidv4 } from 'uuid';
import { consoleLogger } from '../src/services/logger';
import type { SpiedFunction } from 'jest-mock';
import filmsRoutes from '../src/routes/films';
import FilmsRepository from '../src/repositories/films';
import { describe, expect, test, jest, beforeAll, beforeEach } from '@jest/globals';

describe('requireRequestId middleware', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(requireRequestId);
    app.get('/', (req, res) => res.status(200).send('ok'));
  });

  test('rejects missing header', async () => {
    await request(app)
      .get('/')
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('X-Request-Id header is required');
      });
  });

  test('rejects invalid UUID', async () => {
    await request(app)
      .get('/')
      .set('X-Request-Id', 'invalid')
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBe('X-Request-Id must be a valid UUID v4');
      });
  });

  test('allows valid UUID v4', async () => {
    const id = uuidv4();
    await request(app).get('/').set('X-Request-Id', id).expect(200);
  });
});

describe('dbConfig SSL parsing', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('production without cert', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_CA_CERT;
    const { dbConfig } = require('../src/model/connect');
    expect(dbConfig.ssl).toEqual({ rejectUnauthorized: false });
  });

  test('with cert', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_CA_CERT = Buffer.from('cert').toString('base64');
    const { dbConfig } = require('../src/model/connect');
    expect(dbConfig.ssl).toEqual({ rejectUnauthorized: true, ca: Buffer.from('cert') });
  });

  test('development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.DATABASE_CA_CERT;
    const { dbConfig } = require('../src/model/connect');
    expect(dbConfig.ssl).toBeUndefined();
  });
});

describe('Database class', () => {
  let mockQuery: jest.Mock;
  let OriginalPool: any;

  beforeAll(() => {
    jest.resetModules();
    OriginalPool = jest.requireActual('pg').Pool;
    mockQuery = jest.fn();
    jest.mock('pg', () => {
      const types = { setTypeParser: jest.fn(), builtins: {} };
      return { Pool: jest.fn(() => ({ query: mockQuery })), types };
    });
  });

  beforeEach(() => {
    mockQuery.mockClear();
  });

  test('query handles success', async () => {
    mockQuery.mockResolvedValue({ rows: [{ foo: 'bar' }] });
    const { default: DB } = require('../src/model/db');
    const db = new DB({} as any);
    const res = await db.query('SELECT 1');
    expect(res).toEqual([{ foo: 'bar' }]);
  });

  test('query handles error and logs', async () => {
    const error = new Error('fail');
    mockQuery.mockRejectedValue(error);
    const spy = jest.spyOn(consoleLogger, 'error').mockImplementation();

    const { default: DB } = require('../src/model/db');
    const db = new DB({} as any);
    const res = await db.query('SELECT 1');
    expect(res).toEqual([]);
    expect(spy).toHaveBeenCalledWith('[Database Error]', error);
    spy.mockRestore();
  });

  test('formatPgError creates formatted message', () => {
    const { default: DB } = require('../src/model/db');
    const db = new DB({} as any);
    const err: any = new Error('msg');
    err.severity = 'ERROR';
    err.code = '42000';
    err.position = '3';
    const out = (db as any).formatPgError(err, 'ab\ncdef');
    expect(out.error.formattedError).toContain('ERROR:');
    expect(out.error.formattedError).toContain('LINE');
  });
});

describe('FilmsRepository', () => {
  let repo: FilmsRepository;
  let mockQuery: jest.Mock;
  let redisMock: any;
  let fetchMock: jest.Mock;

  beforeAll(() => {
    jest.mock('node-fetch', () => ({
      __esModule: true,
      default: jest.fn(),
    }));

    mockQuery = jest.fn();
    jest.mock('../src/model/db', () => ({
      default: jest.fn().mockImplementation(() => ({ query: mockQuery })),
    }));
  });

  beforeEach(() => {
    mockQuery.mockReset();
    redisMock = { get: jest.fn(), set: jest.fn() };
    jest.mock('ioredis', () => jest.fn(() => redisMock));

    // Create fetch mock
    fetchMock = require('node-fetch').default as jest.Mock;

    // Initialize repository
    const FilmsRepo = require('../src/repositories/films').default;
    repo = new FilmsRepo();
  });

  test('getRandomFilm throws if none', async () => {
    mockQuery.mockResolvedValue([]);
    await expect(repo.getRandomFilm()).rejects.toThrow('No films found');
  });

  test('getFilmDetails caches and fetches', async () => {
    const data = { Title: 'A', Year: '2020', Response: 'True' };
    mockQuery.mockResolvedValue([{ tconst: 'tt1' }]);
    redisMock.get.mockReturnValue(null);
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const film = await repo.getFilmDetails('tt1375666');
    expect(film.Title).toBe('Inception');
    expect(redisMock.set).toHaveBeenCalledWith('film:tt1375666', expect.any(String), 'EX', 86400);

    redisMock.get.mockResolvedValue(JSON.stringify(data));
    const cachedFilm = await repo.getFilmDetails('tt1375666');
    expect(cachedFilm.Title).toBe('Inception');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('saveRating validates and inserts', async () => {
    await expect(repo.saveRating('tt1', 3)).resolves.toBeUndefined();
    await expect(repo.saveRating('tt1', 6)).rejects.toThrow('Invalid rating');
  });

  test('getFilmRating returns correct summary', async () => {
    mockQuery.mockResolvedValue([{ avg: '4.5', count: '2' }]);
    const sum = await repo.getFilmRating('tt1');
    expect(sum.averageRating).toBe(4.5);
    expect(sum.voteCount).toBe(2);
  });

  test('getTopFilms applies rate limit', async () => {
    const entries = Array(5).fill({ tconst: 'tt1', avg: 5, count: 5 });
    mockQuery.mockResolvedValueOnce(entries).mockResolvedValue([]);
    const start = Date.now();
    await repo.getTopFilms(1, 5);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(5 * 500);
  });
});

describe('FilmsRoutes', () => {
  let app: express.Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', filmsRoutes);
  });

  test('GET /film returns film', async () => {
    jest
      .spyOn(FilmsRepository.prototype, 'getRandomFilm')
      .mockResolvedValue({ tconst: 'tt1', Title: 'M', Year: '2020' } as any);
    await request(app)
      .get('/api/v1/film')
      .set('X-Request-Id', uuidv4())
      .expect(200)
      .expect(res => expect(res.body.Title).toBe('M'));
  });

  test('POST /note handles error', async () => {
    jest.spyOn(FilmsRepository.prototype, 'saveRating').mockRejectedValue(new Error());
    await request(app)
      .post('/api/v1/note')
      .set('X-Request-Id', uuidv4())
      .send({ tconst: 'tt1', rating: 3 })
      .expect(400)
      .expect(res => expect(res.body.error).toBe('Failed to save rating'));
  });

  test('GET /note/:id returns summary', async () => {
    jest
      .spyOn(FilmsRepository.prototype, 'getFilmRating')
      .mockResolvedValue({ tconst: 'tt1', averageRating: 4, voteCount: 1 } as any);
    await request(app)
      .get('/api/v1/note/tt1')
      .set('X-Request-Id', uuidv4())
      .expect(200)
      .expect(res => expect(res.body.voteCount).toBe(1));
  });

  test('GET /top-rated returns list', async () => {
    jest.spyOn(FilmsRepository.prototype, 'getTopFilms').mockResolvedValue([
      {
        tconst: 'tt1',
        averageRating: 5,
        voteCount: 5,
        Title: '',
        Year: '',
        Rated: '',
        Released: '',
        Runtime: '',
        Genre: '',
        Director: '',
        Writer: '',
        Actors: '',
        Plot: '',
        Language: '',
        Country: '',
        Awards: '',
        Poster: '',
        Website: '',
      } as any,
    ]);
    await request(app)
      .get('/api/v1/top-rated')
      .set('X-Request-Id', uuidv4())
      .expect(200)
      .expect(res => expect(Array.isArray(res.body)).toBe(true));
  });
});

describe('ConsoleLogger', () => {
  let spy: SpiedFunction<{
    (...data: any[]): void;
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
  }>;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
  });
  afterEach(() => spy.mockRestore());

  test('error logs red color code', () => {
    consoleLogger.error('msg');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('\x1b[91m'), 'msg');
  });
});
