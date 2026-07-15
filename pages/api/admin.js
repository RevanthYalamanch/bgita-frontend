export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  
    const backendRes = await fetch(`${backendUrl}/api/admin/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward the caller's bearer token so the backend can authorize.
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
    });
      
    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);

  } catch (error) {
    console.error("Admin Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
