const Bitfinex = require("./bitfinex-client");
jest.mock("winston", () => ({ info: jest.fn() }));

let client;
let market = {
  id: "BTCUSD",
  base: "BTC",
  quote: "USD",
};

beforeAll(() => {
  client = new Bitfinex();
});

test(
  "should subscribe and emit trade events",
  done => {
    client.subscribeTrades(market);
    client.on("trade", trade => {
      expect(trade.fullId).toMatch("Bitfinex:BTC/USD");
      expect(trade.exchange).toMatch("Bitfinex");
      expect(trade.base).toMatch("BTC");
      expect(trade.quote).toMatch("USD");
      expect(trade.tradeId).toBeGreaterThan(0);
      expect(trade.unix).toBeGreaterThan(1522540800);
      expect(trade.price).toBeGreaterThan(0);
      expect(trade.amount).toBeDefined();
      done();
    });
  },
  30000
);

test("should close connections", done => {
  client.on("closed", done);
  client.close();
});
