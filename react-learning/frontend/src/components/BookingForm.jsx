import { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';

function BookingForm({ room, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startTime: null,
    endTime: null,
    title: '',
    attendees: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startTime || !formData.endTime) {
      setError('请选择会议时间');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('结束时间必须晚于开始时间');
      return;
    }

    try {
      // 这里应该调用实际的预约 API
      console.log('预约信息：', {
        roomId: room.id,
        userId: user.id,
        ...formData,
      });
      
      onClose();
    } catch (err) {
      setError('预约失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        预约 {room?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <DateTimePicker
            label="开始时间"
            value={formData.startTime}
            onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
            sx={{ mb: 2, width: '100%' }}
          />
          
          <DateTimePicker
            label="结束时间"
            value={formData.endTime}
            onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
            sx={{ mb: 2, width: '100%' }}
          />

          <TextField
            fullWidth
            label="会议主题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="参会人员"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            helperText="多个参会人请用逗号分隔"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="会议描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button type="submit" variant="contained">
          确认预约
        </Button>
      </DialogActions>
    </form>
  );
}

export default BookingForm; 