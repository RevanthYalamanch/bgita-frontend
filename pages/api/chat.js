export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Hand-deliver the request to your Python FastAPI server

      const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    
      const backendRes = await fetch(`${backendUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        });
        
        const data = await backendRes.json();
        res.status(backendRes.status).json(data);
      } catch (error) {
        console.error("Bridge Error:", error);
        res.status(500).json({ reply: "Error: Failed to connect to Python backend. Is it running?" });
      }
    } else {
      res.status(405).json({ reply: 'Method not allowed' });
    }
  }