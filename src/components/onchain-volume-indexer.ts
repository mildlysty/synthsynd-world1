
/**
 * SYNTHSYND WORLD
 * On-Chain Trading Volume Indexer
 *
 * Purpose:
 * Normalize trade events into daily token volume metrics.
 *
 * Status: Integration prototype
 */

type TradeEvent = {
  signature: string;
  tokenMint: string;
  trader: string;
  side: "buy" | "sell";
  amount: number;
  timestamp: number;
};

type VolumeMetrics = {
  tokenMint: string;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  tradeCount: number;
  uniqueTraders: number;
  lastUpdated: string;
};

class OnChainVolumeIndexer {
  private trades: TradeEvent[] = [];

  addTrade(event: TradeEvent): boolean {
    if (
      !event.signature ||
      !event.tokenMint ||
      !event.trader ||
      !Number.isFinite(event.amount) ||
      event.amount <= 0 ||
      !Number.isFinite(event.timestamp)
    ) {
      return false;
    }

    // Prevent duplicate transaction indexing.
    if (this.trades.some(
      trade => trade.signature === event.signature
    )) {
      return false;
    }

    this.trades.push(event);
    return true;
  }

  getTokenMetrics(tokenMint: string): VolumeMetrics {
    const tokenTrades = this.trades.filter(
      trade => trade.tokenMint === tokenMint
    );

    const buyVolume = tokenTrades
      .filter(trade => trade.side === "buy")
      .reduce((sum, trade) => sum + trade.amount, 0);

    const sellVolume = tokenTrades
      .filter(trade => trade.side === "sell")
      .reduce((sum, trade) => sum + trade.amount, 0);

    return {
      tokenMint,
      buyVolume,
      sellVolume,
      totalVolume: buyVolume + sellVolume,
      tradeCount: tokenTrades.length,
      uniqueTraders: new Set(
        tokenTrades.map(trade => trade.trader)
      ).size,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Local prototype demonstration.
// These are sample events, not live blockchain data.

const indexer = new OnChainVolumeIndexer();

indexer.addTrade({
  signature: "sample-tx-001",
  tokenMint: "SYNTHSYND_TOKEN",
  trader: "wallet-alpha",
  side: "buy",
  amount: 125,
  timestamp: Date.now()
});

indexer.addTrade({
  signature: "sample-tx-002",
  tokenMint: "SYNTHSYND_TOKEN",
  trader: "wallet-beta",
  side: "sell",
  amount: 45,
  timestamp: Date.now()
});

const metrics = indexer.getTokenMetrics(
  "SYNTHSYND_TOKEN"
);

console.log("[Synthsynd] Volume indexing preview");
console.table(metrics);
