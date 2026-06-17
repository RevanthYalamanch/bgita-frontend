import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Tabs, Tab,
  Typography, Button, TextField, Paper, Avatar, Alert,
  Stepper, Step, StepLabel, StepButton, Divider, Chip, Link, LinearProgress // 👈 Added Chip, Link, LinearProgress
} from '@mui/material';
import { Create, Chat as ChatIcon, MenuBook, ExitToApp, CheckCircle, Lock, ArrowBack, ArrowForward, HelpOutline } from '@mui/icons-material'; // 👈 Added HelpOutline
import { fx, tokens } from '../lib/theme';

// 🗂️ Import your new curriculum database!
import { LESSON_DATA } from '../data/curriculum';


//Distortion Labeler Concept
/*const [selectedDistortions, setSelectedDistortions] = useState([]);

const toggleDistortion = (distortion) => {
  setSelectedDistortions(prev => 
    prev.includes(distortion) 
      ? prev.filter(d => d !== distortion) 
      : [...prev, distortion]
  );
  // Also save it to the exerciseData so the backend gets it!
  setExerciseData(`Selected Distortions: ${selectedDistortions.join(', ')}`);
}; */

// Convert the UI's message list into the Claude history format the backend
// expects. The UI uses role 'ai'; Claude expects 'assistant'.
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
    return;
  }

  setMessages(prev => [...prev, { role: 'ai', content: '' }]);

  if (!response.body) {
    const fallback = await response.text();
    setMessages(prev => {
      const next = [...prev];
      next[next.length - 1] = { role: 'ai', content: fallback };
      return next;
    });
    return;
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
}

// Render inline markdown: **bold** and bare http(s) URLs (autolinked). Anything
// else passes through as plain text. Returns an array of React nodes.
function renderInline(text, keyPrefix) {
  const parts = (text || '').split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      // Don't swallow trailing sentence punctuation into the link.
      const m = part.match(/^(https?:\/\/[^\s]*?)([.,)]*)$/);
      const url = m ? m[1] : part;
      const trail = m ? m[2] : '';
      return (
        <React.Fragment key={key}>
          <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.light' }}>{url}</Link>
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
      <Avatar sx={{ background: fx.tealGradient, color: '#04141A', width: small ? 32 : 40, height: small ? 32 : 40, fontSize: small ? 16 : 20 }}>🧠</Avatar>
      <Paper elevation={0} sx={{ px: 2, py: 1.5, border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', display: 'flex', gap: 0.75, alignItems: 'center' }}>
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div hidden={value !== index} {...other}>{value === index && <Box sx={{ p: 3, height: '100%' }}>{children}</Box>}</div>;
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

  // 📖 LESSON CHAT STATE
  const [lessonChatInput, setLessonChatInput] = useState('');
  const [isLessonChatLoading, setIsLessonChatLoading] = useState(false);
  const [lessonChatMessages, setLessonChatMessages] = useState([]);

  // General Chat State
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', content: 'Hello Revanth. I am your Cognitive Space guide. How are you feeling today?' }]);

  // 📖 LESSON WIZARD STATE
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null); // Which lesson is open?
  const [activeStep, setActiveStep] = useState(0); // 0: Concept, 1: Chat, 2: Exercise, 3: Blueprint
  const [exerciseData, setExerciseData] = useState('');
  const [blueprintData, setBlueprintData] = useState('');

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
  }, []);

  const handleLogout = () => {
    // Clear the name when they log out for privacy!
    localStorage.removeItem('userName');
    router.push('/');
  };

  const handleSaveDiary = async () => {
    if (!mood || !diaryText) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // The backend derives the user from the token; email here is ignored.
        body: JSON.stringify({ mood_score: mood, diary_text: diaryText }),
      });

      if (!response.ok) {
        alert("Could not save your entry. Please try again.");
        return;
      }

      setDiarySaved(true);
      setMood(null);
      setDiaryText('');
      setTimeout(() => setDiarySaved(false), 3000);
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
    setChatInput('');
    // Snapshot the conversation so far to send as context (before adding the new turn).
    const history = toHistory(chatMessages);
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    // 🛡️ SAFE EXTRACTION: Grab the email safely before hitting the network
    const userString = localStorage.getItem('user');
    const userEmail = userString ? JSON.parse(userString).email : "unknown_user";

    try {
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
          email: userEmail, // 👈 Use the safe variable here
          history,
        }),
      });
      await streamInto(response, setChatMessages);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "Network error connecting to bridge." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonSendMessage = async () => {
    if (!lessonChatInput.trim() || !activeLesson) return;
    const userText = lessonChatInput;
    setLessonChatInput('');
    const history = toHistory(lessonChatMessages);
    setLessonChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLessonChatLoading(true);

    // 🛡️ SAFE EXTRACTION: Grab the email safely before hitting the network
    const userString = localStorage.getItem('user');
    const userEmail = userString ? JSON.parse(userString).email : "unknown_user";

    try {
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: activeLesson.ai_prompt_context,
          session_id: sessionId,
          email: userEmail, // 👈 Use the safe variable here
          history,
        }),
      });
      await streamInto(response, setLessonChatMessages);
    } catch (error) {
      setLessonChatMessages(prev => [...prev, { role: 'ai', content: "Network error." }]);
    } finally {
      setIsLessonChatLoading(false);
    }
  };

  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveStep(0);
    setExerciseData('');
    setBlueprintData('');
    // Give the AI a custom opening line based on the module!
    setLessonChatMessages([{ role: 'ai', content: `Welcome to Module ${lesson.id}. I am ready to guide you through this concept. What are your initial thoughts?` }]);
  };



  const finishLesson = async () => {
    // 1. Need a valid session token to save progress under this account.
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    try {
      // 2. Send the data to your Next.js bridge (identity comes from the token).
      const response = await fetch('/api/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: activeLesson.id,
          exercise_data: exerciseData,
          blueprint_data: blueprintData
        })
      });

      if (!response.ok) {
        alert("Failed to save your progress. Please try again.");
        return;
      }

      // 3. Close the wizard and unlock the next level!
      setUnlockedLevel(prev => Math.max(prev, activeLesson.id + 1));
      setActiveLesson(null);
      setActiveStep(0);

    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Failed to save your progress. Please check your internet connection.");
    }
  };

  // The Lifeline Feature
  const handleStuck = () => {
    setLessonChatInput("I'm not sure how to answer that. Can you rephrase the question or give me a multiple-choice hint?");
  };

  return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.75 }, minWidth: 0 }}>
            <Box sx={{ width: { xs: 38, sm: 44 }, height: { xs: 38, sm: 44 }, flexShrink: 0, borderRadius: '14px', display: 'grid', placeItems: 'center', fontSize: { xs: 19, sm: 22 }, background: fx.tealGradient, boxShadow: fx.glow }}>🧠</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" fontWeight={800} sx={{ ...fx.brandGradientText, lineHeight: 1.1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Cognitive Space</Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                Welcome back, {userName || 'friend'}.
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout} sx={{ color: 'text.secondary', borderColor: tokens.border, flexShrink: 0 }}>Logout</Button>
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
                bgcolor: 'rgba(255,255,255,0.02)',
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
              <Typography variant="h6" fontWeight={800} gutterBottom>Daily Check-In</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                A small moment of awareness. How are you arriving today?
              </Typography>
              {diarySaved && <Alert severity="success" sx={{ mb: 3 }}>Journal entry saved — well done for showing up.</Alert>}

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>How is your mood?</Typography>
              <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1.25 }, mb: 4 }}>
                {[
                  { v: 1, emoji: '😣', label: 'Awful' },
                  { v: 2, emoji: '😕', label: 'Low' },
                  { v: 3, emoji: '😐', label: 'Okay' },
                  { v: 4, emoji: '🙂', label: 'Good' },
                  { v: 5, emoji: '😄', label: 'Great' },
                ].map((m) => {
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
                        background: selected ? 'rgba(45,212,191,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selected ? tokens.teal : tokens.border}`,
                        boxShadow: selected ? fx.glow : 'none',
                        transform: selected ? 'translateY(-3px)' : 'none',
                        '&:hover': { borderColor: tokens.borderStrong, transform: 'translateY(-2px)' },
                      }}
                    >
                      <Box sx={{ fontSize: { xs: 22, sm: 28 }, lineHeight: 1, filter: selected ? 'none' : 'grayscale(0.4)' }}>{m.emoji}</Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.75rem' }, color: selected ? 'primary.light' : 'text.secondary' }}>{m.label}</Typography>
                    </Box>
                  );
                })}
              </Box>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>What&apos;s on your mind?</Typography>
              <TextField fullWidth multiline rows={5} placeholder="Write as much or as little as you like…" value={diaryText} onChange={(e) => setDiaryText(e.target.value)} variant="outlined" sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="large" onClick={handleSaveDiary} disabled={!mood || !diaryText}>Save Entry</Button>
              </Box>
            </Box>
          </TabPanel>

          {/* 💬 GENERAL CHAT (Unchanged) */}
          <TabPanel value={tabValue} index={1} sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ... Chat content ... */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '500px' }}>
              {chatMessages.map((msg, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <Avatar sx={{ background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : fx.tealGradient, color: msg.role === 'user' ? 'text.primary' : '#04141A' }}>{msg.role === 'user' ? '👤' : '🧠'}</Avatar>
                  <Paper elevation={0} sx={{ p: 2, border: 'none', background: msg.role === 'user' ? fx.tealGradient : 'rgba(255,255,255,0.05)', color: msg.role === 'user' ? '#04141A' : 'text.primary', maxWidth: '80%', borderRadius: '16px', borderTopRightRadius: msg.role === 'user' ? '4px' : '16px', borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px' }}>
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
            <Box sx={{ p: 2, borderTop: `1px solid ${tokens.border}`, display: 'flex', gap: 1, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <TextField fullWidth placeholder="Type your message..." variant="outlined" size="small" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} inputProps={{ maxLength: 4000 }} />
              <Button variant="contained" onClick={handleSendMessage} disabled={isLoading}>Send</Button>
            </Box>
          </TabPanel>

          {/* 📖 CURRICULUM & LESSON WIZARD */}
          <TabPanel value={tabValue} index={2} sx={{ p: 0, height: '100%' }}>
            
            {/* VIEW A: Curriculum List */}
            {!activeLesson && (
              <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }} className="fade-up">
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
                  {LESSON_DATA.map((lesson) => {
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
                          background: isCurrent ? 'rgba(45,212,191,0.07)' : 'rgba(255,255,255,0.02)',
                          boxShadow: isCurrent ? fx.glow : 'none',
                          opacity: isUnlocked ? 1 : 0.55,
                          transition: 'all .2s ease',
                          '&:hover': isUnlocked ? { borderColor: tokens.borderStrong, transform: 'translateY(-1px)' } : {},
                        }}
                      >
                        {/* Status badge */}
                        <Box sx={{
                          width: 40, height: 40, flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', fontWeight: 800,
                          background: isDone ? fx.tealGradient : (isCurrent ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)'),
                          color: isDone ? '#04141A' : (isCurrent ? tokens.tealLight : 'text.secondary'),
                          border: `1px solid ${isCurrent && !isDone ? tokens.teal : tokens.border}`,
                        }}>
                          {!isUnlocked ? <Lock fontSize="small" /> : (isDone ? <CheckCircle fontSize="small" /> : lesson.id)}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>{lesson.title}</Typography>
                          <Typography variant="caption" color="text.secondary">Module {lesson.id}{isCurrent ? ' · Up next' : (isDone ? ' · Completed' : '')}</Typography>
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
              </Box>
            )}

            {/* VIEW B: Active Lesson Wizard */}
            {activeLesson && (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                                {/* Wizard Header */}
                <Box sx={{ p: 3, borderBottom: `1px solid ${tokens.border}`, bgcolor: 'rgba(255,255,255,0.02)' }}>

                  <Button
                    startIcon={<ArrowBack />} 
                    onClick={() => setActiveLesson(null)} 
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Exit Lesson
                  </Button>
                  
                  <Typography variant="h5" fontWeight="bold">
                    Module {activeLesson.id}: {activeLesson.title}
                  </Typography>
                  
                  {/* 👆 The new nonLinear interactive Stepper */}
                  <Stepper nonLinear activeStep={activeStep} sx={{ mt: 3 }}>
                    {['Concept', 'Dialogue', 'Exercise', 'Blueprint'].map((label, index) => (
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
                  
                  {activeStep === 0 && (
                    <Box>
                      <Typography variant="h6" color="primary" mb={2}>1. The Concept</Typography>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {activeLesson.concept_reading}
                      </Typography>
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '450px' }}>
                      <Typography variant="h6" color="primary" mb={2}>2. Socratic Dialogue</Typography>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Your AI guide is instructed specifically on Module {activeLesson.id}. Discuss how this concept applies to your life.
                      </Alert>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          icon={<HelpOutline />} 
                          label="I'm stuck" 
                          onClick={handleStuck}
                          clickable 
                          color="warning" 
                          variant="outlined"
                        />
                      </Box>

                      {/* Lesson Chat Transcript */}
                      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, my: 1, pr: 1 }}>
                        {lessonChatMessages.map((msg, index) => (
                          <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <Avatar sx={{ background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : fx.tealGradient, color: msg.role === 'user' ? 'text.primary' : '#04141A', width: 32, height: 32, fontSize: 16 }}>{msg.role === 'user' ? '👤' : '🧠'}</Avatar>
                            <Paper elevation={0} sx={{ p: 1.5, border: 'none', background: msg.role === 'user' ? fx.tealGradient : 'rgba(255,255,255,0.05)', color: msg.role === 'user' ? '#04141A' : 'text.primary', maxWidth: '80%', borderRadius: '14px' }}>
                              {msg.role === 'user'
                                ? <Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                : <MarkdownText content={msg.content} />}
                            </Paper>
                          </Box>
                        ))}
                        {isLessonChatLoading && <TypingIndicator small />}
                      </Box>

                      {/* Lesson Chat Input */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField fullWidth placeholder="Discuss the lesson..." variant="outlined" size="small" value={lessonChatInput} onChange={(e) => setLessonChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLessonSendMessage()} inputProps={{ maxLength: 4000 }} />
                        <Button variant="contained" onClick={handleLessonSendMessage} disabled={isLessonChatLoading}>Send</Button>
                      </Box>
                    </Box>
                  )}


                  {activeStep === 2 && (
                    <Box>
                      <Typography variant="h6" color="primary" mb={2}>3. Active Exercise: {activeLesson.exercise_type.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>Complete the required cognitive behavioral exercise below.</Typography>
                      <TextField fullWidth multiline rows={8} placeholder="Begin your exercise here..." variant="outlined" value={exerciseData} onChange={(e) => setExerciseData(e.target.value)} />
                    </Box>
                  )}

                  {/* cognitive distortion concept*/}
                  {/*activeStep === 2 && (
  <Box>
    <Typography variant="h6" color="primary" mb={2}>3. Active Exercise: Label the Distortion</Typography>
    <Typography variant="body2" color="text.secondary" mb={3}>
      Review the negative thought you just discussed. Which "Thinking Traps" is your brain falling into right now? Click all that apply.
    </Typography>
    
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4, p: 3, bgcolor: '#18181b', borderRadius: 2, border: '1px solid #27272a' }}>
      {[
        "Catastrophizing (Expecting the worst)", 
        "All-or-Nothing (Black and white thinking)", 
        "Mind Reading (Assuming what others think)", 
        "Fortune Telling (Predicting the future)", 
        "Emotional Reasoning (I feel it, so it's true)",
        "Should Statements (Strict rules for yourself)",
        "Personalization (Blaming yourself for everything)"
      ].map((distortion) => (
        <Chip 
          key={distortion}
          label={distortion}
          onClick={() => toggleDistortion(distortion)}
          color={selectedDistortions.includes(distortion) ? "primary" : "default"}
          variant={selectedDistortions.includes(distortion) ? "filled" : "outlined"}
          sx={{ py: 2.5, px: 1, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
        />
      ))}
    </Box>

    <TextField 
      fullWidth 
      multiline 
      rows={3} 
      placeholder="Optional: Why did you pick these specific labels?" 
      variant="outlined" 
      onChange={(e) => setExerciseData(`Distortions: ${selectedDistortions.join(', ')} | Notes: ${e.target.value}`)} 
    />
  </Box>
)*/}
                

                  
                  

                  {activeStep === 3 && (
                    <Box>
                      <Typography variant="h6" color="primary" mb={2}>4. The Blueprint</Typography>
                      <Typography variant="body1" mb={3} fontWeight="bold">{activeLesson.reflection_prompt}</Typography>
                      <TextField fullWidth multiline rows={4} placeholder="Your actionable intention..." variant="outlined" value={blueprintData} onChange={(e) => setBlueprintData(e.target.value)} />
                    </Box>
                  )}

                </Box>

                {/* Wizard Footer Controls */}
                <Box sx={{ p: 2, borderTop: `1px solid ${tokens.border}`, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Previous</Button>
                  
                  {activeStep < 3 ? (
                    <Button variant="contained" endIcon={<ArrowForward />} onClick={() => setActiveStep(prev => prev + 1)}>Next Phase</Button>
                  ) : (
                    <Button variant="contained" color="success" endIcon={<CheckCircle />} onClick={finishLesson} disabled={!blueprintData}>Complete Module</Button>
                  )}
                </Box>

              </Box>
            )}
          </TabPanel>

        </Paper>
      </Box>
  );
}
