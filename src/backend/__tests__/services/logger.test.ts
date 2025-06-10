import { consoleLogger } from '../../src/services/logger';

describe('ConsoleLogger', () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
  });
  afterEach(() => spy.mockRestore());

  test('error logs red color code', () => {
    consoleLogger.error('msg');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('\x1b[91m'), 'msg');
  });
});
