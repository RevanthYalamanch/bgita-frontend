// components/sos/SosLauncher.js
// Persistent "Reset" launcher: an always-visible FAB that opens a distraction-
// free modal (full-screen on phones) of in-the-moment coping tools. Rendered
// once on the dashboard, outside the tab panels, so it's reachable from every
// tab and mid-lesson — the whole point is instant access when someone is
// flooded. The footer always links to 988, bridging to the crisis path.
//
// Phase 2 adds an optional SUDS (0–10) self-rating before and after the three
// interactive tools; the pre−post delta is logged best-effort to /api/tools/log
// so the clinician portal can show "which tools actually help." Logging never
// blocks the tool, and every tool still works fully offline.
import React, { useState, useRef } from 'react';
import { Fab, Dialog, Box, IconButton, Typography, Button, Link, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SelfImprovement, Close, ArrowBack, CheckCircle } from '@mui/icons-material';
import { tokens, fx } from '../../lib/theme';
import { apiFetch } from '../../lib/api';
import { SOS_TOOLS } from '../../lib/sosTools';
import ToolkitMenu from './ToolkitMenu';
import SudsScale from './SudsScale';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import UrgeSurfTimer from './UrgeSurfTimer';
import TippCard from './TippCard';

// Tools that get the pre/post distress rating. TIPP is a reference card ("read
// now"), so it's shown directly with no rating and no logging.
const RATED = new Set(['breathing', 'grounding', 'urge']);

export default function SosLauncher({ sessionId }) {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState(null);
  const [stage, setStage] = useState('active'); // 'pre' | 'active' | 'post' (only meaningful once a tool is picked)
  const [pre, setPre] = useState(null);
  const startRef = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const activeMeta = SOS_TOOLS.find((t) => t.id === tool);

  // Fire-and-forget: record a completed/abandoned tool session. Never throws
  // into the UI — a failed log must not disturb a coping session.
  const logEvent = (post, completed) => {
    if (!tool) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    const durationSec = startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : null;
    apiFetch('/api/tools/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        tool_id: tool,
        session_id: sessionId || 'anonymous_session',
        duration_sec: durationSec,
        completed,
        pre_distress: pre,
        post_distress: post,
      }),
    }).catch(() => {});
  };

  const openLauncher = () => {
    // Reset here (not on close) so content doesn't flash to the menu mid-close.
    setTool(null);
    setStage('active');
    setPre(null);
    startRef.current = null;
    setOpen(true);
  };

  const closeLauncher = () => {
    // If they bail mid-tool without rating, still capture the session as used.
    if (tool && RATED.has(tool) && stage === 'active') logEvent(null, false);
    setOpen(false);
  };

  const backToMenu = () => {
    setTool(null);
    setStage('active');
    setPre(null);
    startRef.current = null;
  };

  const selectTool = (id) => {
    setTool(id);
    if (RATED.has(id)) {
      setPre(null);
      setStage('pre');
    } else {
      startRef.current = Date.now();
      setStage('active');
    }
  };

  const beginActive = () => {
    startRef.current = Date.now();
    setStage('active');
  };

  const renderToolBody = () => {
    switch (tool) {
      case 'breathing':
        return <BreathingExercise />;
      case 'grounding':
        return <GroundingExercise />;
      case 'urge':
        return <UrgeSurfTimer />;
      case 'tipp':
        return <TippCard onNavigate={selectTool} />;
      default:
        return null;
    }
  };

  const renderBody = () => {
    if (!tool) return <ToolkitMenu onSelect={selectTool} />;
    if (stage === 'pre') {
      return (
        <SudsScale
          prompt="Before we start — how strong is it right now?"
          onSelect={(v) => {
            setPre(v);
            beginActive();
          }}
          onSkip={() => {
            setPre(null);
            beginActive();
          }}
        />
      );
    }
    if (stage === 'post') {
      return (
        <SudsScale
          prompt="And how about now?"
          onSelect={(v) => {
            logEvent(v, true);
            backToMenu();
          }}
          onSkip={() => {
            logEvent(null, true);
            backToMenu();
          }}
        />
      );
    }
    // active
    return (
      <>
        {renderToolBody()}
        {RATED.has(tool) && (
          <Box sx={{ mt: 4, pt: 2.5, borderTop: `1px solid ${tokens.border}`, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<CheckCircle />}
              onClick={() => setStage('post')}
            >
              I&apos;m done
            </Button>
          </Box>
        )}
      </>
    );
  };

  const headerTitle = !tool ? 'Take a moment' : activeMeta ? activeMeta.title : 'Take a moment';
  const showBack = !!tool && stage !== 'post'; // during post, use Skip/rate rather than back

  return (
    <>
      <Fab
        variant="extended"
        onClick={openLauncher}
        aria-label="Open the reset toolkit for in-the-moment coping"
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 28 },
          right: { xs: 20, sm: 28 },
          zIndex: 1200,
          bgcolor: tokens.teal,
          color: '#FFFFFF',
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: fx.glow,
          '&:hover': { bgcolor: tokens.tealDark },
        }}
      >
        <SelfImprovement sx={{ mr: 1 }} /> Reset
      </Fab>

      <Dialog
        open={open}
        onClose={closeLauncher}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            ...fx.glassCard,
            borderRadius: fullScreen ? 0 : '20px',
            m: fullScreen ? 0 : 2,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header — back button appears once a tool is open (except during the post rating) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${tokens.border}`,
            bgcolor: tokens.surfaceMuted,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            {showBack && (
              <IconButton onClick={backToMenu} aria-label="Back to toolkit" edge="start">
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={800} noWrap>
              {headerTitle}
            </Typography>
          </Box>
          <IconButton onClick={closeLauncher} aria-label="Close">
            <Close />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>{renderBody()}</Box>

        {/* Crisis bridge — always visible */}
        <Box sx={{ p: 1.5, borderTop: `1px solid ${tokens.border}`, textAlign: 'center', bgcolor: tokens.surfaceMuted }}>
          <Typography variant="caption" color="text.secondary">
            In immediate danger or thinking of harming yourself?{' '}
            <Link href="tel:988" sx={{ fontWeight: 800, color: tokens.teal }}>
              Call or text 988
            </Link>
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}
