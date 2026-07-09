import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Tabs, Tab, IconButton, Tooltip,
  Typography, Button, TextField, Paper, Avatar, Alert,
  Stepper, Step, StepLabel, StepButton, Divider, Chip, Link, LinearProgress // 👈 Added Chip, Link, LinearProgress
} from '@mui/material';
import { Create, Chat as ChatIcon, MenuBook, ExitToApp, CheckCircle, Lock, ArrowBack, ArrowForward, HelpOutline, AutoAwesome, Psychology, Person, Mic, MicNone, VolumeUp, VolumeOff } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import { isDictationSupported, createDictation, speak, stopSpeaking } from '../lib/voice';
import { apiFetch } from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import SosLauncher from '../components/sos/SosLauncher';

// 🗂️ Import your new curriculum database!
import { LESSON_DATA, TRACKS } from '../data/curriculum';


// Serialize a lesson's structured exercise answers into the plain-text
// `exercise_data` the backend stores. Handles both the "fields" and "chips"
// exercise types.
function formatExerciseAnswers(lesson, answers) {
  const ex = lesson && lesson.exercise;
  if (!ex) return '';
  const lines = [ex.title];
  if (ex.type === 'chips') {
    const selected = answers._selected || [];
    lines.push(`Traps: ${selected.length ? selected.join(', ') : '(none selected)'}`);
    if (answers.notes) lines.push(`Notes: ${answers.notes}`);
  } else {
    (ex.fields || []).forEach(f => {
      lines.push(`${f.label}: ${answers[f.key] || ''}`);
    });
  }
  return lines.join('\n');
}

// Convert the UI's message list into the history format the backend expects.
// The UI uses role 'ai'; the model API expects 'assistant'.
function toHistory(messages) {
  return messages.map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }));
}

// Read a streaming text/plain response, appending tokens into the last message
// of `setMessages` as they arrive. Adds a fresh empty AI bubble to fill.
async function streamInto(response, setMessages) {
  // Non-streaming error responses (rate limit, validation, server error) arrive
  // as JSON — show a friendly line instead of dumping the raw error body.
  if (!response.ok) {
    let msg = "Sorry, something went wrong. Please try again.";
    if (response.status === 429) msg = "You're sending messages too quickly. Please wait a moment and try again.";
    else if (response.status === 422) msg = "That message is too long. Please shorten it and try again.";
    setMessages(prev => [...prev, { role: 'ai', content: msg }]);
    return '';
  }

  setMessages(prev => [...prev, { role: 'ai', content: '' }]);

  if (!response.body) {
    const fallback = await response.text();
    setMessages(prev => {
      const next = [...prev];
      next[next.length - 1] = { role: 'ai', content: fallback };
      return next;
    });
    return fallback;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let acc = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    setMessages(prev => {
      const next = [...prev];
      next[next.length - 1] = { role: 'ai', content: acc };
      return next;
    });
  }
  // Return the full reply so callers (e.g. read-aloud) can use the final text.
  return acc;
}

// Strip markdown so text-to-speech reads clean prose instead of literal
// "asterisk asterisk" / "hash" characters.
function stripForSpeech(md) {
  return (md || '')
    .replace(/```[\s\S]*?```/g, '')          // fenced code blocks
    .replace(/`([^`]+)`/g, '$1')              // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')     // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // links -> visible text
    .replace(/[*_#>~]/g, '')                  // emphasis / heading / quote marks
    .replace(/\n{2,}/g, '. ')                 // paragraph breaks -> spoken pause
    .replace(/\s+/g, ' ')
    .trim();
}

// A TextField with a built-in dictation mic (top-right corner). Speech appends
// to the field; the user reviews before saving/submitting. Pass `value` and
// `onValueChange(newString)`; all other props (multiline, rows, placeholder,
// variant, fullWidth…) pass straight through to the underlying TextField.
function VoiceTextField({ value, onValueChange, maxLength = 2000, sx, ...rest }) {
  const [listening, setListening] = useState(false);
  const sessionRef = useRef(null);
  const baseRef = useRef('');     // committed text so interim results replace only the tail

  const stop = () => { if (sessionRef.current) sessionRef.current.stop(); };
  useEffect(() => () => stop(), []);   // release the mic if unmounted mid-listen

  const toggle = () => {
    if (listening) { stop(); return; }
    if (!isDictationSupported()) {
      alert("Voice input isn't supported in this browser yet. Try Chrome or Edge.");
      return;
    }
    baseRef.current = value ? value.trimEnd() + ' ' : '';
    const session = createDictation({
      onPartial: (interim) => onValueChange((baseRef.current + interim).slice(0, maxLength)),
      onFinal: (text) => {
        baseRef.current = baseRef.current + text + ' ';
        onValueChange(baseRef.current.slice(0, maxLength));
      },
      onEnd: () => setListening(false),
      onError: (code) => {
        setListening(false);
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          alert('Microphone access is blocked. Please allow mic access in your browser settings, then try again.');
        }
      },
    });
    if (!session) return;
    sessionRef.current = session;
    session.start();
    setListening(true);
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        {...rest}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        inputProps={{ maxLength, ...(rest.inputProps || {}) }}
        sx={{ '& textarea': { pr: 4.5 }, ...(rest.sx || {}) }}
      />
      <Tooltip title={listening ? 'Stop listening' : 'Speak'}>
        <IconButton
          onClick={toggle}
          size="small"
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
          sx={{
            position: 'absolute', top: 8, right: 8,
            border: `1px solid ${listening ? tokens.teal : tokens.border}`,
            color: listening ? '#FFFFFF' : 'text.secondary',
            background: listening ? fx.tealGradient : 'transparent',
            '&:hover': { background: listening ? fx.tealGradient : undefined },
          }}
        >
          {listening ? <Mic fontSize="small" /> : <MicNone fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// Read a streaming text/plain response into a single string state (used by the
// lesson "Practice" reflection, which renders one growing block rather than a
// chat list). Returns nothing; calls setText with the accumulated text.
async function streamIntoText(response, setText) {
  if (!response.ok) {
    let msg = "Sorry, I couldn't put together a reflection just now. You can still continue to the next step.";
    if (response.status === 429) msg = "You're going a little fast — wait a moment, then try again.";
    setText(msg);
    return;
  }
  if (!response.body) {
    setText(await response.text());
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let acc = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    setText(acc);
  }
}

// Render inline markdown: **bold**, *italic*, and bare http(s) URLs (autolinked).
// Anything else passes through as plain text. Returns an array of React nodes.
// Note: the bold alternative is listed before italic so **x** is consumed whole
// and never mis-parsed as two empty italics.
function renderInline(text, keyPrefix) {
  const parts = (text || '').split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s]+)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (/^https?:\/\//.test(part)) {
      // Don't swallow trailing sentence punctuation into the link.
      const m = part.match(/^(https?:\/\/[^\s]*?)([.,)]*)$/);
      const url = m ? m[1] : part;
      const trail = m ? m[2] : '';
      return (
        <React.Fragment key={key}>
          <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>{url}</Link>
          {trail}
        </React.Fragment>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

// Lightweight markdown renderer for chat replies: paragraphs (split on blank
// lines), unordered (-, *) and ordered (1.) lists, plus inline bold/links.
// Self-contained so it works without a markdown dependency, and tolerant of the
// partial text that arrives mid-stream.
function MarkdownText({ content }) {
  const blocks = [];
  let list = null;   // { type: 'ul' | 'ol', items: [] }
  let para = [];

  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push(list); list = null; } };

  for (const raw of (content || '').split('\n')) {
    const line = raw.trim();
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ul) {
      flushPara();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(ul[1]);
    } else if (ol) {
      flushPara();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(ol[1]);
    } else if (line === '') {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara(); flushList();

  return (
    <Box sx={{ '& > :last-child': { mb: 0 } }}>
      {blocks.map((b, i) => {
        if (b.type === 'p') {
          return <Typography key={i} sx={{ mb: 1 }}>{renderInline(b.text, `p${i}`)}</Typography>;
        }
        return (
          <Box key={i} component={b.type} sx={{ pl: 3, my: 0, mb: 1 }}>
            {b.items.map((it, j) => (
              <Typography key={j} component="li" sx={{ mb: 0.5 }}>{renderInline(it, `l${i}-${j}`)}</Typography>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}

// Animated "the guide is typing…" bubble shown while a reply streams in.
// `small` matches the tighter avatar sizing used inside the lesson wizard.
function TypingIndicator({ small }) {
  const dot = (delay) => ({
    width: small ? 6 : 7, height: small ? 6 : 7, borderRadius: '50%',
    bgcolor: 'text.secondary', animation: 'typingBounce 1.2s ease-in-out infinite', animationDelay: delay,
  });
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Avatar sx={{ background: fx.tealGradient, color: '#FFFFFF', width: small ? 32 : 40, height: small ? 32 : 40 }}><Psychology sx={{ fontSize: small ? 18 : 22 }} /></Avatar>
      <Paper elevation={0} sx={{ px: 2, py: 1.5, border: 'none', background: tokens.surfaceHover, borderRadius: '14px', display: 'flex', gap: 0.75, alignItems: 'center' }}>
        <Box sx={dot('0s')} />
        <Box sx={dot('0.15s')} />
        <Box sx={dot('0.3s')} />
      </Paper>
    </Box>
  );
}

// Starter prompts shown as tappable chips when the general chat is still empty
// (only the AI's opening greeting present), to lower the blank-page barrier.
const CHAT_SUGGESTIONS = [
  "I've been feeling anxious lately",
  'Help me reframe a negative thought',
  "I'm overwhelmed and don't know where to start",
  'What does the Gita say about letting go?',
];

// Mood scale shared by the check-in selector and the diary history. `v` is the
// 1-5 value persisted to the backend (as text).
const MOOD_OPTIONS = [
  { v: 1, emoji: '😣', label: 'Awful' },
  { v: 2, emoji: '😕', label: 'Low' },
  { v: 3, emoji: '😐', label: 'Okay' },
  { v: 4, emoji: '🙂', label: 'Good' },
  { v: 5, emoji: '😄', label: 'Great' },
];
const MOOD_BY_VALUE = Object.fromEntries(MOOD_OPTIONS.map((m) => [String(m.v), m]));

// Format an ISO timestamp as a friendly diary date (e.g. "Mon, Jun 30").
function formatDiaryDate(ts) {
  const d = new Date(ts);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function TabPanel(props) {
  const { children, value, index, sx } = props;
  if (value !== index) return null;
  // Fill the parent (a flex column) and own the scroll. minHeight:0 lets the
  // inner overflowY:auto regions actually scroll instead of forcing the card
  // to grow past its container (which clips under the Paper's overflow:hidden).
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', p: 3, overflowY: 'auto', ...sx }}>
      {children}
    </Box>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(2); // Start on Curriculum Tab

  // 👤 DYNAMIC USER STATE
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  // Diary State
  const [mood, setMood] = useState(null);
  const [diaryText, setDiaryText] = useState('');
  const [diarySaved, setDiarySaved] = useState(false);
  // Past daily check-ins (most recent first) so the user can view previous
  // diaries; also used to detect whether they've already checked in today (6/29
  // #1 — one entry per day). `diaryView` toggles the Diary tab between writing a
  // new entry and browsing history.
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diaryView, setDiaryView] = useState('today'); // 'today' | 'history'

  // General Chat State
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', content: 'Hello Revanth. I am your Cognitive Space guide. How are you feeling today?' }]);

  // 🎙️ Voice State (dictation + read-aloud). See lib/voice.js.
  const [isListening, setIsListening] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const dictationRef = useRef(null);        // active dictation session { start, stop }
  const finalTranscriptRef = useRef('');    // committed transcript so interim text can replace only the tail

  const stopDictation = () => {
    if (dictationRef.current) dictationRef.current.stop();
  };

  // Toggle the mic. Speech fills the chat box (capped at the 4000-char limit);
  // the user reviews and taps Send, so stray noise never auto-sends.
  const toggleDictation = () => {
    if (isListening) { stopDictation(); return; }
    if (!isDictationSupported()) {
      alert("Voice input isn't supported in this browser yet. Try Chrome or Edge — or use the mobile app once it's out.");
      return;
    }
    // Start from whatever is already typed, so dictation appends rather than wipes.
    finalTranscriptRef.current = chatInput ? chatInput.trimEnd() + ' ' : '';
    const session = createDictation({
      onPartial: (interim) => setChatInput((finalTranscriptRef.current + interim).slice(0, 4000)),
      onFinal: (text) => {
        finalTranscriptRef.current = (finalTranscriptRef.current + text + ' ');
        setChatInput(finalTranscriptRef.current.slice(0, 4000));
      },
      onEnd: () => setIsListening(false),
      onError: (code) => {
        setIsListening(false);
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          alert('Microphone access is blocked. Please allow mic access in your browser settings, then try again.');
        }
      },
    });
    if (!session) return;
    dictationRef.current = session;
    session.start();
    setIsListening(true);
  };

  // Stop any mic / speech when leaving the dashboard.
  useEffect(() => {
    return () => { stopDictation(); stopSpeaking(); };
  }, []);

  // 📖 LESSON WIZARD STATE
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null); // Which lesson is open?
  const [activeStep, setActiveStep] = useState(0); // 0: Learn, 1: Practice, 2: Commit
  const [exerciseAnswers, setExerciseAnswers] = useState({}); // structured exercise inputs
  const [blueprintData, setBlueprintData] = useState('');
  // Map of lesson_id → saved {exercise_data, blueprint_data} from the backend, so
  // a user can see their previous responses and pick up where they left off on a redo.
  const [savedAnswers, setSavedAnswers] = useState({});
  // Brief success confirmation shown on the lessons list after a module is completed.
  const [completedBanner, setCompletedBanner] = useState('');
  // AI reflection on the Practice-step answers: streamed text + loading flag.
  const [analysisText, setAnalysisText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  // AI response to the Commit-step takeaway (#3): streamed text + loading flag.
  const [takeawayText, setTakeawayText] = useState('');
  const [takeawayLoading, setTakeawayLoading] = useState(false);

  // 🚀 ON PAGE LOAD: GET THE NAME
  useEffect(() => {
    const userString = localStorage.getItem('user');
    setSessionId(Math.random().toString(36).substring(2, 15));
    
    if (userString) {
      // Unpack the JSON object!
      const userData = JSON.parse(userString);
      setUserName(userData.name || 'Guest');
      
      setChatMessages([
        { role: 'ai', content: `Hello ${userData.name || 'Guest'}. I am your Cognitive Space guide. How are you feeling today?` }
      ]);
    } else {
      setUserName('Guest');
    }

    // Restore lesson unlock progress so it survives a refresh. The localStorage
    // value is an instant offline mirror; the backend is the source of truth and
    // overrides it below (so progress syncs across devices).
    const savedLevel = parseInt(localStorage.getItem('unlockedLevel'), 10);
    if (Number.isFinite(savedLevel) && savedLevel > 1) {
      setUnlockedLevel(savedLevel);
    }

    // Pull authoritative progress from the backend. Never regress below what the
    // local mirror already showed; if the request fails, the mirror stands.
    const token = localStorage.getItem('token');
    if (token) {
      apiFetch('/api/lesson/progress', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && Number.isFinite(data.unlocked_level)) {
            setUnlockedLevel((prev) => {
              const next = Math.max(prev, data.unlocked_level);
              localStorage.setItem('unlockedLevel', String(next));
              return next;
            });
          }
        })
        .catch(() => {});

      // Pull saved lesson answers so reviewing/redoing a lesson shows what the
      // user wrote last time (#3).
      apiFetch('/api/lesson/answers', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.answers) setSavedAnswers(data.answers);
        })
        .catch(() => {});

      // Pull past daily check-ins so the user can view previous diaries and so we
      // know whether they've already checked in today (6/29 #1).
      apiFetch('/api/logs', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.entries)) setDiaryEntries(data.entries);
        })
        .catch(() => {});
    }
  }, []);

  // True once the user has saved a check-in dated today — gates the Save button
  // to once per day and flips the Diary tab into its "done for today" state.
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const checkedInToday =
    diarySaved ||
    diaryEntries.some((e) => {
      const t = new Date(e.timestamp);
      return !isNaN(t) && isSameDay(t, new Date());
    });

  const handleLogout = () => {
    // Clear the name when they log out for privacy!
    localStorage.removeItem('userName');
    router.push('/');
  };

  const handleSaveDiary = async () => {
    if (!mood || !diaryText) return;
    // Guard against a second save in the same day (6/29 #1).
    if (checkedInToday) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    try {
      const response = await apiFetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // The backend derives the user from the token; email here is ignored.
        body: JSON.stringify({ mood_score: mood, diary_text: diaryText }),
      });

      if (!response.ok) {
        // Surface the backend's real reason instead of a silent/generic failure,
        // so a save problem is actionable rather than "the button does nothing".
        let detail = '';
        try {
          const body = await response.json();
          detail = body.detail || body.message || '';
        } catch (_) { /* non-JSON error body */ }
        alert(detail ? `Could not save your entry: ${detail}` : "Could not save your entry. Please try again.");
        return;
      }

      // Record the new entry locally so it shows up immediately in "previous
      // diaries" and keeps the form locked for the rest of the day.
      setDiaryEntries((prev) => [
        { mood: String(mood), reflection: diaryText, timestamp: new Date().toISOString() },
        ...prev,
      ]);
      setDiarySaved(true);
      setMood(null);
      setDiaryText('');
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      alert("Could not save your entry. Please check your connection.");
    }
  };

const handleSendMessage = async (textArg) => {
    // Called both from the input (no arg / click event) and from a suggestion
    // chip (string). Ignore the event object so only a real string overrides.
    const userText = (typeof textArg === 'string' ? textArg : chatInput).trim();
    if (!userText) return;
    // Stop the mic on send so a trailing final transcript can't refill the box.
    if (isListening) stopDictation();
    finalTranscriptRef.current = '';
    setChatInput('');
    // Snapshot the conversation so far to send as context (before adding the new turn).
    const history = toHistory(chatMessages);
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    // 🛡️ SAFE EXTRACTION: Grab the email safely before hitting the network
    const userString = localStorage.getItem('user');
    const userEmail = userString ? JSON.parse(userString).email : "unknown_user";
    const token = localStorage.getItem('token');

    try {
      const response = await apiFetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
          email: userEmail, // server overrides this with the token identity
          history,
        }),
      });
      // Auth is now required for chat: on an expired/invalid session the backend
      // returns 401 as JSON (not a stream), so surface a clear message instead of
      // rendering raw JSON into the transcript.
      if (response.status === 401) {
        setChatMessages(prev => [...prev, { role: 'ai', content: "Your session has expired. Please log out and log back in to keep chatting." }]);
        return;
      }
      const reply = await streamInto(response, setChatMessages);
      if (readAloud && reply) speak(stripForSpeech(reply));
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "Network error connecting to bridge." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveStep(0);
    setAnalysisText('');
    setTakeawayText('');

    // Pre-fill with the user's previous response (if any) so reviewing/redoing a
    // lesson shows what they wrote before instead of a blank slate (#3).
    const saved = savedAnswers[String(lesson.id)];
    let priorAnswers = {};
    if (saved && saved.exercise_data) {
      try {
        const parsed = JSON.parse(saved.exercise_data);
        if (parsed && typeof parsed === 'object') priorAnswers = parsed;
      } catch {
        // Older rows stored a plain-text serialization, not JSON — can't restore
        // the structured fields, so start fresh for those.
        priorAnswers = {};
      }
    }
    setExerciseAnswers(priorAnswers);
    setBlueprintData(saved ? (saved.blueprint_data || '') : '');
  };

  // Does the current exercise have at least one non-empty answer? Gates the
  // "Reflect on my answers" action so we don't ask the model about a blank form.
  const hasExerciseAnswers = () => {
    const ex = activeLesson && activeLesson.exercise;
    if (!ex) return false;
    if (ex.type === 'chips') {
      return (exerciseAnswers._selected || []).length > 0 || !!(exerciseAnswers.notes || '').trim();
    }
    return (ex.fields || []).some((f) => (exerciseAnswers[f.key] || '').trim());
  };

  // Update one structured exercise field by key.
  const setExerciseField = (key, value) => {
    setExerciseAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Toggle a "chips" exercise option in/out of the selected set.
  const toggleExerciseChip = (option) => {
    setExerciseAnswers(prev => {
      const selected = prev._selected || [];
      const next = selected.includes(option)
        ? selected.filter(o => o !== option)
        : [...selected, option];
      return { ...prev, _selected: next };
    });
  };

  // Build the internal coaching brief for a lesson (sent as `context`, never
  // shown). Mirrors the Learn → Practice sections the user just walked through so
  // the reflection can connect their answers to the SPECIFIC insight taught —
  // crucially including the concept the lesson teaches (bridge) and its worked
  // example, which the old context omitted. reflection_prompt is added by each
  // caller instead, with mode-appropriate framing.
  const buildLessonContext = (lesson) => {
    if (!lesson) return '';
    const c = lesson.concept || {};
    const ex = lesson.exercise || {};
    // Describe what each answer field was for, so the guide reads the answers with
    // their intent (e.g. "Situation = just the facts a camera saw"). For chip
    // exercises, list the full option set so it can react to what they didn't pick.
    let fieldIntents = '';
    if (ex.type === 'chips' && ex.options) {
      fieldIntents = `They chose from these options: ${ex.options.join('; ')}`;
    } else if (ex.fields) {
      fieldIntents = ex.fields
        .map(f => `- ${f.label}${f.placeholder ? ` (e.g. ${f.placeholder})` : ''}`)
        .join('\n');
    }
    return [
      lesson.skill ? `Skill: ${lesson.skill}` : '',
      lesson.objective ? `Goal: ${lesson.objective}` : '',
      c.bridge ? `\nThe insight we taught them:\n${c.bridge}` : '',
      c.example ? `\nThe worked example we showed them:\n${c.example}` : '',
      ex.instructions ? `\nThe exercise asked them to: ${ex.instructions}` : '',
      fieldIntents ? `\nWhat each answer was for:\n${fieldIntents}` : '',
      lesson.safety_note ? `\nGuardrail for this lesson (honor it): ${lesson.safety_note}` : '',
      lesson.ai_prompt_context ? `\nCoaching steer: ${lesson.ai_prompt_context}` : '',
    ].filter(Boolean).join('\n');
  };

  // Ask the guide to reflect on the user's Practice-step answers so they can
  // learn from them before writing their takeaway on the Commit step. Streams the
  // reflection into `analysisText`.
  const handleAnalyze = async () => {
    if (!activeLesson || analysisLoading || !hasExerciseAnswers()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    setAnalysisLoading(true);
    setAnalysisText('');
    try {
      const response = await apiFetch('/api/lesson/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lesson_id: activeLesson.id,
          skill: activeLesson.skill || '',
          title: activeLesson.title || '',
          answers: formatExerciseAnswers(activeLesson, exerciseAnswers),
          context: [
            buildLessonContext(activeLesson),
            activeLesson.reflection_prompt
              ? `Next, on the Commit step, they'll answer: ${activeLesson.reflection_prompt}`
              : '',
          ].filter(Boolean).join('\n'),
          mode: 'reflect',
        }),
      });
      await streamIntoText(response, setAnalysisText);
    } catch (error) {
      setAnalysisText("Sorry, I couldn't connect just now. You can still continue to the next step.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // #3 — Once the user has written their takeaway on the Commit step, let them ask
  // the guide for a warm response to it. Streams into `takeawayText`.
  const handleTakeawayResponse = async () => {
    if (!activeLesson || takeawayLoading || !blueprintData.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    setTakeawayLoading(true);
    setTakeawayText('');
    try {
      const promptLine = activeLesson.reflection_prompt
        ? `The prompt they answered: ${activeLesson.reflection_prompt}`
        : '';
      const response = await apiFetch('/api/lesson/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lesson_id: activeLesson.id,
          skill: activeLesson.skill || '',
          title: activeLesson.title || '',
          answers: blueprintData,
          context: [buildLessonContext(activeLesson), promptLine].filter(Boolean).join('\n'),
          mode: 'takeaway',
        }),
      });
      await streamIntoText(response, setTakeawayText);
    } catch (error) {
      setTakeawayText("Sorry, I couldn't connect just now. Your takeaway is still saved when you complete the module.");
    } finally {
      setTakeawayLoading(false);
    }
  };



  const finishLesson = async () => {
    // 1. Need a valid session token to save progress under this account.
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    // Store the structured answers as JSON so a later review/redo can restore the
    // exact fields the user typed (#3). The plain-text serialization is only used
    // transiently for the AI reflection, not for storage.
    const exerciseJson = JSON.stringify(exerciseAnswers);
    const finishedLesson = activeLesson;

    // 2. Optimistically record progress locally and return to the lessons list
    //    immediately, so "Complete Module" ALWAYS takes the user back even if the
    //    server save fails (#4). The save below only changes the confirmation
    //    message — never whether we navigate.
    setSavedAnswers(prev => ({
      ...prev,
      [String(finishedLesson.id)]: { exercise_data: exerciseJson, blueprint_data: blueprintData },
    }));
    setUnlockedLevel(prev => {
      const next = Math.max(prev, finishedLesson.id + 1);
      localStorage.setItem('unlockedLevel', String(next));
      return next;
    });
    setActiveLesson(null);
    setActiveStep(0);
    setAnalysisText('');
    setTakeawayText('');
    setCompletedBanner(finishedLesson.title);
    setTimeout(() => setCompletedBanner(''), 4000);

    // 3. Persist to the server in the background. A failure is logged but does not
    //    trap the user on the lesson page — progress is already mirrored locally.
    try {
      const response = await apiFetch('/api/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: finishedLesson.id,
          exercise_data: exerciseJson,
          blueprint_data: blueprintData
        })
      });
      if (!response.ok) {
        console.error("Lesson save returned non-OK status:", response.status);
      }
    } catch (error) {
      console.error("Failed to save lesson progress to server:", error);
    }
  };


  return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.75 }, minWidth: 0 }}>
            <Box sx={{ width: { xs: 38, sm: 44 }, height: { xs: 38, sm: 44 }, flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', color: '#FFFFFF', background: fx.tealGradient, boxShadow: fx.glow }}><Psychology sx={{ fontSize: { xs: 21, sm: 25 } }} /></Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" fontWeight={800} sx={{ ...fx.brandGradientText, lineHeight: 1.1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Cognitive Space</Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                Welcome back, {userName || 'friend'}.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <ThemeToggle />
            <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout} sx={{ color: 'text.secondary', borderColor: tokens.border, flexShrink: 0 }}>Logout</Button>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ ...fx.glassCard, borderRadius: '20px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

          {/* Hide tabs if we are inside an active lesson wizard */}
          {!activeLesson && (
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              variant="fullWidth"
              sx={{
                borderBottom: `1px solid ${tokens.border}`,
                bgcolor: tokens.surfaceMuted,
                // On phones, stack the icon above the label and shrink the type
                // so all three tabs stay readable instead of overflowing.
                '& .MuiTab-root': {
                  minHeight: { xs: 60, sm: 48 },
                  fontSize: { xs: '0.72rem', sm: '0.95rem' },
                  px: { xs: 0.5, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                },
                '& .MuiTab-iconWrapper': { mr: { xs: 0, sm: 1 }, mb: { xs: 0.25, sm: 0 } },
              }}
            >
              <Tab icon={<Create />} iconPosition="start" label="Diary" />
              <Tab icon={<ChatIcon />} iconPosition="start" label="General Chat" />
              <Tab icon={<MenuBook />} iconPosition="start" label="Curriculum" />
            </Tabs>
          )}

          {/* 📔 DIARY */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ maxWidth: 620, mx: 'auto' }} className="fade-up">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, mb: 0.5 }}>
                <Typography variant="h6" fontWeight={800}>Daily Check-In</Typography>
                {diaryEntries.length > 0 && (
                  <Button
                    size="small"
                    onClick={() => setDiaryView((v) => (v === 'history' ? 'today' : 'history'))}
                    sx={{ color: 'text.secondary', flexShrink: 0 }}
                  >
                    {diaryView === 'history' ? 'Back to today' : `Previous entries (${diaryEntries.length})`}
                  </Button>
                )}
              </Box>

              {diaryView === 'history' ? (
                /* ── Previous diaries ─────────────────────────────────────── */
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    A look back at how you&apos;ve been arriving.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {diaryEntries.map((entry, i) => {
                      const m = MOOD_BY_VALUE[String(entry.mood)];
                      return (
                        <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: '16px', background: tokens.surfaceMuted, border: `1px solid ${tokens.border}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: entry.reflection ? 1 : 0 }}>
                            <Box sx={{ fontSize: 22, lineHeight: 1 }}>{m ? m.emoji : '📝'}</Box>
                            <Typography variant="subtitle2" fontWeight={700}>{m ? m.label : 'Entry'}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{formatDiaryDate(entry.timestamp)}</Typography>
                          </Box>
                          {entry.reflection && (
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                              {entry.reflection}
                            </Typography>
                          )}
                        </Paper>
                      );
                    })}
                  </Box>
                </Box>
              ) : checkedInToday ? (
                /* ── Already checked in today ─────────────────────────────── */
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    A small moment of awareness, once a day.
                  </Typography>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', textAlign: 'center', background: 'rgba(45,212,191,0.06)', border: `1px solid ${tokens.border}` }}>
                    <CheckCircle sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>You&apos;ve checked in today.</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Well done for showing up. Come back tomorrow for your next check-in.
                    </Typography>
                    {diaryEntries.length > 0 && (
                      <Button variant="outlined" size="small" onClick={() => setDiaryView('history')} sx={{ mt: 2 }}>
                        View previous entries
                      </Button>
                    )}
                  </Paper>
                </Box>
              ) : (
                /* ── New check-in form ────────────────────────────────────── */
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    A small moment of awareness. How are you arriving today?
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>How is your mood?</Typography>
                  <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1.25 }, mb: 4 }}>
                    {MOOD_OPTIONS.map((m) => {
                      const selected = mood === m.v;
                      return (
                        <Box
                          key={m.v}
                          component="button"
                          type="button"
                          onClick={() => setMood(m.v)}
                          sx={{
                            flex: 1, minWidth: 0, py: { xs: 1.25, sm: 2 }, px: 0.5, cursor: 'pointer', fontFamily: 'inherit', borderRadius: '16px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                            transition: 'all .2s ease',
                            background: selected ? 'rgba(45,212,191,0.12)' : tokens.surfaceMuted,
                            border: `1px solid ${selected ? tokens.teal : tokens.border}`,
                            boxShadow: selected ? fx.glow : 'none',
                            transform: selected ? 'translateY(-3px)' : 'none',
                            '&:hover': { borderColor: tokens.borderStrong, transform: 'translateY(-2px)' },
                          }}
                        >
                          <Box sx={{ fontSize: { xs: 22, sm: 28 }, lineHeight: 1, filter: selected ? 'none' : 'grayscale(0.4)' }}>{m.emoji}</Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.75rem' }, color: selected ? 'primary.main' : 'text.secondary' }}>{m.label}</Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>What&apos;s on your mind?</Typography>
                  <VoiceTextField fullWidth multiline rows={5} placeholder="Write as much or as little as you like…" value={diaryText} onValueChange={setDiaryText} variant="outlined" maxLength={4000} sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    {(!mood || !diaryText) && (
                      <Typography variant="caption" color="text.secondary">
                        {!mood && !diaryText
                          ? 'Pick a mood and write a few words to save.'
                          : !mood
                            ? 'Pick a mood above to save.'
                            : 'Write a few words to save.'}
                      </Typography>
                    )}
                    <Button variant="contained" size="large" onClick={handleSaveDiary} disabled={!mood || !diaryText}>Save Entry</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* 💬 GENERAL CHAT (Unchanged) */}
          <TabPanel value={tabValue} index={1} sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ... Chat content ... */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '500px' }}>
              {chatMessages.map((msg, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <Avatar sx={{ background: msg.role === 'user' ? tokens.border : fx.tealGradient, color: msg.role === 'user' ? 'text.secondary' : '#FFFFFF' }}>{msg.role === 'user' ? <Person fontSize="small" /> : <Psychology fontSize="small" />}</Avatar>
                  <Paper elevation={0} sx={{ p: 2, border: 'none', background: msg.role === 'user' ? fx.tealGradient : tokens.surfaceHover, color: msg.role === 'user' ? '#FFFFFF' : 'text.primary', maxWidth: '80%', borderRadius: '16px', borderTopRightRadius: msg.role === 'user' ? '4px' : '16px', borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px' }}>
                    {msg.role === 'user'
                      ? <Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                      : <MarkdownText content={msg.content} />}
                  </Paper>
                </Box>
              ))}
              {isLoading && <TypingIndicator />}

              {/* Empty-state: offer starter prompts when only the greeting exists */}
              {chatMessages.length === 1 && !isLoading && (
                <Box sx={{ ml: { xs: 0, sm: 7 }, mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25 }}>
                    Not sure where to begin? Try one of these:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {CHAT_SUGGESTIONS.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        variant="outlined"
                        clickable
                        onClick={() => handleSendMessage(s)}
                        sx={{ height: 'auto', py: 0.75, '& .MuiChip-label': { whiteSpace: 'normal', lineHeight: 1.4 }, borderColor: tokens.border, '&:hover': { borderColor: tokens.teal, background: 'rgba(45,212,191,0.06)' } }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={{ p: 2, borderTop: `1px solid ${tokens.border}`, display: 'flex', gap: 1, alignItems: 'center', bgcolor: tokens.surfaceMuted }}>
              <Tooltip title={isListening ? 'Stop listening' : 'Speak your message'}>
                <span>
                  <IconButton
                    onClick={toggleDictation}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    sx={{
                      border: `1px solid ${isListening ? tokens.teal : tokens.border}`,
                      color: isListening ? '#FFFFFF' : 'text.secondary',
                      background: isListening ? fx.tealGradient : 'transparent',
                    }}
                  >
                    {isListening ? <Mic /> : <MicNone />}
                  </IconButton>
                </span>
              </Tooltip>
              <TextField fullWidth placeholder={isListening ? 'Listening… speak now' : 'Type or tap the mic to speak…'} variant="outlined" size="small" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} inputProps={{ maxLength: 4000 }} />
              <Tooltip title={readAloud ? 'Read replies aloud: on' : 'Read replies aloud: off'}>
                <span>
                  <IconButton
                    onClick={() => { const next = !readAloud; setReadAloud(next); if (!next) stopSpeaking(); }}
                    aria-label="Toggle reading replies aloud"
                    color={readAloud ? 'primary' : 'default'}
                  >
                    {readAloud ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                </span>
              </Tooltip>
              <Button variant="contained" onClick={handleSendMessage} disabled={isLoading}>Send</Button>
            </Box>
          </TabPanel>

          {/* 📖 CURRICULUM & LESSON WIZARD */}
          <TabPanel value={tabValue} index={2} sx={{ p: 0, height: '100%' }}>
            
            {/* VIEW A: Curriculum List */}
            {!activeLesson && (
              <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }} className="fade-up">
                {completedBanner && (
                  <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setCompletedBanner('')}>
                    Nice work — “{completedBanner}” is complete. You can revisit it anytime with <strong>Review</strong>.
                  </Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h6" fontWeight={800}>Your Journey</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {Math.max(0, unlockedLevel - 1)} of {LESSON_DATA.length} complete
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, ((unlockedLevel - 1) / LESSON_DATA.length) * 100)}
                  sx={{ mb: 3 }}
                />
                <Box>
                  {TRACKS.map((track, trackIndex) => {
                    const trackLessons = LESSON_DATA.filter((l) => l.modality === track.id);
                    if (trackLessons.length === 0) return null;
                    return (
                      <Box key={track.id} sx={{ mb: 4 }}>
                        {/* Track header */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5, mt: trackIndex === 0 ? 0 : 1 }}>
                          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.5 }}>
                            {track.id === 'CAPSTONE' ? 'Finale' : `Track ${trackIndex + 1}`}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={800}>{track.title}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{track.blurb}</Typography>

                        {trackLessons.map((lesson) => {
                          const isUnlocked = lesson.id <= unlockedLevel;
                          const isCurrent = lesson.id === unlockedLevel;
                          const isDone = lesson.id < unlockedLevel;
                          return (
                            <Paper
                              key={lesson.id}
                              elevation={0}
                              sx={{
                                p: 2.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2,
                                borderRadius: '16px',
                                border: `1px solid ${isCurrent ? tokens.teal : tokens.border}`,
                                background: isCurrent ? 'rgba(45,212,191,0.07)' : tokens.surfaceMuted,
                                boxShadow: isCurrent ? fx.glow : 'none',
                                opacity: isUnlocked ? 1 : 0.55,
                                transition: 'all .2s ease',
                                '&:hover': isUnlocked ? { borderColor: tokens.borderStrong, transform: 'translateY(-1px)' } : {},
                              }}
                            >
                              {/* Status badge */}
                              <Box sx={{
                                width: 40, height: 40, flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', fontWeight: 800,
                                background: isDone ? fx.tealGradient : (isCurrent ? 'rgba(45,212,191,0.15)' : tokens.surfaceHover),
                                color: isDone ? '#FFFFFF' : (isCurrent ? tokens.tealDark : 'text.secondary'),
                                border: `1px solid ${isCurrent && !isDone ? tokens.teal : tokens.border}`,
                              }}>
                                {!isUnlocked ? <Lock fontSize="small" /> : (isDone ? <CheckCircle fontSize="small" /> : lesson.id)}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>{lesson.title}</Typography>
                                <Typography variant="caption" color="text.secondary">{lesson.skill}{isCurrent ? ' · Up next' : (isDone ? ' · Completed' : '')}</Typography>
                              </Box>
                              {isUnlocked && (
                                <Button variant={isCurrent ? 'contained' : 'outlined'} color="primary" onClick={() => startLesson(lesson)} sx={{ flexShrink: 0 }}>
                                  {isCurrent ? 'Start' : 'Review'}
                                </Button>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* VIEW B: Active Lesson Wizard */}
            {activeLesson && (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                                {/* Wizard Header */}
                <Box sx={{ p: 3, borderBottom: `1px solid ${tokens.border}`, bgcolor: tokens.surfaceMuted }}>

                  <Button
                    startIcon={<ArrowBack />} 
                    onClick={() => setActiveLesson(null)} 
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Exit Lesson
                  </Button>
                  
                  {(() => {
                    const track = TRACKS.find((t) => t.id === activeLesson.modality);
                    return track ? (
                      <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.5, display: 'block', mb: 0.5 }}>
                        {track.title}
                      </Typography>
                    ) : null;
                  })()}
                  <Typography variant="h5" fontWeight="bold">
                    Module {activeLesson.id}: {activeLesson.title}
                  </Typography>
                  
                  {/* 👆 The new nonLinear interactive Stepper */}
                  <Stepper nonLinear activeStep={activeStep} sx={{ mt: 3 }}>
                    {['Learn', 'Practice', 'Commit'].map((label, index) => (
                      <Step key={label}>
                        <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                          {label}
                        </StepButton>
                      </Step>
                    ))}
                  </Stepper>
                  
                </Box>

                {/* Wizard Content Area */}
                <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
                  
                  {/* STEP 0 — LEARN: Gita anchor + concept */}
                  {activeStep === 0 && (
                    <Box sx={{ maxWidth: 720 }}>
                      <Typography variant="overline" color="primary" sx={{ letterSpacing: 1 }}>
                        {activeLesson.skill}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.4, mt: 0.5, mb: 1 }}>
                        {activeLesson.concept.hook}
                      </Typography>
                      {activeLesson.objective && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Goal: {activeLesson.objective}
                        </Typography>
                      )}

                      {/* Gita anchor callout */}
                      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: '14px', background: tokens.surfaceHover, borderLeft: `3px solid ${tokens.primary || '#2DD4BF'}` }}>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {activeLesson.gita_anchor.ref}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.7, fontStyle: 'italic' }}>
                          {activeLesson.gita_anchor.teaching}
                        </Typography>
                      </Paper>

                      {/* CBT translation */}
                      <Box sx={{ fontSize: '1.05rem', lineHeight: 1.8, mb: 3 }}>
                        <MarkdownText content={activeLesson.concept.bridge} />
                      </Box>

                      {/* Worked example */}
                      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(45,212,191,0.06)', border: `1px solid ${tokens.border}` }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                          In practice
                        </Typography>
                        <Box sx={{ mt: 1, lineHeight: 1.7 }}>
                          <MarkdownText content={activeLesson.concept.example} />
                        </Box>
                      </Paper>
                    </Box>
                  )}

                  {/* STEP 1 — PRACTICE: structured typed exercise */}
                  {activeStep === 1 && activeLesson.exercise && (
                    <Box sx={{ maxWidth: 720 }}>
                      <Typography variant="h6" color="primary" mb={1}>{activeLesson.exercise.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 3 }}>
                        {activeLesson.exercise.instructions}
                      </Typography>

                      {/* Labeled-fields exercise */}
                      {activeLesson.exercise.type === 'fields' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          {activeLesson.exercise.fields.map((f) => (
                            <Box key={f.key}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>{f.label}</Typography>
                              <VoiceTextField
                                fullWidth
                                multiline
                                minRows={2}
                                placeholder={f.placeholder || ''}
                                variant="outlined"
                                value={exerciseAnswers[f.key] || ''}
                                onValueChange={(v) => setExerciseField(f.key, v)}
                                maxLength={2000}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Chip-select exercise */}
                      {activeLesson.exercise.type === 'chips' && (
                        <Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 3 }}>
                            {activeLesson.exercise.options.map((opt) => {
                              const selected = (exerciseAnswers._selected || []).includes(opt);
                              return (
                                <Chip
                                  key={opt}
                                  label={opt}
                                  clickable
                                  onClick={() => toggleExerciseChip(opt)}
                                  color={selected ? 'primary' : 'default'}
                                  variant={selected ? 'filled' : 'outlined'}
                                  sx={{ py: 2, fontSize: '0.9rem' }}
                                />
                              );
                            })}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
                            {activeLesson.exercise.notesLabel || 'Notes'}
                          </Typography>
                          <VoiceTextField
                            fullWidth
                            multiline
                            minRows={3}
                            variant="outlined"
                            value={exerciseAnswers.notes || ''}
                            onValueChange={(v) => setExerciseField('notes', v)}
                            maxLength={2000}
                          />
                        </Box>
                      )}

                      {/* Safety note — gentle guardrail tied to this exercise */}
                      {activeLesson.safety_note && (
                        <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: '12px', display: 'flex', gap: 1.25, background: tokens.surfaceMuted, border: `1px solid ${tokens.border}` }}>
                          <HelpOutline fontSize="small" sx={{ color: 'text.secondary', mt: '2px', flexShrink: 0 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {activeLesson.safety_note}
                          </Typography>
                        </Paper>
                      )}

                      {/* #4 — AI reflection: read this before writing your takeaway */}
                      <Divider sx={{ my: 3, borderColor: tokens.border }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          A reflection before you move on
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          When you&apos;ve filled in your answers above, get a short reflection to learn from — then use it to shape your takeaway on the next step.
                        </Typography>

                        {!analysisText && !analysisLoading && (
                          <Button
                            variant="outlined"
                            startIcon={<AutoAwesome />}
                            onClick={handleAnalyze}
                            disabled={!hasExerciseAnswers()}
                          >
                            Reflect on my answers
                          </Button>
                        )}

                        {(analysisText || analysisLoading) && (
                          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(45,212,191,0.06)', border: `1px solid ${tokens.border}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <AutoAwesome fontSize="small" sx={{ color: 'primary.main' }} />
                              <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Your guide&apos;s reflection
                              </Typography>
                            </Box>
                            {analysisText ? <MarkdownText content={analysisText} /> : <TypingIndicator small />}
                            {analysisText && !analysisLoading && (
                              <Button size="small" onClick={handleAnalyze} sx={{ mt: 1, color: 'text.secondary' }}>
                                Reflect again
                              </Button>
                            )}
                          </Paper>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* STEP 2 — COMMIT: reflection */}
                  {activeStep === 2 && (
                    <Box sx={{ maxWidth: 720 }}>
                      <Typography variant="h6" color="primary" mb={2}>Your takeaway</Typography>
                      <Typography variant="body1" mb={3} fontWeight={600} sx={{ lineHeight: 1.6 }}>
                        {activeLesson.reflection_prompt}
                      </Typography>
                      <VoiceTextField fullWidth multiline rows={4} placeholder="Write your intention…" variant="outlined" value={blueprintData} onValueChange={setBlueprintData} maxLength={2000} />

                      {/* #3 — AI response to the takeaway the user just wrote */}
                      <Box sx={{ mt: 3 }}>
                        {!takeawayText && !takeawayLoading && (
                          <Button
                            variant="outlined"
                            startIcon={<AutoAwesome />}
                            onClick={handleTakeawayResponse}
                            disabled={!blueprintData.trim()}
                          >
                            Get a response to your takeaway
                          </Button>
                        )}

                        {(takeawayText || takeawayLoading) && (
                          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', background: 'rgba(45,212,191,0.06)', border: `1px solid ${tokens.border}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <AutoAwesome fontSize="small" sx={{ color: 'primary.main' }} />
                              <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Your guide&apos;s response
                              </Typography>
                            </Box>
                            {takeawayText ? <MarkdownText content={takeawayText} /> : <TypingIndicator small />}
                            {takeawayText && !takeawayLoading && (
                              <Button size="small" onClick={handleTakeawayResponse} sx={{ mt: 1, color: 'text.secondary' }}>
                                Respond again
                              </Button>
                            )}
                          </Paper>
                        )}
                      </Box>
                    </Box>
                  )}

                </Box>

                {/* Wizard Footer Controls */}
                <Box sx={{ p: 2, borderTop: `1px solid ${tokens.border}`, display: 'flex', justifyContent: 'space-between', bgcolor: tokens.surfaceMuted }}>
                  <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Previous</Button>
                  
                  {activeStep < 2 ? (
                    <Button variant="contained" endIcon={<ArrowForward />} onClick={() => setActiveStep(prev => prev + 1)}>Next</Button>
                  ) : (
                    <Button variant="contained" color="success" endIcon={<CheckCircle />} onClick={finishLesson} disabled={!blueprintData}>Complete Module</Button>
                  )}
                </Box>

              </Box>
            )}
          </TabPanel>

        </Paper>

        {/* Always-available in-the-moment coping toolkit (FAB + modal). */}
        <SosLauncher sessionId={sessionId} />
      </Box>
  );
}
