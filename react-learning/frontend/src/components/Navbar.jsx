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
          XXX会议室预约系统
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user ? (
            <>
              <Typography
                variant="body1"
                color="inherit"
                sx={{ fontSize: '0.875rem' }}
              >
                😊 你好，{user.nickName}！
              </Typography>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                控制台
              </Button>
              {user.role === 1 && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  系统管理
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