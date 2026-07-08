// Central API base + fetch helper.
//
// On the WEB build every call stays same-origin and hits the Next.js proxy
// routes in pages/api/* (which forward to the Python backend, adding the client
// IP for rate-limiting and piping streamed replies). On NATIVE (the Capacitor
// iOS/Android shell) there is no Node server, so the proxy routes don't exist —
// calls must go straight to the Python backend instead.
//
// Web behaviour is intentionally unchanged: on the web isNativeApp() is false,
// apiBase() is '', and apiFetch() is a passthrough to fetch() with the exact
// same path. Only inside the native shell do the rewrites below kick in.

// True only inside a Capacitor native app. This reads the runtime global the
// native bridge injects, so this file has NO build-time dependency on
// @capacitor/core (that package is added later, when we scaffold Capacitor).
// On the web window.Capacitor is undefined, so this is always false and nothing
// about the current web pages changes.
export function isNativeApp() {
  return (
    typeof window !== 'undefined' &&
    !!window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform()
  );
}

// Base URL to prefix API paths with: '' on web (same-origin → Next proxy), the
// Python backend's absolute URL on native (no proxy available there). The env
// var is the same NEXT_PUBLIC_BACKEND_URL the proxy routes already use, so it's
// inlined at build time for the static native bundle.
export function apiBase() {
  return isNativeApp() ? process.env.NEXT_PUBLIC_BACKEND_URL || '' : '';
}

// A couple of proxy routes rewrite the path before forwarding, so the client
// path and the real backend path differ. On native we call the backend
// directly, so we must reproduce those same rewrites here. Every other route
// maps 1:1 and passes through unchanged.
//   client POST /api/admin   →  backend /api/admin/metrics    (pages/api/admin.js)
//   client GET  /api/lesson  →  backend /api/lesson/progress  (pages/api/lesson.js)
//   client POST /api/lesson  →  backend /api/lesson/complete  (pages/api/lesson.js)
function toBackendPath(path, method) {
  const qIndex = path.indexOf('?');
  const pathname = qIndex === -1 ? path : path.slice(0, qIndex);
  const query = qIndex === -1 ? '' : path.slice(qIndex);
  const m = (method || 'GET').toUpperCase();
  if (pathname === '/api/admin') return `/api/admin/metrics${query}`;
  if (pathname === '/api/lesson') {
    return `${m === 'POST' ? '/api/lesson/complete' : '/api/lesson/progress'}${query}`;
  }
  return path;
}

// Drop-in replacement for fetch() on API paths. Pass the SAME path the app
// already uses (e.g. '/api/chat'); on web it hits the proxy unchanged, on
// native it is rewritten + prefixed to reach the Python backend directly.
// Returns the raw fetch Promise, so streaming responses (chat, lesson analyze)
// work exactly as before — the response body is never read here.
export function apiFetch(path, options = {}) {
  if (!isNativeApp()) return fetch(path, options);
  return fetch(apiBase() + toBackendPath(path, options.method), options);
}
