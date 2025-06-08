import { QueryResultRow } from 'pg';
import Database from '../model/db';
import { dbConfig } from '../model/connect';

class FilmsRepository {
  private query: <T extends QueryResultRow>(sql: string, params?: any[]) => Promise<T[]>;

  constructor() {
    const db = new Database(dbConfig);
    this.query = db.query.bind(db);
  }
}

export default new FilmsRepository();
