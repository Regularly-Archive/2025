import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    department: '',
    role: 'user',
    password: '', // 仅用于新用户
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {user ? '编辑用户' : '添加用户'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            name="username"
            label="用户名"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={!!user}
          />
          
          <TextField
            name="name"
            label="姓名"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="email"
            label="邮箱"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            name="department"
            label="部门"
            value={formData.department}
            onChange={handleChange}
            required
          />

          {!user && (
            <TextField
              name="password"
              label="密码"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}

          <FormControl required>
            <InputLabel>角色</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="角色"
            >
              <MenuItem value="user">普通用户</MenuItem>
              <MenuItem value="admin">管理员</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button type="submit" variant="contained">
          保存
        </Button>
      </DialogActions>
    </form>
  );
}

export default UserForm; 