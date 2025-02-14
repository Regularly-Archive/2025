import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';
import { post, put, get } from '../utils/request';
import UserSelector from './UserSelector'; 

function BookingForm({ room, bookingData, onClose, onConfirm}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: bookingData ? bookingData.id : '',
    startTime: new Date(bookingData?.startTime) || null,
    endTime: new Date(bookingData?.endTime) || null,
    title: bookingData?.title || '',
    participants: bookingData?.participants || [],
    description: bookingData?.description || '',
    roomId: bookingData ? bookingData.roomId : room.id,
    userId: bookingData ? bookingData.userId : user.id
  });
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await get('api/rooms/list?status=0');
        setRooms(response.data);
      } catch (err) {
        console.error('获取会议室列表失败：', err);
        setError('获取会议室列表失败，请重试');
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startTime || !formData.endTime) {
      setError('请选择会议时间');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('结束时间必须大于开始时间');
      return;
    }

    try {
      if (bookingData) {
        await put(`api/bookings/`, {
          ...formData,
        });
      } else {
        await post('api/bookings/', {
          roomId: room.id,
          userId: user.id,
          ...formData,
        });
      }
      if (onConfirm) onConfirm()
    } catch (err) {
      console.log(err)
      setError('预约失败，请重试');
    }
  };

  const handleParticipantsChange = (selectedUsers) => {
    const participants = selectedUsers.map(x => {
      return {
        id: x.id,
        nickName: x.nickName
      }
    })

    const newFormData = {
      ...formData,
    }
    newFormData.participants = participants
    setFormData(newFormData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {bookingData ? '修改预约' : `预约 - ${room?.name}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <FormControl fullWidth>
            <InputLabel>会议室</InputLabel>
            <Select
              label="会议室"
              value={formData.roomId || ''}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              disabled={!!room}
              fullWidth
              sx={{ mb: 2 }}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="会议主题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <DateTimePicker
            label="开始时间"
            value={new Date(formData.startTime)}
            onChange={(newValue) => {
              setFormData({ ...formData, startTime: newValue.toISOString() })
            }}
            sx={{ mb: 2, width: '100%' }}
            ampm={false}
            format="yyyy/MM/dd HH:mm"
            timezone="UTC"
          />

          <DateTimePicker
            label="结束时间"
            value={new Date(formData.endTime)}
            onChange={(newValue) => {
              setFormData({ ...formData, endTime: newValue.toISOString() })
            }}
            sx={{ mb: 2, width: '100%' }}
            ampm={false}
            format="yyyy/MM/dd HH:mm"
            timezone="UTC"
          />

          <div style={{ marginBottom: '16px' }}>
            <UserSelector placeholder="参会人员" onConfirm={handleParticipantsChange} initialUsers={formData.participants || []} />
          </div>
          

          <TextField
            fullWidth
            label="会议描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button type="submit" variant="contained">提交</Button>
      </DialogActions>
    </form>
  );
}

export default BookingForm; 