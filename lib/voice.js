// Engine-agnostic voice layer: speech-to-text (dictation) and text-to-speech
// (read-aloud). On the web this uses the browser's built-in Web Speech API.
//
// IMPORTANT (mobile): when we ship native iOS/Android apps via Capacitor, the
// Web Speech API is unreliable/unavailable inside the native shell. At that
// point, swap the `web*` implementations below for the native plugins
// (@capacitor-community/speech-recognition and @capacitor-community/text-to-speech)
// behind these SAME exported functions. The UI in dashboard.js never changes —
// it only ever calls isDictationSupported / createDictation / speak / etc.

const isBrowser = typeof window !== 'undefined';

// ---- Speech-to-text (dictation) -------------------------------------------

function getRecognitionCtor() {
  if (!isBrowser) return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// True when the current browser can transcribe speech. (Chrome/Edge/Android:
// yes; iOS Safari: partial and flaky — that's why the mobile apps will use the
// native plugin instead.)
export function isDictationSupported() {
  return !!getRecognitionCtor();
}

// Start a dictation session. Callbacks:
//   onPartial(text) – interim transcript while speaking (may still change)
//   onFinal(text)   – a finalized chunk of transcript
//   onEnd()         – recognition stopped / mic released
//   onError(code)   – e.g. 'not-allowed', 'no-speech', 'service-not-allowed'
// Returns { start, stop } or null if unsupported.
export function createDictation({ onPartial, onFinal, onEnd, onError, lang = 'en-US' } = {}) {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = true;      // keep listening across pauses until stopped
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0].transcript;
      if (result.isFinal) {
        if (onFinal) onFinal(text);
      } else {
        interim += text;
      }
    }
    if (interim && onPartial) onPartial(interim);
  };
  rec.onerror = (e) => { if (onError) onError(e.error || e); };
  rec.onend = () => { if (onEnd) onEnd(); };

  return {
    start() { try { rec.start(); } catch (_) { /* already started */ } },
    stop() { try { rec.stop(); } catch (_) { /* already stopped */ } },
  };
}

// ---- Text-to-speech (read-aloud) ------------------------------------------

export function isReadAloudSupported() {
  return isBrowser && 'speechSynthesis' in window;
}

// Speak `text` aloud, cancelling anything currently speaking so replies don't
// overlap. No-op if unsupported or text is empty.
export function speak(text, { lang = 'en-US', rate = 1, pitch = 1 } = {}) {
  if (!isReadAloudSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = pitch;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (isReadAloudSupported()) window.speechSynthesis.cancel();
}
