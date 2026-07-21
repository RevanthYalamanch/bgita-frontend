import { Html, Head, Main, NextScript } from 'next/document';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { lightTokens, darkTokens, cssVarDeclarations } from '../lib/theme';

// Emit the design-token CSS variables for both schemes before React hydrates, so
// the correct palette (and body background) is available on first paint. The
// `.dark` class is toggled on <html> by InitColorSchemeScript / MUI, flipping
// both these vars and MUI's own generated vars at once. `color-scheme` is set per
// block so native controls + scrollbars match the theme.
const themeVars = `
:root { color-scheme: light; ${cssVarDeclarations(lightTokens)} }
.dark { color-scheme: dark; ${cssVarDeclarations(darkTokens)} }
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      </Head>
      <body>
        {/* Applies the persisted light/dark choice (localStorage key `mui-mode`)
            by setting the class on <html> before paint — prevents a theme flash.
            Must match the theme's colorSchemeSelector: 'class'. */}
        <InitColorSchemeScript attribute="class" defaultMode="light" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
