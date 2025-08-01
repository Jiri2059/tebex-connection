import axios from 'axios';

export default async function handler(req, res) {
  const { transactionId } = req.query;

  if (!transactionId || !transactionId.startsWith('tbx-')) {
    return res.status(400).json({ success: false, error: 'Invalid or missing transactionId' });
  }

  try {
    const response = await axios.get(`https://plugin.tebex.io/payments/${transactionId}`, {
      headers: {
        'X-Tebex-Secret': process.env.TEBEX_SECRET,
        'User-Agent': 'Vercel-Tebex-Verify',
      },
    });

    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    console.error(err.message);
    return res.status(500).json({ success: false, error: 'Server error or blocked by Cloudflare' });
  }
}
