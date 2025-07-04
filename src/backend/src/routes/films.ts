import { Router } from 'express';
import FilmsRepository from '../repositories/films';
import { consoleLogger } from '../services/logger';

class FilmsRoutes {
  router = Router();
  controller = new FilmsRepository();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/film', async (req, res) => {
      try {
        const film = await this.controller.getRandomFilm();
        res.json(film);
      } catch (error) {
        consoleLogger.error('[FilmsRoutes::RandomFilm]', error);
        res.status(500).json({ error: 'Failed to fetch film' });
      }
    });
    this.router.post('/note', async (req, res) => {
      const { tconst, rating } = req.body;

      try {
        await this.controller.saveRating(tconst, rating);
        res.status(201).json({ success: true });
      } catch (error) {
        consoleLogger.error('[FilmsRoutes::SaveRating]', error);
        res.status(400).json({ error: 'Failed to save rating' });
      }
    });
    this.router.get('/note/:id', async (req, res) => {
      try {
        const summary = await this.controller.getFilmRating(req.params.id);
        res.json(summary);
      } catch (error) {
        consoleLogger.error('[FilmsRoutes::GetFilmRating]', error);
        res.status(500).json({ error: 'Failed to fetch film rating' });
      }
    });
    this.router.get('/top-rated', async (req, res) => {
      try {
        const topFilms = await this.controller.getTopFilms();
        res.json(topFilms);
      } catch (error) {
        consoleLogger.error('[FilmsRoutes::GetTopFilms]', error);
        res.status(500).json({ error: 'Failed to fetch top films' });
      }
    });
  }
}

export default new FilmsRoutes().router;
