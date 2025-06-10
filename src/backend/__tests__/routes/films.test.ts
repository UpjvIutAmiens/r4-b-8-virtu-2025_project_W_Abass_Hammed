import request from 'supertest';
import express from 'express';
import filmsRoutes from '../../src/routes/films';
import { v4 as uuidv4 } from 'uuid';
import FilmsRepository from '../../src/repositories/films';

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
    jest
      .spyOn(FilmsRepository.prototype, 'getTopFilms')
      .mockResolvedValue([
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
