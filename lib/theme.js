// lib/theme.js
// Shared clinical design system. One source of truth for every page (login,
// register, dashboard, admin) so the app reads like a single, trustworthy
// medical-grade product rather than six separately-themed screens.
//
// Identity: light, calm, clinical — an off-white canvas, white cards with
// hairline slate borders and soft elevation, a single deep-teal accent, slate
// typography (Inter), and restrained motion. No glows, no decorative gradients.
// Grounded in how real healthcare/mental-wellness apps present (Spring Health,
// Calm Health, One Medical): soft cool neutrals + one accent read as clean,
// stable and professional.
import { createTheme } from '@mui/material/styles';

// --- Design tokens -----------------------------------------------------------
export const tokens = {
  bg: '#F4F7FA',            // app canvas — very pale cool gray
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',       // cards
  surfaceMuted: '#F8FAFC',  // faint section fill (slate-50)
  surfaceHover: '#F1F5F9',  // hover / secondary fill (slate-100)
  border: '#E2E8F0',        // hairline (slate-200)
  borderStrong: '#CBD5E1',  // slate-300
  teal: '#0D9488',          // primary (teal-600)
  tealLight: '#14B8A6',     // teal-500
  tealDark: '#0F766E',      // teal-700
  tealSurface: '#F0FDFA',   // teal-50 tint
  indigo: '#4F46E5',
  textPrimary: '#0F172A',   // slate-900
  textSecondary: '#475569', // slate-600
  textFaint: '#94A3B8',     // slate-400
};

// Reusable visual recipes pages can import for bespoke surfaces. Names are kept
// stable from the previous theme so existing usages just inherit the new,
// flatter clinical look.
export const fx = {
  // App canvas: a single, barely-there brand tint near the top — calm, not flashy.
  pageBackground: `radial-gradient(1100px 700px at 50% -15%, rgba(13, 148, 136, 0.06), transparent 55%),
     ${tokens.bg}`,
  // White card with a hairline border and soft, low elevation (no glassy blur).
  glassCard: {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -22px rgba(15, 23, 42, 0.18)',
  },
  // Flat solid accent fill (the old gradient read "cheap"). Kept as a string so
  // `background: fx.tealGradient` callers need no change.
  tealGradient: tokens.teal,
  // Brand wordmark: solid deep teal, no gradient text.
  brandGradientText: { color: tokens.tealDark },
  // Soft elevation for "active/selected" surfaces (replaces the teal glow).
  glow: '0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 28px -18px rgba(13, 148, 136, 0.45)',
};

export const clinicalTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: tokens.bg, paper: tokens.surface },
    primary: { main: tokens.teal, light: tokens.tealLight, dark: tokens.tealDark, contrastText: '#FFFFFF' },
    secondary: { main: tokens.indigo, light: '#818CF8', dark: '#3730A3', contrastText: '#FFFFFF' },
    success: { main: '#059669' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: '#2563EB' },
    text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
    divider: tokens.border,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
        '::selection': { background: 'rgba(13, 148, 136, 0.18)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.surface,
          border: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, paddingInline: 18, paddingBlock: 9 },
        containedPrimary: {
          backgroundColor: tokens.teal,
          color: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
          '&:hover': {
            backgroundColor: tokens.tealDark,
            boxShadow: '0 4px 12px -4px rgba(13, 148, 136, 0.5)',
          },
          transition: 'background-color .16s ease, box-shadow .16s ease',
        },
        outlined: { borderColor: tokens.borderStrong },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: tokens.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.borderStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: tokens.teal, borderWidth: 1 },
          '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.14)' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 2.5, borderRadius: 3, backgroundColor: tokens.teal },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', color: tokens.textSecondary, '&.Mui-selected': { color: tokens.textPrimary } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        outlined: { borderColor: tokens.borderStrong },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: `1px solid ${tokens.border}` },
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
        root: { borderRadius: 99, height: 8, backgroundColor: tokens.surfaceHover },
        bar: { borderRadius: 99, backgroundColor: tokens.teal },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default clinicalTheme;
