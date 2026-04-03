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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={0} sx={{ p: 5, width: '100%', maxWidth: 400, border: '1px solid #27272a', borderRadius: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
            <Box sx={{ width: 28, height: 28, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="h5" fontWeight="bold">Cognitive Space</Typography>
          </Box>

          {/* 🔘 THE PATIENT / ADMIN TOGGLE */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              type="button"
              onClick={() => setLoginMode('user')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: '0.2s',
                backgroundColor: loginMode === 'user' ? '#14b8a6' : '#27272a',
                color: loginMode === 'user' ? '#000' : '#a1a1aa'
              }}
            >
              Patient
            </button>
            <button 
              type="button"
              onClick={() => setLoginMode('admin')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: '0.2s',
                backgroundColor: loginMode === 'admin' ? '#7f1d1d' : '#27272a',
                color: loginMode === 'admin' ? '#fecaca' : '#a1a1aa'
              }}
            >
              Admin
            </button>
          </div>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {loginMode === 'admin' ? "Sign in to the Admin Portal." : "Sign in to continue your journey."}
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
              sx={{ py: 1.5, fontWeight: 'bold', bgcolor: loginMode === 'admin' ? '#7f1d1d' : 'primary.main', '&:hover': { bgcolor: loginMode === 'admin' ? '#991b1b' : 'primary.dark' } }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : (loginMode === 'admin' ? "Enter Admin Portal" : "Sign In")}
            </Button>
          </form>

          {/* THE REGISTER LINK */}
          <Typography align="center" variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Don't have an account? <span style={{ color: '#14b8a6', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => router.push('/register')}>Register here</span>
          </Typography>
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
