import FilmsRepository from '../../src/repositories/films';
import * as pgmod from '../../src/model/db';
import Redis from 'ioredis-mock';
import fetch from 'node-fetch';

describe('FilmsRepository', () => {
  let repo: FilmsRepository;
  const mockQuery = jest.fn();
  const redis = new Redis();
  jest.spyOn(pgmod.default.prototype, 'query').mockImplementation(mockQuery);

  beforeAll(() => {
    jest.mock('node-fetch');
  });

  beforeEach(() => {
    mockQuery.mockReset();
    redis.flushall();
    (repo as any).redis = redis;
  });

  test('getRandomFilm throws if none', async () => {
    mockQuery.mockResolvedValue([]);
    repo = new FilmsRepository();
    await expect(repo.getRandomFilm()).rejects.toThrow('No films found');
  });

  test('getFilmDetails caches and fetches', async () => {
    repo = new FilmsRepository();
    const data = { Title: 'A', Year: '2020', Response: 'True' };
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });
    const film = await repo.getFilmDetails('tt1');
    expect(film.Title).toBe('A');
    const fromCache = await repo.getFilmDetails('tt1');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('saveRating validates and inserts', async () => {
    repo = new FilmsRepository();
    await expect(repo.saveRating('tt1', 3)).resolves.toBeUndefined();
    await expect(repo.saveRating('tt1', 6)).rejects.toThrow('Invalid rating');
  });

  test('getFilmRating returns correct summary', async () => {
    repo = new FilmsRepository();
    mockQuery.mockResolvedValue([{ avg: '4.5', count: '2' }]);
    const sum = await repo.getFilmRating('tt1');
    expect(sum.averageRating).toBe(4.5);
    expect(sum.voteCount).toBe(2);
  });

  test('getTopFilms applies rate limit', async () => {
    repo = new FilmsRepository();
    const entries = [...Array(5)].map((_, i) => ({ tconst: `tt${i}`, avg: 5, count: 5 }));
    mockQuery.mockResolvedValueOnce(entries).mockResolvedValue({ rows: [] });
    jest.spyOn(global, 'setTimeout');
    const start = Date.now();
    await repo.getTopFilms(1, 5);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(5 * 500);
  });
});
