// components/sos/GroundingExercise.js
// The 5-4-3-2-1 sensory grounding technique — steps the user down through the
// five senses to pull attention out of a thought-spiral and back into the room.
// A one-at-a-time stepper (less overwhelming than a wall of prompts); the text
// field is optional and purely local — nothing is stored or sent.
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, LinearProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { tokens } from '../../lib/theme';

const STEPS = [
  { count: 5, verb: 'see', prompt: 'Look around and name 5 things you can see.' },
  { count: 4, verb: 'feel', prompt: 'Notice 4 things you can feel — your feet, the chair, the air.' },
  { count: 3, verb: 'hear', prompt: 'Listen for 3 sounds around you.' },
  { count: 2, verb: 'smell', prompt: 'Find 2 things you can smell (or 2 smells you like).' },
  { count: 1, verb: 'taste', prompt: 'Notice 1 thing you can taste.' },
];

export default function GroundingExercise() {
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState('');
  const done = index >= STEPS.length;
  const step = STEPS[index];

  const next = () => {
    setNote('');
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setNote('');
    setIndex(0);
  };

  if (done) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle sx={{ fontSize: 56, color: tokens.teal, mb: 1.5 }} />
        <Typography variant="h6" fontWeight={800} gutterBottom>
          You&apos;re here, in this moment.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto', mb: 3 }}>
          Notice how your attention settled a little. That&apos;s the skill — you can come back to it any time.
        </Typography>
        <Button variant="outlined" onClick={restart}>Go again</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <LinearProgress variant="determinate" value={(index / STEPS.length) * 100} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={800} sx={{ color: tokens.teal, lineHeight: 1 }}>
          {step.count}
        </Typography>
        <Typography variant="overline" color="text.secondary">
          things you can {step.verb}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ textAlign: 'center', color: tokens.textPrimary }}>
        {step.prompt}
      </Typography>

      <TextField
        placeholder="Optional — jot them down"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        multiline
        minRows={2}
        fullWidth
      />

      <Button variant="contained" onClick={next} size="large">
        {index === STEPS.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Box>
  );
}
