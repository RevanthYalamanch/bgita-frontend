export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    // GET → read the user's saved lesson progress from the Python backend.
    if (req.method === 'GET') {
      const backendRes = await fetch(`${backendUrl}/api/lesson/progress`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...auth },
      });
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    }

    // POST → forward a completed lesson to the Python endpoint.
    if (req.method === 'POST') {
      const backendRes = await fetch(`${backendUrl}/api/lesson/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(req.body),
      });
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    }

    return res.status(405).json({ detail: 'Method Not Allowed' });
  } catch (error) {
    console.error("Lesson Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
