import Navigation from '../components/Navigation';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f2e8cf'
    }}>
      <Navigation />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
