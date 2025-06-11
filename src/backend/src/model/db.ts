import * as pg from 'pg';
import { consoleLogger } from '../services/logger';

//inspiration : https://github.com/supabase/postgres-meta/blob/master/src/lib/db.ts

const configureTypeParsers = () => {
  pg.types.setTypeParser(pg.types.builtins.DATE, x => x);
  pg.types.setTypeParser(pg.types.builtins.INTERVAL, x => x);
  pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, x => x);
  pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, x => x);
};
configureTypeParsers();

export default class Database {
  pool: pg.Pool;

  constructor(config: pg.PoolConfig) {
    this.pool = new pg.Pool(this.parseSSLFromURL(config));
  }
  // node-postgres ignores config.ssl if any of sslmode, sslca, sslkey, sslcert,
  // sslrootcert are in the connection string. Here we allow setting sslmode in
  // the connection string while setting the rest in config.ssl.
  private parseSSLFromURL(config: pg.PoolConfig): pg.PoolConfig {
    const _config = { ...config };

    return {
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ..._config,
    };
  }

  async query<T extends pg.QueryResultRow>(sql: string, values?: any[]): Promise<T[]> {
    try {
      const res = await this.pool.query<T>(sql, values);
      return res.rows;
    } catch (error: any) {
      consoleLogger.error('[Database Error]', error);
      return [];
    }
  }
}
