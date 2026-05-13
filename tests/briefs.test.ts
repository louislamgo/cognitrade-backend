import request from 'supertest';
import app from '../src/server';
import { cacheClear } from '../src/lib/cache';

describe('GET /api/briefs/:symbol', () => {
  beforeEach(() => {
    cacheClear();
  });

  it('returns 200 with a brief for a valid symbol', async () => {
    const res = await request(app).get('/api/briefs/AAPL');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
    expect(typeof res.body.summary).toBe('string');
    expect(Array.isArray(res.body.disclaimers)).toBe(true);
    expect(res.body.disclaimers.length).toBeGreaterThan(0);
    expect(typeof res.body.generatedAt).toBe('string');
    expect(typeof res.body.dataSource).toBe('string');
    expect(typeof res.body.isDataDelayed).toBe('boolean');
  });

  it('returns 400 for an invalid symbol', async () => {
    const res = await request(app).get('/api/briefs/INVALID_SYMBOL_12345');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_SYMBOL');
  });

  it('returns 400 for a symbol with special characters', async () => {
    const res = await request(app).get('/api/briefs/AA$PL');
    expect(res.status).toBe(400);
  });

  it('converts lowercase symbol to uppercase', async () => {
    const res = await request(app).get('/api/briefs/aapl');
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe('AAPL');
  });

  it('uses cache on second request', async () => {
    await request(app).get('/api/briefs/MSFT');
    const res2 = await request(app).get('/api/briefs/MSFT');
    expect(res2.status).toBe(200);
    expect(res2.body.symbol).toBe('MSFT');
  });
});
