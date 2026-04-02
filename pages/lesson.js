export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Forwarding the homework to your new Python endpoint
    const backendRes = await fetch(`${backendUrl}/api/lesson/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
      
    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);

  } catch (error) {
    console.error("Lesson Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
