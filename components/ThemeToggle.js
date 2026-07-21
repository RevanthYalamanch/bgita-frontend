import { useEffect, useState } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';

// Light/dark switch. Reads and sets the mode via MUI's color-scheme system
// (persisted to localStorage as `mui-mode`; the theme flips the `.dark` class on
// <html>, which recolors both MUI and our --c-* tokens).
//
// Props:
//   floating — render as a fixed control (top-right) for pages without a header.
//              Otherwise renders a bare IconButton to drop into an existing bar.
export default function ThemeToggle({ floating = false }) {
  const { mode, systemMode, setMode } = useColorScheme();

  // useColorScheme() has no value during SSR / before mount, so gate on mounted
  // to avoid a hydration mismatch on the icon.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolved = mode === 'system' ? systemMode : mode;
  const isDark = resolved === 'dark';

  const button = (
    <Tooltip title={mounted ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : ''}>
      <IconButton
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        color="inherit"
        aria-label="Toggle light and dark mode"
        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
      >
        {/* Render a stable icon until mounted; swap once the real mode is known. */}
        {mounted && isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );

  if (!floating) return button;

  return (
    <Box
      sx={{
        position: 'fixed',
        // Keep clear of the iOS status bar / notch (insets are 0 on web).
        top: 'calc(env(safe-area-inset-top) + 16px)',
        right: 'calc(env(safe-area-inset-right) + 16px)',
        zIndex: 1300,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        boxShadow: 3,
      }}
    >
      {button}
    </Box>
  );
}
