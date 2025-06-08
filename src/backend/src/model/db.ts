import * as pg from 'pg';
import { DatabaseError } from 'pg-protocol';
import { consoleLogger } from '../services/logger';

//inspiration : https://github.com/supabase/postgres-meta/blob/master/src/lib/db.ts

const configureTypeParsers = () => {
  pg.types.setTypeParser(pg.types.builtins.INT8, x => {
    const asNumber = Number(x);
    if (Number.isSafeInteger(asNumber)) {
      return asNumber;
    } else {
      return x;
    }
  });
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
    if (_config.connectionString) {
      const u = new URL(_config.connectionString);
      const sslmode = u.searchParams.get('sslmode');
      u.searchParams.delete('sslmode');
      // For now, we don't support setting these from the connection string.
      u.searchParams.delete('sslca');
      u.searchParams.delete('sslkey');
      u.searchParams.delete('sslcert');
      u.searchParams.delete('sslrootcert');
      _config.connectionString = u.toString();

      // sslmode:    null, 'disable', 'prefer', 'require', 'verify-ca', 'verify-full', 'no-verify'
      // config.ssl: true, false, {}
      if (sslmode === null) {
        // skip
      } else if (sslmode === 'disable') {
        _config.ssl = false;
      } else {
        if (typeof _config.ssl !== 'object') {
          _config.ssl = {};
        }
        _config.ssl.rejectUnauthorized = sslmode === 'verify-full';
      }
    }
    return {
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ..._config,
    };
  }

  private formatPgError(error: DatabaseError, sql: string) {
    // Roughly based on:
    // - https://github.com/postgres/postgres/blob/fc4089f3c65a5f1b413a3299ba02b66a8e5e37d0/src/interfaces/libpq/fe-protocol3.c#L1018
    // - https://github.com/brianc/node-postgres/blob/b1a8947738ce0af004cb926f79829bb2abc64aa6/packages/pg/lib/native/query.js#L33
    let formattedError = '';
    {
      if (error.severity) {
        formattedError += `${error.severity}:  `;
      }
      if (error.code) {
        formattedError += `${error.code}: `;
      }
      if (error.message) {
        formattedError += error.message;
      }
      formattedError += '\n';
      if (error.position) {
        // error.position is 1-based
        const position = Number(error.position) - 1;

        let line = '';
        let lineNumber = 0;
        let lineOffset = 0;

        const lines = sql.split('\n');
        let currentOffset = 0;
        for (let i = 0; i < lines.length; i++) {
          if (currentOffset + lines[i].length > position) {
            line = lines[i];
            lineNumber = i + 1; // 1-based
            lineOffset = position - currentOffset;
            break;
          }
          currentOffset += lines[i].length + 1; // 1 extra offset for newline
        }
        formattedError += `LINE ${lineNumber}: ${line}
${' '.repeat(5 + lineNumber.toString().length + 2 + lineOffset)}^
`;
      }
      if (error.detail) {
        formattedError += `DETAIL:  ${error.detail}
`;
      }
      if (error.hint) {
        formattedError += `HINT:  ${error.hint}
`;
      }
      if (error.internalQuery) {
        formattedError += `QUERY:  ${error.internalQuery}
`;
      }
      if (error.where) {
        formattedError += `CONTEXT:  ${error.where}
`;
      }
    }

    return {
      data: null,
      error: {
        ...error,
        // error.message is non-enumerable
        message: error.message,
        formattedError,
      },
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
