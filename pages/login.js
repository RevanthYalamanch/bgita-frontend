import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';
import { apiFetch } from '../lib/api';

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
      // On web this hits the Next.js proxy at /api/login; on native (Capacitor)
      // apiFetch redirects it straight to the Python backend. See lib/api.js.
      const response = await apiFetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      // Enforce the admin/user toggle before persisting the session.
      const isActuallyAdmin = data.user?.role && data.user.role.includes('admin');
      if (loginMode === 'admin' && !isActuallyAdmin) {
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      // Persist the session so the dashboard/admin pages (which read these on
      // mount) see an authenticated user. Without this the user landed on a
      // page with no token and was bounced straight back to login.
      localStorage.setItem('user', JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }));
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      router.push(loginMode === 'admin' ? '/admin' : '/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <ThemeToggle floating />
      <Box className="fade-up" sx={{ width: '100%', maxWidth: 430 }}>

        {/* Brand */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '16px', display: 'grid', placeItems: 'center', color: '#FFFFFF', mb: 2, background: fx.tealGradient, boxShadow: fx.glow }}><Psychology sx={{ fontSize: 30 }} /></Box>
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
            <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 700 }} onClick={() => router.push('/register')}>
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
