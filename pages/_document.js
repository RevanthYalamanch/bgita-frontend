import { Html, Head, Main, NextScript } from 'next/document';

// Loads the Plus Jakarta Sans webfont and sets the dark canvas before React
// hydrates, so there's no flash of an unstyled / light background.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0B0F14" />
      </Head>
      <body style={{ backgroundColor: '#0B0F14' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
