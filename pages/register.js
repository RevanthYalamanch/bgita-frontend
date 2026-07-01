import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Sending the registration request to FastAPI
      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          admin_code: adminCode,
          role: adminCode ? 'admin' : 'user'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create account.");
      }

      // Success! Route them back to the login page
      alert("Account created successfully! Please log in.");
      router.push('/');

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
            Start your journey to better mental wellbeing.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, ...fx.glassCard }}>
          <Typography variant="h6" align="center" fontWeight={800} sx={{ mb: 3 }}>
            Create an Account
          </Typography>

          {/* Show Errors here if registration fails */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth label="Full Name" variant="outlined" margin="normal"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
            <TextField
              fullWidth label="Email" variant="outlined" margin="normal" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <TextField
              fullWidth label="Password" type="password" variant="outlined" margin="normal" sx={{ mb: 3 }}
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />

            {/* 🕵️ THE SECRET ADMIN FIELD */}
            <Box sx={{ mb: 4, p: 2, border: `1px dashed ${tokens.borderStrong}`, borderRadius: '12px', bgcolor: tokens.surfaceMuted }}>
              <TextField
                fullWidth label="Clinician Access Code (Optional)" type="password" variant="standard"
                value={adminCode} onChange={(e) => setAdminCode(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { color: 'text.primary' } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Leave blank for standard patient registration.
              </Typography>
            </Box>

            <Button
              fullWidth type="submit" variant="contained" size="large"
              sx={{ py: 1.4, fontWeight: 700 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          {/* THE LOGIN LINK */}
          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 700 }} onClick={() => router.push('/login')}>
              Sign in here
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
