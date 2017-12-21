function formatPercent (num) {
  return parseFloat(Math.round(num * 1000) / 1000).toFixed(2);
}

function percentChange (price, owned, spent) {
  if (owned == 0) { return 0; }

  let breakeven = spent / owned;              // Spent / Owned
  let profit = (price - breakeven) * owned;   // Profit: (Curr Price - Breakeven) * Owned
  let growth = (profit / spent) * 100;        // Growth: Profit / Spent
  return this.formatPercent(growth);
}


module.exports = {
  formatPercent,
  percentChange,
};
