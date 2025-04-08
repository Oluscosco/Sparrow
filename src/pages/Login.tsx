import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  alpha,
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { useSettings } from '../contexts/SettingsContext';

export default function Login() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        localStorage.setItem('access_token', accessToken);

        // Fetch user info
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => res.json());
        localStorage.setItem('user', JSON.stringify(userInfo));
        navigate('/home');
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
  });
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          background: (theme) => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: settings.compactMode ? 4 : 8,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Welcome to Google Sheets Manager
          </Typography>
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary">
            Sign in with your Google account to manage your sheets
          </Typography>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={() =>{
            setLoading(true);
            login()
          }}
          size="large"
          sx={{
            width: '100%',
            maxWidth: 300,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Sign in with Google
        </Button>
        )}
      </Paper>
    </Container>
  );
} 