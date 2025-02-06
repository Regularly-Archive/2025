import { Box, Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Admin from '../pages/Admin';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route 
            path="/admin/*" 
            element={
              user?.role === 'admin' ? <Admin /> : <Navigate to="/dashboard" />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default Layout; 