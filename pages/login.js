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
      // 🗣️ This talks to your Next.js Bridge (File 2), NOT the Python server!
      // CORRECT: This talks to your internal Next.js bridge
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      // Success! Push to dashboard
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

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 1.5, fontWeight: 'bold' }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
