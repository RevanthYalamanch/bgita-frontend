// Proxy for the SOS/coping-tool telemetry endpoint. Mirrors pages/api/logs.js:
// forwards the bearer token, POSTs the event to the Python backend. Logging is
// best-effort — the client fires it and ignores the result — so failures here
// never surface to the user.
export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendRes = await fetch(`${backendUrl}/api/tools/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify(req.body),
    });
    const data = await backendRes.json();
    return res.status(backendRes.status || 200).json(data);
  } catch (error) {
    console.error('Tools Bridge Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to connect to Python backend.' });
  }
}
