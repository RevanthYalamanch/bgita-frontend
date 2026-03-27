import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab, 
  Typography, Button, TextField, Paper, Avatar, CircularProgress, Alert,
  Stepper, Step, StepLabel, StepButton, Divider
} from '@mui/material';
import { Create, Chat as ChatIcon, MenuBook, ExitToApp, CheckCircle, Lock, ArrowBack, ArrowForward } from '@mui/icons-material';

// 🗂️ Import your new curriculum database!
import { LESSON_DATA } from '../data/curriculum';

const darkTheme = createTheme({
  palette: { mode: 'dark', background: { default: '#09090b', paper: '#18181b' }, primary: { main: '#14b8a6' } },
  typography: { fontFamily: 'sans-serif' }
});

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

  const handleSaveDiary = () => {
    if (!mood || !diaryText) return;
    setDiarySaved(true);
    setMood(null);
    setDiaryText('');
    setTimeout(() => setDiarySaved(false), 3000);
  };

const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
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
          email: userEmail // 👈 Use the safe variable here
        }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
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
          email: userEmail // 👈 Use the safe variable here
        }),
      });
      const data = await response.json();
      setLessonChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
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
    // 1. Grab the JSON package and unpack the email
    const userString = localStorage.getItem('user');
    const userEmail = userString ? JSON.parse(userString).email : null;
    
    if (!userEmail) {
      alert("Session expired. Please log out and log back in.");
      return;
    }

    try {
      // 2. Send the data to your Next.js bridge
      await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          lesson_id: activeLesson.id,
          exercise_data: exerciseData,
          blueprint_data: blueprintData
        })
      });

      // 3. Close the wizard and unlock the next level!
      setUnlockedLevel(prev => Math.max(prev, activeLesson.id + 1));
      setActiveLesson(null);
      setActiveStep(0);
      
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Failed to save your progress. Please check your internet connection.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 24, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} /> Cognitive Space
            </Typography>
            {/* 👤 Injecting the dynamic name here! */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Welcome back, {userName}.
            </Typography>
          </Box>
          <Button color="error" startIcon={<ExitToApp />} onClick={handleLogout}>Logout</Button>
        </Box>

        <Paper elevation={0} sx={{ border: '1px solid #27272a', borderRadius: 2, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          
          {/* Hide tabs if we are inside an active lesson wizard */}
          {!activeLesson && (
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#0f0f13' }}>
              <Tab icon={<Create />} iconPosition="start" label="Diary" />
              <Tab icon={<ChatIcon />} iconPosition="start" label="General Chat" />
              <Tab icon={<MenuBook />} iconPosition="start" label="Curriculum" />
            </Tabs>
          )}

          {/* 📔 DIARY (Unchanged) */}
          <TabPanel value={tabValue} index={0}>
            {/* ... Diary content ... */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>Daily Check-In</Typography>
            {diarySaved && <Alert severity="success" sx={{ mb: 2 }}>Journal entry saved!</Alert>}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>1. Mood (1-5)</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Button key={num} variant={mood === num ? "contained" : "outlined"} onClick={() => setMood(num)} sx={{ flex: 1, py: 2, fontSize: '1.2rem' }}>{num}</Button>
              ))}
            </Box>
            <TextField fullWidth multiline rows={5} placeholder="What is on your mind today?" value={diaryText} onChange={(e) => setDiaryText(e.target.value)} variant="outlined" sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" size="large" onClick={handleSaveDiary} disabled={!mood || !diaryText}>Save Entry</Button>
            </Box>
          </TabPanel>

          {/* 💬 GENERAL CHAT (Unchanged) */}
          <TabPanel value={tabValue} index={1} sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ... Chat content ... */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '500px' }}>
              {chatMessages.map((msg, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <Avatar sx={{ bgcolor: msg.role === 'user' ? 'grey.800' : 'primary.dark' }}>{msg.role === 'user' ? '👤' : '🧠'}</Avatar>
                  <Paper sx={{ p: 2, bgcolor: msg.role === 'user' ? 'primary.dark' : '#27272a', color: msg.role === 'user' ? 'white' : 'text.primary', maxWidth: '80%', borderRadius: 3 }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
              {isLoading && <CircularProgress size={24} sx={{ ml: 6 }} />}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #27272a', display: 'flex', gap: 1 }}>
              <TextField fullWidth placeholder="Type your message..." variant="outlined" size="small" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <Button variant="contained" onClick={handleSendMessage} disabled={isLoading}>Send</Button>
            </Box>
          </TabPanel>

          {/* 📖 CURRICULUM & LESSON WIZARD */}
          <TabPanel value={tabValue} index={2} sx={{ p: 0, height: '100%' }}>
            
            {/* VIEW A: Curriculum List */}
            {!activeLesson && (
              <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Your Journey (Level {unlockedLevel})</Typography>
                <Box sx={{ pr: 2 }}>
                  {LESSON_DATA.map((lesson) => {
                    const isUnlocked = lesson.id <= unlockedLevel;
                    const isCurrent = lesson.id === unlockedLevel;
                    return (
                      <Paper key={lesson.id} variant="outlined" sx={{ p: 3, mb: 2, borderColor: isCurrent ? 'primary.main' : '#27272a', bgcolor: isCurrent ? 'rgba(20, 184, 166, 0.05)' : (isUnlocked ? '#18181b' : '#0f0f13'), opacity: isUnlocked ? 1 : 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: isUnlocked ? 2 : 0 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!isUnlocked ? <Lock fontSize="small" /> : (lesson.id < unlockedLevel ? <CheckCircle color="primary" fontSize="small" /> : null)}
                            Module {lesson.id}: {lesson.title}
                          </Typography>
                        </Box>
                        {isUnlocked && (
                          <Button variant={isCurrent ? "contained" : "outlined"} color="primary" onClick={() => startLesson(lesson)} sx={{ mt: 1 }}>
                            {isCurrent ? "Start Module" : "Review Module"}
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
                <Box sx={{ p: 3, borderBottom: '1px solid #27272a', bgcolor: '#0f0f13' }}>
                  
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
                      
                      {/* Lesson Chat History Area */}
                      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#18181b', borderRadius: 2, border: '1px solid #27272a', mb: 2 }}>
                        {lessonChatMessages.map((msg, index) => (
                          <Box key={index} sx={{ display: 'flex', gap: 1.5, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <Avatar sx={{ bgcolor: msg.role === 'user' ? 'grey.800' : 'primary.dark', width: 32, height: 32 }}>{msg.role === 'user' ? '👤' : '🧠'}</Avatar>
                            <Paper sx={{ p: 1.5, bgcolor: msg.role === 'user' ? 'primary.dark' : '#27272a', color: msg.role === 'user' ? 'white' : 'text.primary', maxWidth: '85%', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                            </Paper>
                          </Box>
                        ))}
                        {isLessonChatLoading && <CircularProgress size={20} sx={{ ml: 5 }} />}
                      </Box>

                      {/* Lesson Chat Input */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField fullWidth placeholder="Discuss the lesson..." variant="outlined" size="small" value={lessonChatInput} onChange={(e) => setLessonChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLessonSendMessage()} />
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

                  {activeStep === 3 && (
                    <Box>
                      <Typography variant="h6" color="primary" mb={2}>4. The Blueprint</Typography>
                      <Typography variant="body1" mb={3} fontWeight="bold">{activeLesson.reflection_prompt}</Typography>
                      <TextField fullWidth multiline rows={4} placeholder="Your actionable intention..." variant="outlined" value={blueprintData} onChange={(e) => setBlueprintData(e.target.value)} />
                    </Box>
                  )}

                </Box>

                {/* Wizard Footer Controls */}
                <Box sx={{ p: 2, borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', bgcolor: '#0f0f13' }}>
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
    </ThemeProvider>
  );
}
