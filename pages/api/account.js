// Proxy for account actions. Currently DELETE → permanently delete the
// authenticated user's account and all their data (Play/App Store deletion
// requirement). Mirrors the other pages/api/* bridges: forwards the bearer token
// and returns the backend's status verbatim. On native, apiFetch() calls the
// backend's /api/account directly (1:1 path, no rewrite needed).
export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};

  try {
    if (req.method === 'DELETE') {
      const backendRes = await fetch(`${backendUrl}/api/account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...auth },
      });
      const data = await backendRes.json();
      return res.status(backendRes.status || 200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error("Account Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
