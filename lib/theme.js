// lib/theme.js
// Shared "Polished Dark" clinical design system. One source of truth for every
// page (login, register, dashboard, admin) so the app feels like a single,
// premium product instead of six separately-themed screens.
//
// Identity: deep blue-black canvas, glassy surfaces, teal primary with a soft
// glow, indigo accent, refined typography and generous radii.
import { createTheme } from '@mui/material/styles';

// --- Design tokens -----------------------------------------------------------
export const tokens = {
  bg: '#0B0F14',
  bgElevated: '#0F151C',
  surface: '#151B23',
  surfaceGlass: 'rgba(21, 27, 35, 0.72)',
  surfaceGlassStrong: 'rgba(24, 31, 41, 0.9)',
  border: 'rgba(148, 163, 184, 0.12)',
  borderStrong: 'rgba(148, 163, 184, 0.22)',
  teal: '#2DD4BF',
  tealLight: '#5EEAD4',
  tealDark: '#0D9488',
  indigo: '#818CF8',
  textPrimary: '#E6EAF2',
  textSecondary: '#94A3B8',
  textFaint: '#64748B',
};

// Reusable visual recipes pages can import for bespoke surfaces.
export const fx = {
  // App canvas: subtle teal + indigo glows bleeding in from the corners.
  pageBackground: `radial-gradient(900px 600px at 12% -8%, rgba(45, 212, 191, 0.10), transparent 60%),
     radial-gradient(800px 600px at 100% 0%, rgba(129, 140, 248, 0.10), transparent 55%),
     radial-gradient(700px 700px at 50% 120%, rgba(45, 212, 191, 0.06), transparent 60%),
     ${tokens.bg}`,
  glassCard: {
    background: tokens.surfaceGlass,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: `1px solid ${tokens.border}`,
    borderRadius: 20,
    boxShadow: '0 18px 48px -24px rgba(0, 0, 0, 0.7)',
  },
  tealGradient: `linear-gradient(135deg, ${tokens.teal} 0%, ${tokens.tealDark} 100%)`,
  brandGradientText: {
    background: `linear-gradient(120deg, ${tokens.tealLight}, ${tokens.indigo})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  glow: '0 0 0 1px rgba(45,212,191,0.25), 0 10px 30px -10px rgba(45,212,191,0.45)',
};

export const clinicalTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: tokens.bg, paper: tokens.surface },
    primary: { main: tokens.teal, light: tokens.tealLight, dark: tokens.tealDark, contrastText: '#04141A' },
    secondary: { main: tokens.indigo, light: '#A5B4FC', dark: '#6366F1', contrastText: '#0B1020' },
    success: { main: '#34D399' },
    warning: { main: '#FBBF24' },
    error: { main: '#F87171' },
    info: { main: '#60A5FA' },
    text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
    divider: tokens.border,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { letterSpacing: '-0.01em' },
    button: { fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: {
          minHeight: '100vh',
          background: fx.pageBackground,
          backgroundAttachment: 'fixed',
          color: tokens.textPrimary,
        },
        '::selection': { background: 'rgba(45, 212, 191, 0.28)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.surface,
          border: `1px solid ${tokens.border}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 600, paddingInline: 18, paddingBlock: 9 },
        containedPrimary: {
          background: fx.tealGradient,
          color: '#04141A',
          boxShadow: '0 10px 24px -12px rgba(45, 212, 191, 0.7)',
          '&:hover': {
            background: fx.tealGradient,
            boxShadow: '0 14px 30px -10px rgba(45, 212, 191, 0.85)',
            transform: 'translateY(-1px)',
          },
          transition: 'transform .18s ease, box-shadow .18s ease',
        },
        outlined: { borderColor: tokens.borderStrong },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.borderStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: tokens.teal, borderWidth: 1 },
          '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(45, 212, 191, 0.16)' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${tokens.teal}, ${tokens.tealLight})`,
          boxShadow: '0 0 12px rgba(45, 212, 191, 0.6)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', color: tokens.textSecondary, '&.Mui-selected': { color: tokens.textPrimary } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 9, fontWeight: 600 },
        outlined: { borderColor: tokens.borderStrong },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, border: `1px solid ${tokens.border}`, backdropFilter: 'blur(8px)' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: tokens.border },
        head: { color: tokens.textSecondary, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.72rem' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 99, height: 8, backgroundColor: 'rgba(148,163,184,0.14)' },
        bar: { borderRadius: 99, background: `linear-gradient(90deg, ${tokens.teal}, ${tokens.tealLight})` },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default clinicalTheme;
