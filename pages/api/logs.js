export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const backendRes = await fetch('http://127.0.0.1:8000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      
      const data = await backendRes.json();
      res.status(backendRes.status || 200).json(data);
    } catch (error) {
      console.error("Logs Bridge Error:", error);
      res.status(500).json({ status: "error", message: "Failed to connect to Python backend." });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}