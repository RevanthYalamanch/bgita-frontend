export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

    // Forward the real client IP so the backend rate-limits per user, not per
    // (single) Next.js server.
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString();

    const backendRes = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the caller's bearer token so the backend can authenticate the
        // chat request (identity comes from the token, not the body email).
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(clientIp ? { 'X-Forwarded-For': clientIp } : {}),
      },
      body: JSON.stringify(req.body),
    });

    // The backend streams the reply as chunked text/plain. Pipe it straight
    // through to the browser so tokens render as they arrive.
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
    console.error("Chat Bridge Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ reply: "Error: Failed to connect to Python backend. Is it running?" });
    } else {
      res.end();
    }
  }
}
