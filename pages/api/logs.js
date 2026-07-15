export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    // GET → read the user's past daily check-ins (history + "already checked in
    // today" detection).
    if (req.method === 'GET') {
      const backendRes = await fetch(`${backendUrl}/api/logs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...auth },
      });
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    }

    // POST → save a new daily check-in.
    if (req.method === 'POST') {
      const backendRes = await fetch(`${backendUrl}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(req.body),
      });
      const data = await backendRes.json();
      return res.status(backendRes.status || 200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Logs Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
