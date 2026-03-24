import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const mockMessages = [
  { id: 1, text: 'Hello! How can I help you today?', sender: 'bot', timestamp: '10:00 AM' },
  { id: 2, text: 'I want to know more about your products.', sender: 'user', timestamp: '10:01 AM' },
  { id: 3, text: 'Sure! We offer a wide range of products including ChamViet silk, pottery, and more. What are you interested in?', sender: 'bot', timestamp: '10:01 AM' },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const toggleChat = () => setOpen(!open);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Thank you for your message. An agent will get back to you shortly.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}>
      {open && (
        <Paper
          elevation={6}
          sx={{
            width: 350,
            height: 500,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            animation: 'fadeIn 0.2s',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>Support Chat</Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'inherit' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Message List */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'grey.50' }}>
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <Box key={msg.id} sx={{ display: 'flex', gap: 1, alignSelf: isBot ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                  {isBot && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: isBot ? 'background.paper' : 'primary.main',
                        color: isBot ? 'text.primary' : 'primary.contrastText',
                        borderRadius: 2,
                        borderTopLeftRadius: isBot ? 4 : 16,
                        borderTopRightRadius: isBot ? 16 : 4,
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Paper>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, px: 0.5 }}>
                      {msg.timestamp}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
          
          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  color="primary" 
                  onClick={handleSend} 
                  disabled={!inputValue.trim()} 
                  sx={{ 
                    bgcolor: inputValue.trim() ? 'primary.50' : 'transparent',
                    '&:hover': {
                      bgcolor: inputValue.trim() ? 'primary.100' : 'transparent',
                    }
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* FAB */}
      {!open && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={toggleChat}
          sx={{
            boxShadow: 4,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.2)' },
              '70%': { boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' }
            },
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
              animation: 'none'
            }
          }}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
}
