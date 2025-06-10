import Database from '../../src/model/db';
import pg from 'pg';
import { consoleLogger } from '../../src/services/logger';

describe('Database class', () => {
  const mockQuery = jest.fn();
  beforeAll(() => {
    (pg.Pool as unknown as jest.Mock) = jest.fn().mockImplementation(() => ({ query: mockQuery }));
  });

  beforeEach(() => {
    mockQuery.mockClear();
  });

  test('query handles success', async () => {
    mockQuery.mockResolvedValue({ rows: [{ foo: 'bar' }] });
    const db = new Database({} as any);
    const res = await db.query('SELECT 1');
    expect(res).toEqual([{ foo: 'bar' }]);
  });

  test('query handles error and logs', async () => {
    const error = new Error('fail');
    mockQuery.mockRejectedValue(error);
    const spy = jest.spyOn(consoleLogger, 'error').mockImplementation();

    const db = new Database({} as any);
    const res = await db.query('SELECT 1');
    expect(res).toEqual([]);
    expect(spy).toHaveBeenCalledWith('[Database Error]', error);
    spy.mockRestore();
  });

  test('formatPgError creates formatted message', () => {
    const db = new Database({} as any);
    const err: any = new Error('msg');
    err.severity = 'ERROR';
    err.code = '42000';
    err.position = '3';
    const out = (db as any).formatPgError(err, 'ab\ncdef');
    expect(out.error.formattedError).toContain('ERROR:');
    expect(out.error.formattedError).toContain('LINE');
  });
});
