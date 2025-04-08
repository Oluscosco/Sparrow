import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';

export default function About() {
  const navigate = useNavigate();
  const version = '1.0.0';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          About
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          background: (theme) => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <InfoIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5">Google Sheets Manager</Typography>
              <Typography color="text.secondary">Version {version}</Typography>
            </Box>
          </Box>
          <Typography paragraph>
            A modern web application for managing and working with Google Sheets. Built with React,
            Material-UI, and the Google Sheets API.
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          background: (theme) => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resources
          </Typography>
          <List>
            <ListItem component={Link} href="https://github.com/yourusername/google-sheets-manager" target="_blank">
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText
                primary="GitHub Repository"
                secondary="View the source code and contribute"
              />
            </ListItem>
            <Divider />
            <ListItem component={Link} href="https://developers.google.com/sheets/api" target="_blank">
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Google Sheets API"
                secondary="Documentation and guides"
              />
            </ListItem>
            <Divider />
            <ListItem component={Link} href="#" target="_blank">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="API Documentation"
                secondary="Detailed API reference"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          background: (theme) => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Legal & Privacy
          </Typography>
          <List>
            <ListItem component={Link} href="#" target="_blank">
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Privacy Policy"
                secondary="How we handle your data"
              />
            </ListItem>
            <Divider />
            <ListItem component={Link} href="#" target="_blank">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="Terms of Service"
                secondary="Usage terms and conditions"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
} 