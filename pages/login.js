import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { fx, tokens } from '../lib/theme';

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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box className="fade-up" sx={{ width: '100%', maxWidth: 430 }}>

        {/* Brand */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box className="float-pulse" sx={{ width: 60, height: 60, borderRadius: '20px', display: 'grid', placeItems: 'center', fontSize: 30, mb: 2, background: fx.tealGradient, boxShadow: fx.glow }}>🧠</Box>
          <Typography variant="h4" fontWeight={800} sx={{ ...fx.brandGradientText }}>Cognitive Space</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, textAlign: 'center' }}>
            Bhagavad Gita–informed CBT, in plain modern language.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, ...fx.glassCard }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome back. Sign in to continue your journey.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth label="Email" variant="outlined" margin="normal"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <TextField
              fullWidth label="Password" type="password" variant="outlined" margin="normal" sx={{ mb: 3 }}
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />

            <Button
              fullWidth type="submit" variant="contained" size="large"
              sx={{ py: 1.4, fontWeight: 700 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Don&apos;t have an account?{' '}
            <Box component="span" sx={{ color: 'primary.light', cursor: 'pointer', fontWeight: 700 }} onClick={() => router.push('/register')}>
              Create one
            </Box>
          </Typography>
        </Paper>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.secondary', opacity: 0.75 }}>
          In crisis? Call or text <strong>988</strong> (US) anytime — you&apos;re not alone.
        </Typography>
      </Box>
    </Box>
  );
}
