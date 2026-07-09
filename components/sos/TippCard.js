// components/sos/TippCard.js
// TIPP (DBT) — the fastest way to bring down very high distress by changing
// body chemistry: Temperature, Intense exercise, Paced breathing, Paired muscle
// relaxation. This is a reference card (psychoeducation); the paced-breathing
// item hands off to the interactive breathing tool via onNavigate.
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { AcUnit, DirectionsRun, Air, Spa } from '@mui/icons-material';
import { tokens } from '../../lib/theme';

const ITEMS = [
  {
    icon: AcUnit,
    title: 'Temperature',
    body: 'Hold something cold to your face — cold water, an ice pack — for ~30 seconds while you hold your breath. This triggers the “dive reflex” and slows your heart fast.',
  },
  {
    icon: DirectionsRun,
    title: 'Intense exercise',
    body: 'Do ~60 seconds of hard movement: jumping jacks, running in place, fast stairs. It burns off the surge of stress energy.',
  },
  {
    icon: Air,
    title: 'Paced breathing',
    body: 'Breathe out longer than you breathe in — about 4 in, 6 out — for a minute or two.',
    action: 'breathing',
  },
  {
    icon: Spa,
    title: 'Paired muscle relaxation',
    body: 'As you breathe out, tense a muscle group (fists, shoulders, jaw), then release it completely. Work down through the body.',
  },
];

export default function TippCard({ onNavigate }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        When distress is very high, change your body first — thoughts settle after. Pick one and start now.
      </Typography>

      {ITEMS.map(({ icon: Icon, title, body, action }) => (
        <Paper key={title} elevation={0} sx={{ p: 2, display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
          <Box
            sx={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              color: tokens.teal,
              bgcolor: tokens.tealSurface,
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={800}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{body}</Typography>
            {action && onNavigate && (
              <Button size="small" onClick={() => onNavigate(action)} sx={{ mt: 0.75, px: 0 }}>
                Start paced breathing →
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
