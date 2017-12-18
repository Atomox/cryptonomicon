module.exports = {
  react: {
    host: '127.0.0.1',
    port: 30002,
    protocol: 'http://',
    calls: {
      'server': {
        host: 'http://127.0.0.1',
        port:'30001',
      }
    },
    symbols: ['BTC', 'ETH', 'LSK', 'OMG', 'CVC', 'GNT', 'NEO',  'ADA', 'XVG', 'XLM', 'ARK', 'XRP', 'NXT', 'ERC', 'ltc', 'IOT', 'XMR', 'xas', 'ETHOS'],
  }
  server: {
    // Docker requires 0.0.0.0
    host: '0.0.0.0',
    port: 30001,
    protocol: 'http://',
  }
};
