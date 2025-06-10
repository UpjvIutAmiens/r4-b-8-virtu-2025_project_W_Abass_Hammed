import { dbConfig } from '../../src/model/connect';
import { env } from 'process';
import { expect, test, describe, afterEach } from '@jest/globals';

describe('dbConfig SSL parsing', () => {
  const OLD_ENV = { ...env };
  afterEach(() => {
    Object.assign(env, OLD_ENV);
  });

  test('production without cert', () => {
    env.NODE_ENV = 'production';
    delete env.DATABASE_CA_CERT;
    const cfg = dbConfig;
    expect(cfg.ssl).toEqual({ rejectUnauthorized: false });
  });

  test('with cert', () => {
    env.NODE_ENV = 'production';
    env.DATABASE_CA_CERT = Buffer.from('cert').toString('base64');
    const cfg = dbConfig;
    expect(cfg.ssl).toEqual({ rejectUnauthorized: true, ca: Buffer.from('cert') });
  });

  test('development', () => {
    env.NODE_ENV = 'development';
    delete env.DATABASE_CA_CERT;
    const cfg = dbConfig;
    expect(cfg.ssl).toBeUndefined();
  });
});
