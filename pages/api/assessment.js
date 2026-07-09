// Proxy for standardized-screening (PHQ-9 / GAD-7) endpoints. Mirrors
// pages/api/logs.js: forwards the bearer token and relays the backend status.
//   GET  → the user's past screenings (for the trend view)
//   POST → save a completed screening; the backend recomputes score + severity
export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    if (req.method === 'GET') {
      const backendRes = await fetch(`${backendUrl}/api/assessment`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...auth },
      });
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    }

    if (req.method === 'POST') {
      const backendRes = await fetch(`${backendUrl}/api/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(req.body),
      });
      const data = await backendRes.json();
      return res.status(backendRes.status || 200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Assessment Bridge Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to connect to Python backend.' });
  }
}
