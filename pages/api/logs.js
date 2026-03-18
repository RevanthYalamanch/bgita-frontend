export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fixed: Removed hardcoded localhost
    const backendRes = await fetch(`${backendUrl}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    
    const data = await backendRes.json();
    return res.status(backendRes.status || 200).json(data);

  } catch (error) {
    console.error("Logs Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
