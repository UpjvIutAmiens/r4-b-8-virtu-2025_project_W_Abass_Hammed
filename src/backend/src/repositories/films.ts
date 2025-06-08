import { QueryResultRow } from 'pg';
import Database from '../model/db';
import { dbConfig } from '../model/connect';

class FilmsRepository {
  private query: <T extends QueryResultRow>(sql: string, params?: any[]) => Promise<T[]>;

  constructor() {
    const db = new Database(dbConfig);
    this.query = db.query.bind(db);
  }

  async getTest() {
    const sql = 'SELECT * FROM films LIMIT 100';
    try {
      const result = await this.query(sql);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

export default new FilmsRepository();
