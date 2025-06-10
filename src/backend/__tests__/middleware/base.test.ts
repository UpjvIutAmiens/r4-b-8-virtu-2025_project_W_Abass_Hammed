import request from 'supertest';
import express from 'express';
import { requireRequestId } from '../../src/middlewares/base';
import { v4 as uuidv4 } from 'uuid';

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
