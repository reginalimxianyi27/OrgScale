// Token price data
export const PRICE_DATA = [
  { currency: "BLUR", price: 0.20811525423728813 },
  { currency: "bNEO", price: 7.1282679 },
  { currency: "BUSD", price: 0.9998782611186441 },
  { currency: "USD", price: 1 },
  { currency: "ETH", price: 1645.9337373737374 },
  { currency: "GMX", price: 36.345114372881355 },
  { currency: "STEVMOS", price: 0.07276706779661017 },
  { currency: "LUNA", price: 0.40955638983050846 },
  { currency: "RATOMo", price: 10.250918915254237 },
  { currency: "STRD", price: 0.7386553389830508 },
  { currency: "EVMOS", price: 0.06246181355932203 },
  { currency: "IBCX", price: 41.26811355932203 },
  { currency: "IRIS", price: 0.0177095593220339 },
  { currency: "ampLUNA", price: 0.49548589830508477 },
  { currency: "KUJI", price: 0.675 },
  { currency: "STOSMO", price: 0.431318 },
  { currency: "USDC", price: 1 },
  { currency: "axlUSDC", price: 0.989832 },
  { currency: "ATOM", price: 7.186657333333334 },
  { currency: "STATOM", price: 8.512162050847458 },
  { currency: "OSMO", price: 0.3772974333333333 },
  { currency: "rSWTH", price: 0.00408771 },
  { currency: "STLUNA", price: 0.44232210169491526 },
  { currency: "LSI", price: 67.69661525423729 },
  { currency: "OKB", price: 42.97562059322034 },
  { currency: "OKT", price: 13.561577966101694 },
  { currency: "SWTH", price: 0.004039850455012084 },
  { currency: "USC", price: 0.994 },
  { currency: "WBTC", price: 26002.82202020202 },
  { currency: "wstETH", price: 1872.2579742372882 },
  { currency: "YieldUSD", price: 1.0290847966101695 },
  { currency: "ZIL", price: 0.01651813559322034 },
]

// Dummy balances for tokens
export const MOCK_BALANCES = {
  BLUR: 1250.5,
  bNEO: 45.2,
  BUSD: 3500,
  USD: 1000,
  ETH: 2.5,
  GMX: 12.8,
  STEVMOS: 5000,
  LUNA: 320,
  RATOM: 28.5,
  STRD: 890,
  EVMOS: 15000,
  IBCX: 8.2,
  IRIS: 45000,
  ampLUNA: 180,
  KUJI: 420,
  STOSMO: 650,
  USDC: 5000,
  axlUSDC: 2800,
  ATOM: 150,
  STATOM: 85,
  OSMO: 1200,
  rSWTH: 250000,
  STLUNA: 210,
  LSI: 4.5,
  OKB: 18,
  OKT: 35,
  SWTH: 500000,
  USC: 1500,
  WBTC: 0.15,
  wstETH: 1.8,
  YieldUSD: 2200,
  ZIL: 85000,
}

// Token balance
export const getBalance = (currency) => {
  return MOCK_BALANCES[currency] || 0
}

// Format number to display
export const formatNumber = (num) => {
  if (!num) return '0'
  if (Math.abs(num) < 1) return Number(num).toFixed(6)
  if (Math.abs(num) < 1000) return Number(num).toFixed(4)
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: 4 })
}

export const formatUSD = (value) => {
  if (!value) return '$0.00'
  return `$${Number(value).toFixed(2)}`
}
