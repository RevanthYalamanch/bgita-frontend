/** @type {import('next').NextConfig} */

// The WEB build (Vercel, default) runs a normal Next.js server: SSR-capable and,
// crucially, keeps the pages/api/* proxy routes that forward to the FastAPI
// backend. The NATIVE build (Capacitor iOS/Android) is a fully static export —
// there's no Node server inside the app shell, so it calls the backend directly
// via lib/api.js and must not include the API routes.
//
// Toggle with BUILD_TARGET=native (see the build:native npm script). Web builds
// set nothing, so their config stays exactly {} — behaviour is unchanged.
const isNative = process.env.BUILD_TARGET === 'native';

const nextConfig = isNative
  ? {
      output: 'export', // emit a static site to out/ for Capacitor's webDir
      images: { unoptimized: true }, // no Image Optimization server on device
      trailingSlash: true, // route/ -> route/index.html, resolves under the WebView
    }
  : {};

module.exports = nextConfig;
