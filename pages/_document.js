import { Html, Head, Main, NextScript } from 'next/document';

// Loads the Inter webfont and sets the light clinical canvas before React
// hydrates, so there's no flash of an unstyled background.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#F4F7FA" />
      </Head>
      <body style={{ backgroundColor: '#F4F7FA' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
