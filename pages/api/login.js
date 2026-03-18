export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    // 🌉 This talks directly to your Python FastAPI server
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const backendRes = await fetch(`${backendUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);

  } catch (error) {
    console.error("Login Bridge Error:", error);
    return res.status(500).json({ detail: "Failed to connect to the Python backend server." });
  }
}
