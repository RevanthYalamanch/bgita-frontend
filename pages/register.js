import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#09090b', paper: '#18181b' }, primary: { main: '#14b8a6' } },
  typography: { fontFamily: 'sans-serif' }
});

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic validation before sending to the server
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setIsLoading(true);

    try {
      // 🗣️ This sends the data to your Next.js bridge!
      const response = await fetch(`/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, password: password, role: 'user' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to register account.");
      }

      // Success! Push them back to the login page
      router.push('/login');

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
            Create an account to begin your journey.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Full Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <TextField fullWidth label="Confirm Password" type="password" variant="outlined" margin="normal" sx={{ mb: 3 }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 1.5, fontWeight: 'bold' }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account? <span style={{ color: '#14b8a6', cursor: 'pointer' }} onClick={() => router.push('/login')}>Sign in here</span>
          </Typography>
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
}