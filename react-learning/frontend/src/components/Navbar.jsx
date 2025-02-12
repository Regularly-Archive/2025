import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          会议室预约系统
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                控制台
              </Button>
              {user.role === 1 && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  管理
                </Button>
              )}
              <Button color="inherit" onClick={logout}>
                退出
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 