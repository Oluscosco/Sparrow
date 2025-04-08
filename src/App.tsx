import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SettingsProvider } from './contexts/SettingsContext';
import Home from './pages/Home';
import Sheets from './pages/Sheets';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';

const CLIENT_ID ="83777510114-8gitui7rus4t9k102cs58rp9cfctp70q.apps.googleusercontent.com";
const globalStyles = {
  html: {
    height: '100%',
  },
  body: {
    height: '100%',
    margin: 0,
    padding: 0,
  },
  '#root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
};

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <SettingsProvider>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sheets" element={<Sheets />} />
            <Route path="/sheets/:sheetId" element={<Sheets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
