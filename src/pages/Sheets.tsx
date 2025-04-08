import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  alpha,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  ListItemButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { createNewSheet, getSheetDetails, updateSheetTitle, deleteSheet } from '../utils/sheetsApi';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';

interface SheetDetails {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
  modifiedTime?: string;
  sheets?: Array<{
    properties: {
      title: string;
      sheetId: number;
      index: number;
    };
  }>;
  sharing?: {
    isPublic: boolean;
    allowComments: boolean;
    allowEdit: boolean;
  };
  owner?: {
    displayName: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sheet-tabpanel-${index}`}
      aria-labelledby={`sheet-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Sheets() {
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetDetails, setSheetDetails] = useState<SheetDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openExportSubmenu, setOpenExportSubmenu] = useState(false);
  const [openSettingsSubmenu, setOpenSettingsSubmenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('viewer');
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);
  const [sharingSettings, setSharingSettings] = useState({
    isPublic: false,
    allowComments: false,
    allowEdit: false,
  });

  useEffect(() => {
    if (sheetId) {
      fetchSheetDetails();
    }
  }, [sheetId]);

  const fetchSheetDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const details = await getSheetDetails(accessToken, sheetId!);
      setSheetDetails(details);
      setTitle(details.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sheet details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your sheet');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      if (sheetId) {
        await updateSheetTitle(accessToken, sheetId, title);
        setSheetDetails(prev => prev ? { ...prev, name: title } : null);
        setIsEditing(false);
      } else {
        await createNewSheet(accessToken, title);
        navigate('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sheet');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 

  const handleExportSubmenuClick = () => {
    setOpenExportSubmenu(!openExportSubmenu);
  };

  const handleSettingsSubmenuClick = () => {
    setOpenSettingsSubmenu(!openSettingsSubmenu);
  };

  const handleShare = () => {
    handleMenuClose();
    setTabValue(2); // Switch to Sharing tab
  };

  const handlePrint = () => {
    handleMenuClose();
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.focus();
        iframeWindow.print();
      }
    }
  };

  const handleExport = (format: string) => {
    handleMenuClose();
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        // Get the current sheet URL
        const currentUrl = iframe.src;
        // Modify the URL to include the export format
        const exportUrl = currentUrl.replace('embedded=true', `export=download&format=${format}`);
        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = exportUrl;
        link.download = `${sheetDetails?.name || 'sheet'}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleMakeCopy = async () => {
    handleMenuClose();
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }
      // Create a copy with "(Copy)" suffix
      const newTitle = `${sheetDetails?.name} (Copy)`;
      await createNewSheet(accessToken, newTitle);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create copy');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionHistory = () => {
    handleMenuClose();
    window.open(`${sheetDetails?.webViewLink}&action=viewrevisionhistory`, '_blank');
  };

  const handleDelete = async () => {
    handleMenuClose();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }
      await deleteSheet(accessToken, sheetId!);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sheet');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleHelp = () => {
    handleMenuClose();
    navigate('/help');
  };

  const handleAbout = () => {
    handleMenuClose();
    navigate('/about');
  };

  const handleShareWithEmail = async () => {
    if (!emailInput) return;
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      // Call the API to share the sheet
      const response = await fetch(`http://localhost:3000/sheets/${sheetId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: emailInput,
          role: roleInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share sheet');
      }

      // Update the sheet details with the new sharing information
      const updatedSheet = await response.json();
      setSheetDetails(updatedSheet);
      setEmailInput('');
    } catch (error) {
      console.error('Error sharing sheet:', error);
    }
  };

  const handlePermissionChange = async (permission: 'isPublic' | 'allowComments' | 'allowEdit', value: boolean) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      // Call the API to update permissions
      const response = await fetch(`http://localhost:3000/sheets/${sheetId}/permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          [permission]: value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      // Update the sheet details with the new permissions
      const updatedSheet = await response.json();
      setSheetDetails(updatedSheet);
      setSharingSettings(prev => ({ ...prev, [permission]: value }));
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {sheetId ? (
        <>
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              background: (theme) => alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Toolbar>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/home')}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  <DescriptionIcon />
                </Avatar>
                {isEditing ? (
                  <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '1.1rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                ) : (
                  <Typography variant="h6" noWrap>
                    {sheetDetails?.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Save changes">
                  <IconButton
                    onClick={handleCreateSheet}
                    disabled={loading || !isEditing}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit title">
                  <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: (theme) => alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                mt: 1,
                minWidth: 240,
              },
            }}
          >
            <MenuItem onClick={handleShare}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>

            <ListItemButton onClick={handleExportSubmenuClick}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Export" />
              {openExportSubmenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openExportSubmenu} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 4 }}>
                <MenuItem onClick={() => handleExport('pdf')}>
                  <ListItemIcon>
                    <PictureAsPdfIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Download as PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('xlsx')}>
                  <ListItemIcon>
                    <TableChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Download as Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv')}>
                  <ListItemIcon>
                    <TableChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Download as CSV</ListItemText>
                </MenuItem>
              </Box>
            </Collapse>

            <MenuItem onClick={handlePrint}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Print</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleMakeCopy}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Make a Copy</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleVersionHistory}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Version History</ListItemText>
            </MenuItem>

            <Divider />

            <ListItemButton onClick={handleSettingsSubmenuClick}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {openSettingsSubmenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSettingsSubmenu} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 4 }}>
                <MenuItem onClick={handleSettings}>
                  <ListItemText primary="General Settings" />
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemText primary="Notifications" />
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemText primary="Appearance" />
                </MenuItem>
              </Box>
            </Collapse>

            <Divider />

            <MenuItem onClick={handleHelp}>
              <ListItemIcon>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Help & Support</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <FeedbackIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send Feedback</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleAbout}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>About</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem 
              onClick={handleDelete}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Sheet</ListItemText>
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            PaperProps={{
              sx: {
                background: (theme) => alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
              },
            }}
          >
            <DialogTitle>Delete Sheet</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this sheet? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                color="error"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  background: (theme) => alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Tab label="Overview" />
                <Tab label="Editor" />
                <Tab label="Sharing" />
              </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Sheet Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Basic Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Title
                          </Typography>
                          <Typography variant="body1">
                            {sheetDetails?.name}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Created
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(sheetDetails?.createdTime)}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Last Modified
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(sheetDetails?.modifiedTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Document Statistics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Number of Sheets
                          </Typography>
                          <Chip
                            label={sheetDetails?.sheets?.length || 0}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Cells
                          </Typography>
                          <Typography variant="body1">

                            {
                            //@ts-ignore
                            sheetDetails?.sheets?.reduce((acc, sheet) => acc + (sheet.properties.gridProperties?.rowCount || 0) * (sheet.properties.gridProperties?.columnCount || 0), 0) || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe) {
                              const iframeWindow = iframe.contentWindow;
                              if (iframeWindow) {
                                const currentUrl = iframe.src;
                                const exportUrl = currentUrl.replace('embedded=true', 'export=download&format=xlsx');
                                const link = document.createElement('a');
                                link.href = exportUrl;
                                link.download = `${sheetDetails?.name || 'sheet'}.xlsx`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe) {
                              const iframeWindow = iframe.contentWindow;
                              if (iframeWindow) {
                                iframeWindow.focus();
                                iframeWindow.print();
                              }
                            }
                          }}
                        >
                          Print
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box
                  sx={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    borderRadius: 0,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '40px',
                      background: (theme) => alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2,
                      borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      zIndex: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label="Google Sheets"
                        icon={<DescriptionIcon />}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      marginTop: '40px',
                      height: 'calc(100% - 40px)',
                    }}
                  >
                    <iframe
                      src={`${sheetDetails?.webViewLink}?embedded=true`}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      title="Google Sheet Editor"
                      allowFullScreen
                    />
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Sharing Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Share with People
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          placeholder="Add people or groups"
                          variant="outlined"
                          size="small"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={handleShareWithEmail}
                                disabled={!emailInput}
                              >
                                Share
                              </Button>
                            ),
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(sheetDetails?.webViewLink || '');
                            }}
                          >
                            Copy Link
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowAdvancedDialog(true)}
                          >
                            Advanced
                          </Button>
                        </Box>
                      </Box>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Advanced Settings
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            Allow anyone with the link to view
                          </Typography>
                          <Switch
                            checked={sharingSettings.isPublic}
                            onChange={(e) => handlePermissionChange('isPublic', e.target.checked)}
                            size="small"
                          />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            Allow anyone with the link to comment
                          </Typography>
                          <Switch
                            checked={sharingSettings.allowComments}
                            onChange={(e) => handlePermissionChange('allowComments', e.target.checked)}
                            size="small"
                          />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            Allow anyone with the link to edit
                          </Typography>
                          <Switch
                            checked={sharingSettings.allowEdit}
                            onChange={(e) => handlePermissionChange('allowEdit', e.target.checked)}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        People with Access
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {
                        //@ts-ignore
                        sheetDetails?.sharing?.sharedWith?.map((user, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={user.photoUrl}
                                sx={{ width: 32, height: 32 }}
                              >
                                {user.displayName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{user.displayName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={user.role}
                                size="small"
                                color={
                                  user.role === 'Owner' ? 'primary' :
                                  user.role === 'Editor' ? 'success' :
                                  user.role === 'Commenter' ? 'info' : 'default'
                                }
                              />
                              <IconButton
                                size="small"
                                onClick={async () => {
                                  try {
                                    const accessToken = localStorage.getItem('access_token');
                                    if (!accessToken) {
                                      navigate('/login');
                                      return;
                                    }

                                    const response = await fetch(`http://localhost:3000/sheets/${sheetId}/remove-access`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${accessToken}`,
                                      },
                                      body: JSON.stringify({ email: user.email }),
                                    });

                                    if (!response.ok) {
                                      throw new Error('Failed to remove access');
                                    }

                                    const updatedSheet = await response.json();
                                    setSheetDetails(updatedSheet);
                                  } catch (error) {
                                    console.error('Error removing access:', error);
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                {/* Advanced Settings Dialog */}
                <Dialog
                  open={showAdvancedDialog}
                  onClose={() => setShowAdvancedDialog(false)}
                  PaperProps={{
                    sx: {
                      background: (theme) => alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                >
                  <DialogTitle>Advanced Sharing Settings</DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                      <TextField
                        label="Email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={roleInput}
                          onChange={(e) => setRoleInput(e.target.value)}
                          label="Role"
                        >
                          <MenuItem value="viewer">Viewer</MenuItem>
                          <MenuItem value="commenter">Commenter</MenuItem>
                          <MenuItem value="editor">Editor</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setShowAdvancedDialog(false)}>Cancel</Button>
                    <Button
                      onClick={() => {
                        handleShareWithEmail();
                        setShowAdvancedDialog(false);
                      }}
                      variant="contained"
                      disabled={!emailInput}
                    >
                      Share
                    </Button>
                  </DialogActions>
                </Dialog>
              </TabPanel>
            </Box>
          </Box>

          <Box
            sx={{
              height: '24px',
              background: (theme) => alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption">
                {sheetDetails?.name}
              </Typography>
              <Typography variant="caption">
                Last modified: {formatDate(sheetDetails?.modifiedTime)}
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            p: 4,
            background: (theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              maxWidth: 500,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              background: (theme) => alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  mb: 2,
                  mx: 'auto',
                }}
              >
                <DescriptionIcon sx={{ fontSize: 32 }} />
              </Avatar>
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
                Create New Sheet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Enter a title for your new Google Sheet
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Sheet Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleCreateSheet}
              disabled={loading || !title.trim()}
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                boxShadow: (theme) => `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Sheet'
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/home')}
              sx={{ mt: 1 }}
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
} 