import Head from 'next/head';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { clinicalTheme } from '../lib/theme';
import '../styles/globals.css';

// Single source of truth for theming. Every page renders inside the shared
// "Polished Dark" clinical theme, and global CSS (fonts, scrollbars, the
// fade-up / float-pulse keyframes) is loaded here so it applies app-wide.
export default function App({ Component, pageProps }) {
  return (
    <>
      {/* viewport-fit=cover lets the web view draw under the iOS notch / home
          indicator; the pages then use env(safe-area-inset-*) to pad content
          back into the safe area. On web / non-notched devices the insets are
          0, so this is a no-op there. */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider theme={clinicalTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
