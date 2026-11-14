// Función de Vercel: consulta Binance P2P (COMPRAR USDT con Bs) desde el servidor
// y devuelve el precio del primer anuncio que acepta el monto indicado.
module.exports = async (req, res) => {
  try {
    const amt = String(parseInt(req.query.amt, 10) || 30000);
    const r = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({
        fiat: 'VES', asset: 'USDT', tradeType: 'BUY', transAmount: amt,
        page: 1, rows: 5, payTypes: [], publisherType: null, countries: []
      })
    });
    const j = await r.json();
    const price = parseFloat(j && j.data && j.data[0] && j.data[0].adv && j.data[0].adv.price);
    if (!(price > 0)) throw new Error('Sin anuncios para ese monto');
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json({ price, amt: Number(amt) });
  } catch (e) {
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
