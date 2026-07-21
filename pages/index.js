import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Track whether they are logging in as a 'user' or 'admin'
  const [loginMode, setLoginMode] = useState('user');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 
      
      // Send only email and password for login
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid email or password.");
      }

      const data = await response.json();

      // 🛡️ THE BOUNCER LOGIC
      // Check if they are actually an admin
      const isActuallyAdmin = data.user.role && data.user.role.includes('admin');

      if (loginMode === 'admin' && !isActuallyAdmin) {
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      // Save the user data securely, including their role
      localStorage.setItem('user', JSON.stringify({ 
        email: data.user.email, 
        name: data.user.name,
        role: data.user.role
      }));

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      // Route them to the correct dashboard
      if (loginMode === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

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
            <Typography variant="h4" fontWeight={800} sx={{ ...fx.brandGradientText }}>Pl.AIto</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, textAlign: 'center' }}>
              Ancient wisdom, reframed as modern CBT — in plain language.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, ...fx.glassCard }}>

            {/* Patient / Clinician segmented control */}
            <Box sx={{ display: 'flex', p: 0.5, mb: 3, borderRadius: '12px', bgcolor: tokens.surfaceHover, border: `1px solid ${tokens.border}` }}>
              {[{ k: 'user', label: 'Patient' }, { k: 'admin', label: 'Clinician' }].map((opt) => (
                <Box
                  key={opt.k}
                  component="button"
                  type="button"
                  onClick={() => setLoginMode(opt.k)}
                  sx={{
                    flex: 1, py: 1.1, borderRadius: '10px', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem', transition: 'all .2s ease',
                    color: loginMode === opt.k ? '#FFFFFF' : 'text.secondary',
                    background: loginMode === opt.k ? fx.tealGradient : 'transparent',
                    boxShadow: loginMode === opt.k ? '0 1px 2px rgba(15,23,42,0.12)' : 'none',
                  }}
                >
                  {opt.label}
                </Box>
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {loginMode === 'admin' ? 'Sign in to the clinician portal.' : 'Welcome back. Sign in to continue.'}
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : (loginMode === 'admin' ? 'Enter Clinician Portal' : 'Sign In')}
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
