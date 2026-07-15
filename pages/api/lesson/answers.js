// Bridge for GET /api/lesson/answers → Python backend.
//
// Returns the user's most recent saved answers per lesson so the dashboard can
// show "your previous response" and pre-fill the wizard on review/redo.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    const backendRes = await fetch(`${backendUrl}/api/lesson/answers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...auth },
    });
    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);
  } catch (error) {
    console.error("Lesson Answers Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
