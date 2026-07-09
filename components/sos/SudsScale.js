// components/sos/SudsScale.js
// A 0–10 distress self-rating (SUDS — Subjective Units of Distress). Shown once
// before a tool and once after; the pre−post drop is the outcome signal. Fully
// optional — "Skip" lets a flooded user get straight to the tool. Purely a UI
// input; SosLauncher owns what happens with the value.
import React from 'react';
import { Box, Typography, ButtonBase, Button } from '@mui/material';
import { tokens } from '../../lib/theme';

// 0 = calm (teal) → 10 = overwhelming (red). Interpolated so the row reads as a
// gentle gradient without hardcoding 11 colors.
const colorForValue = (v) => {
  const t = v / 10;
  const from = [13, 148, 136]; // teal-600
  const to = [220, 38, 38]; // red-600
  const mix = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
};

export default function SudsScale({ prompt, onSelect, onSkip }) {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
        {prompt}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        0 = calm · 10 = overwhelming
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(11, 1fr)',
          gap: 0.75,
          maxWidth: 440,
          mx: 'auto',
          mb: 3,
        }}
      >
        {Array.from({ length: 11 }, (_, v) => (
          <ButtonBase
            key={v}
            onClick={() => onSelect(v)}
            aria-label={`Distress level ${v}`}
            sx={{
              aspectRatio: '1',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              bgcolor: colorForValue(v),
              transition: 'transform .12s ease, box-shadow .12s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px -8px rgba(8,12,20,0.6)' },
            }}
          >
            {v}
          </ButtonBase>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 440, mx: 'auto', mb: 2 }}>
        <Typography variant="caption" sx={{ color: tokens.textFaint }}>Calm</Typography>
        <Typography variant="caption" sx={{ color: tokens.textFaint }}>Overwhelming</Typography>
      </Box>

      <Button onClick={onSkip} sx={{ color: 'text.secondary' }}>
        Skip
      </Button>
    </Box>
  );
}
