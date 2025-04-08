import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ViewCompact as CompactModeIcon,
  Animation as AnimationIcon,
  Save as SaveIcon,
  WifiOff as OfflineModeIcon,
  Keyboard as KeyboardIcon,
  Notifications as NotificationsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleThemeChange = () => {
    updateSettings({
      theme: settings.theme === 'light' ? 'dark' : 'light',
    });
    setSnackbar({
      open: true,
      message: `Switched to ${settings.theme === 'light' ? 'dark' : 'light'} mode`,
      severity: 'success',
    });
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    setSnackbar({
      open: true,
      message: 'Settings updated successfully',
      severity: 'success',
    });
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
    setSnackbar({
      open: true,
      message: 'Notification settings updated',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: (theme) => theme.palette.background.paper,
          borderRadius: settings.compactMode ? 4 : 8,
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              {settings.theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary="Theme"
              secondary={settings.theme === 'light' ? 'Light mode' : 'Dark mode'}
            />
            <Switch
              checked={settings.theme === 'dark'}
              onChange={handleThemeChange}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <CompactModeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Compact Mode"
              secondary="Use a more compact layout"
            />
            <Switch
              checked={settings.compactMode}
              onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <AnimationIcon />
            </ListItemIcon>
            <ListItemText
              primary="Animations"
              secondary="Enable smooth transitions and effects"
            />
            <Switch
              checked={settings.animations}
              onChange={(e) => handleSettingChange('animations', e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText
              primary="Auto-save"
              secondary="Automatically save changes"
            />
            <Switch
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <OfflineModeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Offline Mode"
              secondary="Enable offline access"
            />
            <Switch
              checked={settings.offlineMode}
              onChange={(e) => handleSettingChange('offlineMode', e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <KeyboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Keyboard Shortcuts"
              secondary="Enable keyboard shortcuts"
            />
            <Switch
              checked={settings.keyboardShortcuts}
              onChange={(e) => handleSettingChange('keyboardShortcuts', e.target.checked)}
            />
          </ListItem>

          <Divider />

          <ListItem 
            onClick={() => setOpenNotifications(!openNotifications)}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              secondary="Manage notification settings"
            />
            {openNotifications ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openNotifications} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="Enable Notifications" />
                <Switch
                  checked={settings.notifications.enabled}
                  onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
                />
              </ListItem>
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="Sound" />
                <Switch
                  checked={settings.notifications.sound}
                  onChange={(e) => handleNotificationChange('sound', e.target.checked)}
                />
              </ListItem>
              <ListItem sx={{ pl: 4 }}>
                <ListItemText primary="Desktop Notifications" />
                <Switch
                  checked={settings.notifications.desktop}
                  onChange={(e) => handleNotificationChange('desktop', e.target.checked)}
                />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}