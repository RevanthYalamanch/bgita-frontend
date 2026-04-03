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
          admin_code: adminCode // 👈 The secret passcode is sent here!
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={0} sx={{ p: 5, width: '100%', maxWidth: 400, border: '1px solid #27272a', borderRadius: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 28, height: 28, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="h5" fontWeight="bold">Cognitive Space</Typography>
          </Box>

          <Typography variant="h6" align="center" fontWeight="bold" sx={{ mb: 1 }}>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Start your journey to better mental wellbeing.
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
            <Box sx={{ mb: 4, p: 2, border: '1px dashed #3f3f46', borderRadius: 1, bgcolor: '#0f0f13' }}>
              <TextField 
                fullWidth label="Admin Access Code (Optional)" type="password" variant="standard" 
                value={adminCode} onChange={(e) => setAdminCode(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { color: '#fecaca' } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Leave blank for standard patient registration.
              </Typography>
            </Box>
            
            <Button 
              fullWidth type="submit" variant="contained" size="large" 
              sx={{ py: 1.5, fontWeight: 'bold' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          {/* THE LOGIN LINK */}
          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account? <span style={{ color: '#14b8a6', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => router.push('/')}>Sign in here</span>
          </Typography>
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
