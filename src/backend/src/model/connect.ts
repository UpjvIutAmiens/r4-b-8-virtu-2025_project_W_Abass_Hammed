import { type PoolConfig } from 'pg';
import { env } from 'process';

type SSLConfig = {
  rejectUnauthorized?: boolean;
  ca?: Buffer;
};

const parseSSLConfig = (): SSLConfig | undefined => {
  if (env.DATABASE_CA_CERT) {
    return {
      rejectUnauthorized: true,
      ca: Buffer.from(env.DATABASE_CA_CERT, 'base64'),
    };
  }

  if (env.NODE_ENV === 'production') {
    return { rejectUnauthorized: false };
  }

  return undefined;
};

export const dbConfig: PoolConfig = {
  host: env.POSTGRES_HOST,
  port: Number(env.POSTGRES_PORT),
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  ssl: parseSSLConfig(),

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
