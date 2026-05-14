import { AlpacaProvider } from '../src/providers/alpaca';
import { TradierProvider } from '../src/providers/tradier';
import { FredProvider } from '../src/providers/fred';
import { SecEdgarProvider } from '../src/providers/sec-edgar';

describe('Provider adapters (stubs)', () => {
  describe('AlpacaProvider', () => {
    const provider = new AlpacaProvider();

    it('has name "alpaca"', () => {
      expect(provider.name).toBe('alpaca');
    });

    it('getQuote returns a MarketQuote with correct symbol', async () => {
      const quote = await provider.getQuote('AAPL');
      expect(quote.symbol).toBe('AAPL');
      expect(quote.source).toBe('alpaca');
      expect(typeof quote.fetchedAt).toBe('string');
      expect(quote.isDelayed).toBe(true);
    });

    it('getBars returns an array', async () => {
      const bars = await provider.getBars('AAPL', '1D', 10);
      expect(Array.isArray(bars)).toBe(true);
    });
  });

  describe('TradierProvider', () => {
    const provider = new TradierProvider();

    it('has name "tradier"', () => {
      expect(provider.name).toBe('tradier');
    });

    it('getQuote returns a MarketQuote with correct symbol', async () => {
      const quote = await provider.getQuote('MSFT');
      expect(quote.symbol).toBe('MSFT');
      expect(quote.source).toBe('tradier');
    });
  });

  describe('FredProvider', () => {
    const provider = new FredProvider();

    it('has name "fred"', () => {
      expect(provider.name).toBe('fred');
    });

    it('getLatestObservation returns an observation object', async () => {
      const obs = await provider.getLatestObservation('FEDFUNDS');
      expect(obs.source).toBe('fred');
      expect(typeof obs.fetchedAt).toBe('string');
    });
  });

  describe('SecEdgarProvider', () => {
    const provider = new SecEdgarProvider();

    it('has name "sec-edgar"', () => {
      expect(provider.name).toBe('sec-edgar');
    });

    it('getRecentFilings returns an array', async () => {
      const filings = await provider.getRecentFilings('0000320193');
      expect(Array.isArray(filings)).toBe(true);
    });
  });
});
