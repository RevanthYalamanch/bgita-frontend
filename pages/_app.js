import { ThemeProvider, CssBaseline } from '@mui/material';
import { clinicalTheme } from '../lib/theme';
import '../styles/globals.css';

// Single source of truth for theming. Every page renders inside the shared
// "Polished Dark" clinical theme, and global CSS (fonts, scrollbars, the
// fade-up / float-pulse keyframes) is loaded here so it applies app-wide.
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={clinicalTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
