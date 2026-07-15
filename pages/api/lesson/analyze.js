// Bridge for POST /api/lesson/analyze → Python backend (streaming).
//
// The backend streams a short reflection on the user's Practice-step answers as
// chunked text/plain; we pipe it straight through so the dashboard's existing
// streaming reader renders it token-by-token (same pattern as /api/chat).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const auth = req.headers.authorization ? { Authorization: req.headers.authorization } : {};
    // Forward the real client IP so the backend rate-limits per user.
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString();

    const backendRes = await fetch(`${backendUrl}/api/lesson/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...auth,
        ...(clientIp ? { 'X-Forwarded-For': clientIp } : {}),
      },
      body: JSON.stringify(req.body),
    });

    res.writeHead(backendRes.status, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    });

    if (!backendRes.body) {
      return res.end();
    }

    const reader = backendRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();

  } catch (error) {
    console.error("Lesson Analyze Bridge Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
    } else {
      res.end();
    }
  }
}
