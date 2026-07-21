// lib/theme.js
// Shared clinical design system with light + dark modes. One source of truth for
// every page (login, register, dashboard, admin) so the app reads like a single,
// trustworthy medical-grade product rather than six separately-themed screens.
//
// Identity: calm, clinical, restrained motion, a single deep-teal accent, Lato
// typography, square edges + solid fills. Light = off-white canvas + white cards
// + hairline slate borders.
// Dark = deep slate-navy canvas + raised slate cards + the same teal accent.
//
// How theming flips: `tokens` values are CSS custom properties (var(--c-*)).
// The concrete light/dark values live in `lightTokens`/`darkTokens` and are
// emitted as `:root` / `.dark` variable blocks by _document.js. MUI itself
// switches via the native `colorSchemes` + `cssVariables` support below (it
// toggles the `.dark` class on <html>), so the same class flips both MUI
// components and every bespoke `tokens.*` / `fx.*` surface at once — no page
// code needs to change.
import { createTheme } from '@mui/material/styles';

// Token keys shared by both schemes. `tokens` (below) maps each to a CSS var;
// lightTokens/darkTokens give the concrete value per scheme.
const TOKEN_KEYS = [
  'bg', 'bgElevated', 'surface', 'surfaceMuted', 'surfaceHover',
  'border', 'borderStrong',
  'teal', 'tealLight', 'tealDark', 'tealSurface', 'indigo',
  'textPrimary', 'textSecondary', 'textFaint',
];

// --- Concrete palettes (feed MUI, which needs real colors for alpha math) -----
export const lightTokens = {
  bg: '#F4F7FA',            // app canvas — very pale cool gray
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',       // cards
  surfaceMuted: '#F8FAFC',  // faint section fill (slate-50)
  surfaceHover: '#F1F5F9',  // hover / secondary fill (slate-100)
  border: '#E2E8F0',        // hairline (slate-200)
  borderStrong: '#CBD5E1',  // slate-300
  teal: '#0D9488',          // primary (teal-600)
  tealLight: '#14B8A6',     // teal-500
  tealDark: '#0F766E',      // teal-700 (button hover + brand wordmark)
  tealSurface: '#F0FDFA',   // teal-50 tint
  indigo: '#4F46E5',
  textPrimary: '#0F172A',   // slate-900
  textSecondary: '#475569', // slate-600
  textFaint: '#94A3B8',     // slate-400
};

export const darkTokens = {
  bg: '#0A0F1A',            // deep slate-navy canvas
  bgElevated: '#111A28',
  surface: '#131D2B',       // cards (raised from canvas)
  surfaceMuted: '#16202F',  // faint section fill
  surfaceHover: '#1E293B',  // hover / secondary fill (slate-800)
  border: '#26324A',        // hairline on dark
  borderStrong: '#3A4A63',
  teal: '#14B8A6',          // primary (brighter to pop on dark)
  tealLight: '#5EEAD4',     // teal-300 (accents)
  tealDark: '#2DD4BF',      // teal-400 (hover lightens; brand wordmark stays legible)
  tealSurface: '#10312E',   // dark teal tint
  indigo: '#818CF8',        // lighter indigo for dark
  textPrimary: '#E7EDF5',   // near-white
  textSecondary: '#9FB0C3', // muted slate
  textFaint: '#64748B',     // slate-500
};

// CSS-variable-backed tokens. Every page/`fx` recipe uses these, so a single
// class flip on <html> recolors the whole app. e.g. tokens.teal === 'var(--c-teal)'.
export const tokens = Object.fromEntries(
  TOKEN_KEYS.map((k) => [k, `var(--c-${k})`])
);

// Emits the `--c-*: value;` declarations for a concrete palette. _document.js
// wraps these in `:root { ... }` (light) and `.dark { ... }` (dark) so the vars
// resolve correctly even before React hydrates (no flash of the wrong theme).
export const cssVarDeclarations = (map) =>
  TOKEN_KEYS.map((k) => `--c-${k}:${map[k]};`).join('');

// Reusable visual recipes pages import for bespoke surfaces. Built on the CSS-var
// tokens, so they flip with the mode automatically.
export const fx = {
  // App canvas: a single, barely-there brand tint near the top — calm, not flashy.
  pageBackground: tokens.bg,
  // Square card with a hairline border and soft, low elevation (no glassy blur).
  glassCard: {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 0,
    boxShadow: '0 1px 2px rgba(8, 12, 20, 0.16), 0 12px 32px -22px rgba(8, 12, 20, 0.5)',
  },
  // Flat solid accent fill. Kept as a string so `background: fx.tealGradient` callers need no change.
  tealGradient: tokens.teal,
  // Brand wordmark: solid teal, legible in both modes.
  brandGradientText: { color: tokens.tealDark },
  // Soft elevation for "active/selected" surfaces.
  glow: '0 1px 2px rgba(8, 12, 20, 0.18), 0 10px 28px -18px rgba(13, 148, 136, 0.45)',
};

// Shared palette shape for a given concrete token map.
const paletteFor = (t) => ({
  background: { default: t.bg, paper: t.surface },
  primary: { main: t.teal, light: t.tealLight, dark: t.tealDark, contrastText: '#FFFFFF' },
  secondary: { main: t.indigo, light: '#818CF8', dark: '#3730A3', contrastText: '#FFFFFF' },
  success: { main: '#059669' },
  warning: { main: '#D97706' },
  error: { main: '#DC2626' },
  info: { main: '#2563EB' },
  text: { primary: t.textPrimary, secondary: t.textSecondary },
  divider: t.border,
});

export const clinicalTheme = createTheme({
  // Native CSS-variable theming; the `.dark` class on <html> selects the scheme
  // (kept in sync with our own --c-* vars, which use the same class).
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: { palette: { mode: 'light', ...paletteFor(lightTokens) } },
    dark: { palette: { mode: 'dark', ...paletteFor(darkTokens) } },
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
        '::selection': { background: 'rgba(13, 148, 136, 0.22)' },
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
        root: { borderRadius: 0, textTransform: 'none', fontWeight: 700, paddingInline: 18, paddingBlock: 9 },
        containedPrimary: {
          backgroundColor: tokens.teal,
          color: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(8, 12, 20, 0.18)',
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
          borderRadius: 0,
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
        indicator: { height: 2.5, borderRadius: 0, backgroundColor: tokens.teal },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', color: tokens.textSecondary, '&.Mui-selected': { color: tokens.textPrimary } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0, fontWeight: 700 },
        outlined: { borderColor: tokens.borderStrong },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 0, border: `1px solid ${tokens.border}` },
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
        root: { borderRadius: 0, height: 8, backgroundColor: tokens.surfaceHover },
        bar: { borderRadius: 0, backgroundColor: tokens.teal },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default clinicalTheme;
