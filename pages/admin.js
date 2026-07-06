import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Typography, Button,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Tabs, Tab, Alert, Badge, Dialog, DialogTitle, DialogContent, IconButton, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowBack, Speed, MenuBook, Mood, WarningAmber, Refresh, Close } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';

// A quick helper to show tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div hidden={value !== index} {...other}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>;
}

// Safely format a timestamp — guards null / invalid dates so a bad row can't
// render "Invalid Date" or crash the table.
function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

// Theme-aware mood chip styling (works in light AND dark mode, unlike the old
// hardcoded hex). mood ≤2 = error, 3 = warning, ≥4 = success.
function moodSx(theme, moodRaw) {
  const mood = Number(moodRaw);
  const key = mood <= 2 ? 'error' : (mood === 3 ? 'warning' : 'success');
  const c = theme.palette[key].main;
  return {
    bgcolor: alpha(c, 0.15),
    color: theme.palette.mode === 'dark' ? theme.palette[key].light || c : theme.palette[key].dark || c,
    px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 'bold', whiteSpace: 'nowrap',
  };
}

// Dependency-free inline SVG sparkline of a mood series (1–5 over time).
function MoodSparkline({ series }) {
  const points = (series || []).map((r) => Number(r.mood)).filter((n) => !isNaN(n));
  if (points.length < 2) {
    return <Typography variant="body2" color="text.secondary">Not enough check-ins to chart a trend.</Typography>;
  }
  const W = 320, H = 72, pad = 8;
  const innerW = W - pad * 2, innerH = H - pad * 2;
  const coords = points.map((m, i) => {
    const x = pad + (points.length === 1 ? 0 : (i / (points.length - 1)) * innerW);
    const y = pad + innerH - ((Math.min(5, Math.max(1, m)) - 1) / 4) * innerH;
    return [x, y];
  });
  const path = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const stroke = last <= 2 ? '#DC2626' : (last === 3 ? '#D97706' : '#059669');
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label="Mood trend">
        <polyline points={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {coords.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill={stroke} />)}
      </svg>
    </Box>
  );
}

// A small labelled statistic card for the summary strip.
function StatCard({ label, value, alert }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...fx.glassCard, borderRadius: '16px', p: 2, flex: '1 1 140px', minWidth: 140,
        ...(alert ? { borderColor: (t) => t.palette.error.main, bgcolor: (t) => alpha(t.palette.error.main, 0.06) } : {}),
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: (t) => (alert ? t.palette.error.main : 'text.primary') }}>
        {value}
      </Typography>
    </Paper>
  );
}

// Clickable email cell → opens the per-patient drill-down.
function EmailCell({ email, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onClick(email)}
      sx={{
        p: 0, border: 'none', background: 'none', cursor: 'pointer', font: 'inherit',
        color: 'primary.main', fontWeight: 600, textAlign: 'left',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {email || '—'}
    </Box>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📦 Store all datasets + summary aggregates
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    telemetry: [],
    lessons: [],
    logs: [],
    crisis: [],
  });

  // Per-patient drill-down dialog
  const [patientEmail, setPatientEmail] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    setError(null);
    try {
      // The bridge file forwards to the Python endpoint.
      const response = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend rejects non-admins (401/403) — send them away.
      if (response.status === 401 || response.status === 403) {
        router.push('/');
        return;
      }

      const result = await response.json();
      if (result.status === 'success') {
        setDashboardData({
          summary: result.data.summary || {},
          telemetry: result.data.telemetry || [],
          lessons: result.data.lessons || [],
          logs: result.data.logs || [],
          crisis: result.data.crisis || [],
        });
      } else {
        setError(result.message || 'The server returned an unexpected response.');
      }
    } catch (err) {
      console.error("Failed to load metrics", err);
      setError('Could not reach the metrics service. Check the backend and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userString || !token) {
      router.push('/');
      return;
    }
    fetchMetrics();
  }, [router, fetchMetrics]);

  const openPatient = useCallback(async (email) => {
    if (!email) return;
    setPatientEmail(email);
    setPatientData(null);
    setPatientLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/patient?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.status === 'success') setPatientData(result.data);
    } catch (err) {
      console.error("Failed to load patient detail", err);
    } finally {
      setPatientLoading(false);
    }
  }, []);

  const s = dashboardData.summary || {};
  const crisisCount = dashboardData.crisis.length;

  return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, minHeight: '100vh' }}>

        {/* HEADER */}
        <Box className="fade-up" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ ...fx.brandGradientText }}>Command Center</Typography>
            <Typography variant="body2" color="text.secondary">Live Telemetry, Progress & Clinical Outcomes</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            <Button startIcon={<Refresh />} onClick={fetchMetrics} variant="outlined" disabled={isLoading}>
              Refresh
            </Button>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/dashboard')} variant="outlined">
              Back to App
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }} action={
            <Button color="inherit" size="small" onClick={fetchMetrics}>Retry</Button>
          }>
            {error}
          </Alert>
        )}

        {/* SUMMARY STAT STRIP */}
        {!isLoading && !error && (
          <Box className="fade-up" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <StatCard label="Active Users" value={s.active_users ?? 0} />
            <StatCard label="Total Chats" value={s.total_chats ?? 0} />
            <StatCard label="Avg Latency" value={`${s.avg_latency_sec ?? 0}s`} />
            <StatCard label="Lessons Done" value={s.lessons_completed ?? 0} />
            <StatCard label="Avg Mood" value={`${s.avg_mood ?? 0} / 5`} />
            <StatCard label="Safety Alerts" value={s.crisis_count ?? crisisCount} alert={(s.crisis_count ?? crisisCount) > 0} />
          </Box>
        )}

        {/* NAVIGATION TABS */}
        <Paper elevation={0} sx={{ ...fx.glassCard, borderRadius: '20px', overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: `1px solid ${tokens.border}`, bgcolor: tokens.surfaceMuted }}>
            <Tab icon={<Speed />} iconPosition="start" label="AI Telemetry" />
            <Tab icon={<MenuBook />} iconPosition="start" label="Lesson Progress" />
            <Tab icon={<Mood />} iconPosition="start" label="Mood Check-Ins" />
            <Tab
              icon={
                <Badge badgeContent={crisisCount} color="error">
                  <WarningAmber />
                </Badge>
              }
              iconPosition="start"
              label="Safety Alerts"
              sx={{ color: crisisCount > 0 ? 'error.main' : undefined }}
            />
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
          ) : (
            <Box sx={{ p: 2 }}>

              {/* TAB 1: AI TELEMETRY */}
              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Session</TableCell>
                        <TableCell align="right">Latency</TableCell>
                        <TableCell align="right">Tokens Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.telemetry.length === 0 ? <TableRow><TableCell colSpan={5} align="center">No data.</TableCell></TableRow> : dashboardData.telemetry.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{fmtDate(row.created_at)}</TableCell>
                          <TableCell><EmailCell email={row.email} onClick={openPatient} /></TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{row.session_id ? `${row.session_id.substring(0, 8)}...` : '—'}</TableCell>
                          <TableCell align="right" sx={{ color: row.prompt_time_sec > 5 ? 'error.main' : 'inherit' }}>{row.prompt_time_sec}s</TableCell>
                          <TableCell align="right">{row.output_tokens}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* TAB 2: LESSON PROGRESS */}
              <TabPanel value={tabValue} index={1}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Completion Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell align="right">Module Completed</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.lessons.length === 0 ? <TableRow><TableCell colSpan={3} align="center">No data.</TableCell></TableRow> : dashboardData.lessons.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{fmtDate(row.completed_at)}</TableCell>
                          <TableCell><EmailCell email={row.email} onClick={openPatient} /></TableCell>
                          <TableCell align="right">
                            <Box component="span" sx={{ bgcolor: tokens.tealSurface, color: tokens.tealDark, fontWeight: 700, px: 1.5, py: 0.5, borderRadius: 1, border: `1px solid ${tokens.border}` }}>
                              Module {row.lesson_id}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* TAB 3: MOOD CHECK-INS */}
              <TabPanel value={tabValue} index={2}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell align="right">Reported Mood</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.logs.length === 0 ? <TableRow><TableCell colSpan={3} align="center">No data.</TableCell></TableRow> : dashboardData.logs.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{fmtDate(row.timestamp)}</TableCell>
                          <TableCell><EmailCell email={row.email} onClick={openPatient} /></TableCell>
                          <TableCell align="right">
                            <Box component="span" sx={(theme) => moodSx(theme, row.mood)}>
                              {row.mood} / 5
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* TAB 4: SAFETY ALERTS */}
              <TabPanel value={tabValue} index={3}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Session</TableCell>
                        <TableCell>Flagged Message</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.crisis.length === 0 ? (
                        <TableRow><TableCell colSpan={4} align="center">No safety alerts. 🙏</TableCell></TableRow>
                      ) : dashboardData.crisis.map((row, i) => (
                        <TableRow key={i} sx={{ bgcolor: (t) => alpha(t.palette.error.main, 0.05) }}>
                          <TableCell>{fmtDate(row.created_at)}</TableCell>
                          <TableCell><EmailCell email={row.email} onClick={openPatient} /></TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{row.session_id ? `${row.session_id.substring(0, 8)}...` : '—'}</TableCell>
                          <TableCell sx={{ color: 'error.main', maxWidth: 380 }}>{row.message_excerpt || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

            </Box>
          )}
        </Paper>

        {/* PER-PATIENT DRILL-DOWN DIALOG */}
        <Dialog open={!!patientEmail} onClose={() => setPatientEmail(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} noWrap>Patient Detail</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{patientEmail}</Typography>
            </Box>
            <IconButton onClick={() => setPatientEmail(null)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {patientLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : !patientData ? (
              <Alert severity="error">Could not load this patient's detail.</Alert>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <StatCard label="Chats" value={patientData.chat_count ?? 0} />
                  <StatCard label="Lessons" value={patientData.lessons?.length ?? 0} />
                  <StatCard label="Safety Alerts" value={patientData.crisis_count ?? 0} alert={(patientData.crisis_count ?? 0) > 0} />
                </Box>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Mood Trend</Typography>
                <MoodSparkline series={patientData.mood_series} />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Last Active: <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>{fmtDate(patientData.last_active)}</Box>
                </Typography>

                {patientData.lessons?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Completed Modules</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {patientData.lessons.map((l, i) => (
                        <Box key={i} component="span" sx={{ bgcolor: tokens.tealSurface, color: tokens.tealDark, fontWeight: 700, px: 1.5, py: 0.5, borderRadius: 1, border: `1px solid ${tokens.border}`, fontSize: '0.8rem' }}>
                          Module {l.lesson_id}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

      </Box>
  );
}
