export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Ask Python for the telemetry data
    const backendRes = await fetch(`${backendUrl}/api/admin/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
      
    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);

  } catch (error) {
    console.error("Admin Bridge Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
  }
}
