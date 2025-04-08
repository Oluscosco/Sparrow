import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface Settings {
  theme: 'light' | 'dark';
  compactMode: boolean;
  animations: boolean;
  autoSave: boolean;
  offlineMode: boolean;
  keyboardShortcuts: boolean;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  theme: Theme;
}

const defaultSettings: Settings = {
  theme: 'light',
  compactMode: false,
  animations: true,
  autoSave: true,
  offlineMode: false,
  keyboardShortcuts: true,
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const theme = createTheme({
    palette: {
      mode: settings.theme,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      background: {
        default: settings.theme === 'light' ? '#f5f5f5' : '#121212',
        paper: settings.theme === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: settings.theme === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: settings.theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
      divider: settings.theme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          //@ts-ignore
          root: {
            backgroundImage: 'none',
            borderRadius: settings.compactMode ? 4 : 8,
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: settings.compactMode ? 4 : 8,
            padding: settings.compactMode ? '6px 12px' : '8px 16px',
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: (theme: Theme) => `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          //@ts-ignore
          root: {
            borderRadius: settings.compactMode ? 4 : 8,
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: (theme: Theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          //@ts-ignore
          root: {
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderBottom: (theme: Theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          //@ts-ignore
          paper: {
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          //@ts-ignore
          paper: {
            background: (theme:Theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          //@ts-ignore
          root: {
            background: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
            border: (theme: Theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        },
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: settings.compactMode ? 4 : 8,
    },
  });

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, theme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 