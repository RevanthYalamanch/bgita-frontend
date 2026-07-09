// components/sos/UrgeSurfTimer.js
// Urge surfing (DBT distress tolerance): an urge is a wave — it rises, crests,
// and falls if you don't feed it. A countdown carries the user through the peak
// while reassurance copy rotates. An SVG ring shows progress (dependency-free).
// Default 5 minutes; the urge usually eases well before it ends.
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { tokens } from '../../lib/theme';

const DURATIONS = [
  { label: '3 min', secs: 180 },
  { label: '5 min', secs: 300 },
  { label: '7 min', secs: 420 },
];

// Shown in sequence as the timer progresses (0 → 1).
const MESSAGES = [
  'Notice the urge without acting on it. Just observe it.',
  'Where do you feel it in your body? Breathe into that place.',
  'Urges are like waves — this one is rising.',
  'You don’t have to push it away. Let it be here.',
  'The wave is cresting. You’re riding it, not drowning.',
  'Notice it beginning to ease. It always does.',
  'Almost through. The wave is falling.',
];

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function UrgeSurfTimer() {
  const [total, setTotal] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const pickDuration = (secs) => {
    if (running) return;
    setTotal(secs);
    setRemaining(secs);
  };
  const start = () => {
    if (remaining === 0) setRemaining(total);
    setRunning(true);
  };
  const stop = () => setRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(total);
  };

  const progress = total ? (total - remaining) / total : 0;
  const finished = remaining === 0;
  const msg = finished
    ? 'The wave has passed. Notice how you feel now.'
    : MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(progress * MESSAGES.length))];

  // SVG progress ring
  const R = 84;
  const C = 2 * Math.PI * R;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <ToggleButtonGroup exclusive size="small" value={total} onChange={(e, v) => v && pickDuration(v)}>
        {DURATIONS.map((d) => (
          <ToggleButton key={d.secs} value={d.secs} disabled={running} sx={{ textTransform: 'none' }}>
            {d.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ position: 'relative', width: 200, height: 200, display: 'grid', placeItems: 'center' }}>
        <Box component="svg" viewBox="0 0 200 200" sx={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} aria-hidden>
          <circle cx="100" cy="100" r={R} fill="none" stroke={tokens.surfaceHover} strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={tokens.teal}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ color: tokens.textPrimary }}>
          {fmt(remaining)}
        </Typography>
      </Box>

      <Typography
        variant="body1"
        role="status"
        aria-live="polite"
        sx={{ textAlign: 'center', minHeight: 48, maxWidth: 380, color: tokens.textSecondary }}
      >
        {msg}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="contained" onClick={running ? stop : start} sx={{ minWidth: 120 }}>
          {running ? 'Pause' : finished ? 'Again' : 'Begin'}
        </Button>
        <Button variant="outlined" onClick={reset} disabled={remaining === total && !running}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}
