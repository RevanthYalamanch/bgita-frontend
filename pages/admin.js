import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Tabs, Tab
} from '@mui/material';
import { ArrowBack, Speed, MenuBook, Mood } from '@mui/icons-material';

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#09090b', paper: '#18181b' }, primary: { main: '#14b8a6' } },
  typography: { fontFamily: 'sans-serif' }
});

// A quick helper to show tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div hidden={value !== index} {...other}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 📦 Store all three datasets
  const [dashboardData, setDashboardData] = useState({
    telemetry: [],
    lessons: [],
    logs: []
  });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/');
      return;
    }

    const fetchMetrics = async () => {
      try {
        // Your bridge file automatically forwards to the Python endpoint
        const response = await fetch('/api/admin');
        const result = await response.json();
        
        if (result.status === 'success') {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [router]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">Command Center</Typography>
            <Typography variant="body2" color="text.secondary">Live Telemetry, Progress & Clinical Outcomes</Typography>
          </Box>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/dashboard')} variant="outlined">
            Back to App
          </Button>
        </Box>

        {/* NAVIGATION TABS */}
        <Paper elevation={0} sx={{ border: '1px solid #27272a', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#0f0f13' }}>
            <Tab icon={<Speed />} iconPosition="start" label="AI Telemetry" />
            <Tab icon={<MenuBook />} iconPosition="start" label="Lesson Progress" />
            <Tab icon={<Mood />} iconPosition="start" label="Mood Check-Ins" />
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
                          <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                          <TableCell sx={{ color: 'primary.main' }}>{row.email}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{row.session_id.substring(0, 8)}...</TableCell>
                          <TableCell align="right" sx={{ color: row.prompt_time_sec > 5 ? '#ef4444' : 'inherit' }}>{row.prompt_time_sec}s</TableCell>
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
                          <TableCell>{new Date(row.completed_at).toLocaleString()}</TableCell>
                          <TableCell sx={{ color: 'primary.main' }}>{row.email}</TableCell>
                          <TableCell align="right">
                            <Box component="span" sx={{ bgcolor: 'primary.dark', px: 1.5, py: 0.5, borderRadius: 1 }}>
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
                          <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                          <TableCell sx={{ color: 'primary.main' }}>{row.email}</TableCell>
                          <TableCell align="right">
                            <Box component="span" sx={{ 
                              bgcolor: row.mood <= 2 ? '#7f1d1d' : (row.mood == 3 ? '#713f12' : '#14532d'), 
                              px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 'bold' 
                            }}>
                              {row.mood} / 5
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

            </Box>
          )}
        </Paper>

      </Box>
    </ThemeProvider>
  );
}