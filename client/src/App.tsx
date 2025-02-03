import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages will be imported here
// import TicketForm from './pages/TicketForm';
// import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Routes will be added here */}
          {/* <Route path="/" element={<TicketForm />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
