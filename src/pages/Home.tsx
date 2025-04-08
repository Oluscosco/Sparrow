import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Container,
  Paper,
  Tooltip,
  Fade,
  Chip,
  Avatar,
  Divider,
  alpha,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import { getSheetsList, deleteSheet } from '../utils/sheetsApi';
import { useSettings } from '../contexts/SettingsContext';

interface Sheet {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
  modifiedTime?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState<Sheet | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }
      const sheetsList = await getSheetsList(accessToken);
      setSheets(sheetsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/sheets');
  };

  const handleDeleteClick = (sheet: Sheet) => {
    setSheetToDelete(sheet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sheetToDelete) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      await deleteSheet(accessToken, sheetToDelete.id);
      setSheets(sheets.filter(sheet => sheet.id !== sheetToDelete.id));
      setSnackbar({
        open: true,
        message: 'Sheet deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to delete sheet',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSheetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSheetToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: (theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading your sheets...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: (theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchSheets}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4,
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderRadius: settings.compactMode ? 4 : 8,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Google Sheets
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            size="large"
            sx={{
              borderRadius: settings.compactMode ? 4 : 8,
              padding: settings.compactMode ? '6px 12px' : '8px 16px',
              boxShadow: (theme) => `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                transform: settings.animations ? 'translateY(-2px)' : 'none',
                boxShadow: (theme) => `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              transition: settings.animations ? 'all 0.3s ease' : 'none',
            }}
          >
            Create New Sheet
          </Button>
        </Box>

        {sheets.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sheets found
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ mt: 2 }}
            >
              Create Your First Sheet
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {sheets.map((sheet) => (
              <Grid
              //@ts-ignore
                item={true}
                xs={12}
                sm={6}
                md={4}
                key={sheet.id}
                component="div"
              >
                <Fade in={settings.animations} timeout={500}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      background: (theme) => alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                      borderRadius: settings.compactMode ? 4 : 8,
                      transition: settings.animations ? 'transform 0.2s, box-shadow 0.2s' : 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: settings.animations ? 'translateY(-4px)' : 'none',
                        boxShadow: (theme) => theme.shadows[4],
                      },
                    }}
                    onClick={() => navigate(`/sheets/${sheet.id}`)}
                  >
                    <CardContent 
                      sx={{ 
                        flexGrow: 1,
                        transition: settings.animations ? 'all 0.3s ease' : 'none',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            mr: 2,
                            width: settings.compactMode ? 32 : 40,
                            height: settings.compactMode ? 32 : 40,
                          }}
                        >
                          <DescriptionIcon />
                        </Avatar>
                        <Typography 
                          variant={settings.compactMode ? "h6" : "h5"}
                          component="div" 
                          noWrap
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {sheet.name}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          size={settings.compactMode ? "small" : "medium"}
                          label={`Created: ${formatDate(sheet.createdTime)}`}
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          size={settings.compactMode ? "small" : "medium"}
                          label={`Modified: ${formatDate(sheet.modifiedTime)}`}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button
                        size={settings.compactMode ? "small" : "medium"}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(sheet.webViewLink, '_blank');
                        }}
                      >
                        Open
                      </Button>
                      <Tooltip title="Delete sheet">
                        <IconButton
                          size={settings.compactMode ? "small" : "medium"}
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(sheet);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { 
            borderRadius: settings.compactMode ? 4 : 8,
            background: (theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle>Delete Sheet</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{sheetToDelete?.name}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            sx={{
              '&:hover': {
                transform: settings.animations ? 'scale(1.05)' : 'none',
              },
              transition: settings.animations ? 'all 0.2s ease' : 'none',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: settings.compactMode ? 4 : 8,
            background: (theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 