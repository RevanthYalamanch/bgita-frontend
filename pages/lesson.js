import React, { useState, useRef, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, CircularProgress, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function Lesson() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Welcome to Module 1. To start, can you briefly describe a recent situation that made you feel frustrated or upset? Just stick to the facts for now." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    // 1. Add user's message to the screen
    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Send the conversation to our hidden Next.js API route
      const response = await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatHistory: newMessages })
      });

      const data = await response.json();

      // 3. Add AI's reply to the screen
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || "Can you tell me a little more about that?" }]);
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having a little trouble connecting. Can we try that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // The Lifeline Feature
  const handleStuck = () => {
    handleSend("I'm not sure how to answer that. Can you rephrase the question or give me a multiple-choice hint?");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Socratic Guide</Typography>
        <Typography variant="subtitle1" color="text.secondary">Step-by-step cognitive analysis</Typography>
      </Box>

      {/* Chat Window */}
      <Paper elevation={3} sx={{ flexGrow: 1, p: 3, mb: 3, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                maxWidth: '75%', 
                backgroundColor: msg.role === 'user' ? '#1976d2' : '#ffffff',
                color: msg.role === 'user' ? '#ffffff' : '#333333',
                borderRadius: msg.role === 'user' ? '20px 20px 0px 20px' : '20px 20px 20px 0px'
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="caption" sx={{ ml: 1, mt: 0.5 }}>Guide is typing...</Typography>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            icon={<HelpOutlineIcon />} 
            label="I'm stuck" 
            onClick={handleStuck}
            clickable 
            color="warning" 
            variant="outlined"
          />
        </Box>

        {/* Text Field & Send Button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your answer here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            disabled={isTyping}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            sx={{ px: 4 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>

    </Container>
  );
}