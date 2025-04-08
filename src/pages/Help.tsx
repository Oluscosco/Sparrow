import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';

export default function Help() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  const faqs = [
    {
      question: 'How do I create a new sheet?',
      answer: 'Click the "Create Sheet" button on the home page or use the menu option in an existing sheet to make a copy.',
    },
    {
      question: 'Can I share my sheets with others?',
      answer: 'Yes, you can share your sheets by clicking the "Share" button in the menu. You can control whether others can view, comment, or edit your sheets.',
    },
    {
      question: 'How do I export my sheet?',
      answer: 'Use the "Export" option in the menu to download your sheet in various formats including PDF, Excel, and CSV.',
    },
    {
      question: 'Is there a way to work offline?',
      answer: 'Yes, you can enable offline mode in the Settings page. This will allow you to access and edit your sheets without an internet connection.',
    },
  ];

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
          Help & Support
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
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
              {index < faqs.length - 1 && <Divider />}
            </Accordion>
          ))}
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
            Documentation & Resources
          </Typography>
          <List>
            <ListItem 
              //@ts-ignore
              button component="a" href="#" target="_blank">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="User Guide"
                secondary="Complete guide to using the application"
              />
            </ListItem>
            <Divider />
            <ListItem 
              //@ts-ignore
              button component="a" href="#" target="_blank">
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                primary="Tutorials"
                secondary="Step-by-step tutorials for common tasks"
              />
            </ListItem>
            <Divider />
            <ListItem 
              //@ts-ignore
              button component="a" href="#" target="_blank">
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Contact Support"
                secondary="Get help from our support team"
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
            Send Feedback
          </Typography>
          <form onSubmit={handleSubmitFeedback}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<FeedbackIcon />}
              disabled={!feedback.trim()}
            >
              Send Feedback
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
} 