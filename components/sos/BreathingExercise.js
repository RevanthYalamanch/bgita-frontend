// components/sos/BreathingExercise.js
// Guided paced breathing. An expanding/contracting circle paces the breath;
// two patterns — "Calm" (inhale 4s / exhale 6s, a longer exhale nudges the
// parasympathetic system) and "Box" (4-4-4-4). Pure CSS transition on the
// circle's transform, no animation library. Respects prefers-reduced-motion:
// when reduced, the circle stops scaling and users follow the text cue only.
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { tokens } from '../../lib/theme';

const PATTERNS = {
  coherent: {
    label: 'Calm · 4-6',
    phases: [
      { key: 'inhale', label: 'Breathe in', secs: 4 },
      { key: 'exhale', label: 'Breathe out', secs: 6 },
    ],
  },
  box: {
    label: 'Box · 4-4-4-4',
    phases: [
      { key: 'inhale', label: 'Breathe in', secs: 4 },
      { key: 'hold', label: 'Hold', secs: 4 },
      { key: 'exhale', label: 'Breathe out', secs: 4 },
      { key: 'hold2', label: 'Hold', secs: 4 },
    ],
  },
};

// Big on inhale / after inhale-hold; small on exhale / after exhale-hold.
const scaleFor = (phase) => {
  if (!phase) return 0.72;
  if (phase.key === 'inhale' || phase.key === 'hold') return 1;
  return 0.5;
};

export default function BreathingExercise() {
  const [patternKey, setPatternKey] = useState('coherent');
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const pattern = PATTERNS[patternKey];
  const phase = pattern.phases[phaseIndex];

  // Advance to the next phase after the current phase's duration.
  useEffect(() => {
    if (!running) return undefined;
    const cur = pattern.phases[phaseIndex];
    timerRef.current = setTimeout(() => {
      setPhaseIndex((i) => {
        const next = (i + 1) % pattern.phases.length;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, cur.secs * 1000);
    return () => clearTimeout(timerRef.current);
  }, [running, phaseIndex, patternKey]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const start = () => {
    setPhaseIndex(0);
    setCycles(0);
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const scale = running ? scaleFor(phase) : 0.72;
  // Match the transition to the phase length so the circle glides for the whole
  // breath; snap quickly when idle or when motion is reduced.
  const transitionSecs = running && !reduced.current ? phase.secs : 0.3;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={patternKey}
        onChange={(e, v) => v && !running && setPatternKey(v)}
        aria-label="Breathing pattern"
      >
        {Object.entries(PATTERNS).map(([key, p]) => (
          <ToggleButton key={key} value={key} disabled={running} sx={{ textTransform: 'none' }}>
            {p.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ position: 'relative', width: 240, height: 240, display: 'grid', placeItems: 'center' }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 42%, ${tokens.tealSurface}, transparent 72%)`,
            border: `2px solid ${tokens.teal}`,
            transform: `scale(${scale})`,
            transition: `transform ${transitionSecs}s ease-in-out`,
            willChange: 'transform',
          }}
        />
        <Typography
          variant="h6"
          role="status"
          aria-live="polite"
          sx={{ position: 'relative', color: tokens.teal, fontWeight: 700 }}
        >
          {running ? phase.label : 'Ready'}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" onClick={running ? stop : start} sx={{ minWidth: 140 }}>
          {running ? 'Pause' : 'Begin'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
          {cycles > 0 ? `${cycles} breath${cycles === 1 ? '' : 's'} completed` : 'Follow the circle at your own pace.'}
        </Typography>
      </Box>
    </Box>
  );
}
