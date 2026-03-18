import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#09090b', paper: '#18181b' }, primary: { main: '#14b8a6' } },
  typography: { fontFamily: 'sans-serif' }
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🔥 Your Cloud Shell Backend URL
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 
      
      // Sending the login request to FastAPI
      // Note: Change '/login' to '/api/login' if that is how your backend route is named!
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        // If the server sends a 401 Unauthorized or 404 Not Found
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid email or password.");
      }

      const data = await response.json();

      // Save the user data/token securely in the browser
      localStorage.setItem('user', JSON.stringify({ email: email }));
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      // Success! Send them to the dashboard
      router.push('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={0} sx={{ p: 5, width: '100%', maxWidth: 400, border: '1px solid #27272a', borderRadius: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 28, height: 28, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="h5" fontWeight="bold">Cognitive Space</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to continue your journey.
          </Typography>

          {/* Show Errors here if login fails */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField 
              fullWidth label="Email" variant="outlined" margin="normal" 
              value={email} onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <TextField 
              fullWidth label="Password" type="password" variant="outlined" margin="normal" sx={{ mb: 3 }} 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              required
            />
            
            <Button 
              fullWidth type="submit" variant="contained" size="large" 
              sx={{ py: 1.5, fontWeight: 'bold' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Don't have an account? <span style={{ color: '#14b8a6', cursor: 'pointer' }} onClick={() => router.push('/register')}>Register here</span>
          </Typography>
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
