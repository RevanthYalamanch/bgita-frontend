// Bridge for GET /api/lesson/progress → Python backend.
//
// The dashboard fetches this path directly. Next.js does NOT prefix-match
// `pages/api/lesson.js` onto `/api/lesson/progress`, so without this nested
// route the request 404s and server-side progress sync silently never happens
// (the localStorage mirror was masking it).
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    const backendRes = await fetch(`${backendUrl}/api/lesson/progress`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...auth },
    });
    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);
  } catch (error) {
    console.error("Lesson Progress Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
