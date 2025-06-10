import request from 'supertest';
import { app } from '../index';
import { v4 as uuidv4 } from 'uuid';

describe('App Entrypoints', () => {
  test('/api returns welcome', async () => {
    await request(app)
      .get('/api')
      .set('X-Request-Id', uuidv4())
      .expect(200)
      .expect(res => expect(res.body.message).toContain('Welcome'));
  });
});
