// src/app/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/store';
import './globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E40AF', // Blue from design
      dark: '#1E3A8A',
      light: '#3B82F6',
    },
    secondary: {
      main: '#64748B', // Gray from design
      dark: '#475569',
      light: '#94A3B8',
    },
    success: {
      main: '#10B981', // Green
      light: '#D1FAE5',
    },
    error: {
      main: '#EF4444', // Red
      light: '#FEE2E2',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222222',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Proxima Nova", "Red Hat Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 700,
      color: '#222222',
    },
    h2: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 700,
      color: '#0F172A',
    },
    h3: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 700,
      color: '#0F172A',
    },
    h4: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 700,
      color: '#0F172A',
    },
    h5: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 700,
      color: '#0F172A',
    },
    h6: {
      fontFamily: '"Red Hat Display", sans-serif',
      fontWeight: 600,
      color: '#0F172A',
    },
    body1: {
      color: '#475569',
    },
    body2: {
      color: '#64748B',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1E40AF',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748B',
            '&.Mui-focused': {
              color: '#1E40AF',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '12px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F1F5F9',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F8FAFC',
          color: '#475569',
          fontWeight: 600,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '15px',
          color: '#64748B',
          minHeight: 48,
          '&.Mui-selected': {
            color: '#1E40AF',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#1E40AF',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}