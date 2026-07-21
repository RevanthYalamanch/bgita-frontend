import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box, Typography, Paper, Button, Divider, Alert, Link as MuiLink,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress,
} from '@mui/material';
import { ArrowBack, DeleteForever, Psychology } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';
import { apiFetch } from '../lib/api';

// Public account-deletion request page. Google Play (and Apple) require a
// publicly reachable URL — no login wall — where users can find out how to
// delete their account and data. This page:
//   1. States exactly what is deleted.
//   2. Lets an already-signed-in user delete directly (reuses DELETE /api/account).
//   3. Gives an email path for users who can't sign in.
// It is fully static (no SSR/auth), so it also ships in the Capacitor export.

const CONTACT_EMAIL = 'chigurupati04@gmail.com';

const DELETED_ITEMS = [
  'Your account (name, email, and login credentials)',
  'Journal / diary entries and mood check-in history',
  'Questionnaire responses and scores (PHQ-9, GAD-7)',
  'Lesson progress and exercise answers',
  'Coping-tool usage records',
  'Safety-event records associated with your account',
];

export default function DeleteAccount() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Read auth state on the client only (avoids an SSR/hydration mismatch, and
  // localStorage doesn't exist during static export/prerender).
  useEffect(() => {
    try {
      setHasSession(!!localStorage.getItem('token'));
    } catch {
      setHasSession(false);
    }
  }, []);

  const handleDelete = async () => {
    setError('');
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || 'Could not delete your account. Please try again.');
      }
      // Clear any local session so nothing lingers on this device.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      setDialogOpen(false);
      setDone(true);
      setHasSession(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Delete your account · Pl.AIto</title>
        <meta name="description" content="Request permanent deletion of your Pl.AIto account and all associated data." />
      </Head>
      <ThemeToggle floating />
      <Box sx={{ minHeight: '100vh', background: fx.pageBackground, py: { xs: 4, md: 8 }, px: 2 }}>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => (typeof window !== 'undefined' && window.history.length > 1 ? router.back() : router.push('/'))}
            sx={{ color: 'text.secondary', mb: 3, textTransform: 'none' }}
          >
            Back
          </Button>

          <Paper elevation={0} sx={{ ...fx.glassCard, p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Psychology sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Delete your account
              </Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              Pl.AIto — account &amp; data deletion request
            </Typography>

            <Divider sx={{ my: 3 }} />

            {done ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Your account and all associated data have been permanently deleted. Thank you for
                using Pl.AIto.
              </Alert>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                  What gets deleted
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 1.5 }}>
                  Deleting your account is <strong>permanent and cannot be undone</strong>. We
                  remove the following from our systems:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                  {DELETED_ITEMS.map((item, i) => (
                    <Typography key={i} component="li" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 0.75 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
                <Typography sx={{ color: tokens.textFaint, fontSize: 13, mb: 3 }}>
                  We may retain a limited record where required to comply with legal obligations;
                  such data is not used for any other purpose. See our{' '}
                  <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => router.push('/privacy')}>
                    Privacy Policy
                  </Box>
                  .
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Path 1 — signed-in user can delete right here. */}
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                  Option 1 — Delete now
                </Typography>
                {hasSession ? (
                  <>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                      You&apos;re signed in on this device. You can permanently delete your account
                      immediately.
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Button
                      variant="contained" color="error" startIcon={<DeleteForever />}
                      onClick={() => { setError(''); setDialogOpen(true); }}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                      Delete my account
                    </Button>
                  </>
                ) : (
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 1 }}>
                    <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => router.push('/login')}>
                      Sign in
                    </Box>{' '}
                    to your account, then open the dashboard and choose <strong>Delete account</strong>
                    {' '}in the footer. You can also return to this page once signed in to delete here.
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Path 2 — email request for users who can't sign in. */}
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                  Option 2 — Request by email
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  If you can&apos;t sign in, email us from the address on your account and we&apos;ll
                  delete it for you, typically within 30 days:
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <MuiLink
                    href={`mailto:${CONTACT_EMAIL}?subject=Account%20deletion%20request&body=Please%20delete%20my%20Pl.AIto%20account%20and%20all%20associated%20data.%20My%20registered%20email%20is%3A%20`}
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    {CONTACT_EMAIL}
                  </MuiLink>
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Confirmation dialog for the direct in-page deletion. */}
      <Dialog open={dialogOpen} onClose={() => !busy && setDialogOpen(false)}
        PaperProps={{ sx: { ...fx.glassCard, borderRadius: 0, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, color: 'error.main' }}>
          <DeleteForever /> Delete your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            This permanently deletes your account and <strong>all</strong> of your data. This{' '}
            <strong>cannot be undone</strong>.
          </DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={busy} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={busy} variant="contained" color="error"
            startIcon={busy ? <CircularProgress size={18} color="inherit" /> : <DeleteForever />}
            sx={{ fontWeight: 700, textTransform: 'none' }}>
            {busy ? 'Deleting…' : 'Delete permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
