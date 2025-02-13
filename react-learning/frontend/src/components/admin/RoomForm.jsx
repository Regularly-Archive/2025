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
  Autocomplete,
  Chip,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';

const facilityOptions = [
  '投影仪',
  '白板',
  '视频会议系统',
  '音响',
  'LED大屏',
  'WiFi',
  '电话会议设备',
  '电视'
];

const roomTypes = [
  {
    value: 0,
    label: '普通会议室'
  },
  {
    value: 1,
    label: '多媒体会议室'
  }
];

function RoomForm({ room, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    type: 0,
    status: 0,
    facilities: [],
    availableStartTime: '',
    availableEndTime: '',
    description: ''
  });

  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        type: room.type,
        status: room.status,
        facilities: room.facilities,
        availableStartTime: room.availableStartTime,
        availableEndTime: room.availableEndTime,
        description: room.description || '',
        createdBy: room.createdBy,
        createdAt: room.createdAt,
        updatedBy: room.updatedBy,
        updatedAt: room.updatedAt
      });
    }
  }, [room]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateTimes = (startTime, endTime) => {
    if (!startTime || !endTime) return true;
    
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    return start < end;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 验证时间
    if (!validateTimes(formData.availableStartTime, formData.availableEndTime)) {
      setTimeError('结束时间必须晚于开始时间');
      return;
    }
    setTimeError('');

    formData.status = parseInt(formData.status);
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {room ? '编辑会议室' : '添加会议室'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="会议室名称"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="capacity"
            label="容纳人数"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <FormControl required>
            <InputLabel>会议室类型</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="会议室类型"
            >
              {roomTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required>
            <InputLabel>状态</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="状态"
            >
              <MenuItem value="0">可用</MenuItem>
              <MenuItem value="1">维护中</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            value={formData.facilities}
            onChange={(event, newValue) => {
              setFormData({ ...formData, facilities: newValue });
            }}
            options={facilityOptions}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="设施"
                placeholder="选择设施"
              />
            )}
          />

          <TimePicker
            label="可用起始时间"
            value={formData.availableStartTime ? new Date(`2024-01-01T${formData.availableStartTime}`) : null}
            onChange={(newValue) => {
              const timeString = newValue ? newValue.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).slice(0, 5) : '';
              setFormData({ ...formData, availableStartTime: timeString });
              setTimeError(''); // 清除错误信息
            }}
            views={['hours', 'minutes']}
            ampm={false}
            sx={{ width: '100%' }}
          />

          <TimePicker
            label="可用结束时间"
            value={formData.availableEndTime ? new Date(`2024-01-01T${formData.availableEndTime}`) : null}
            onChange={(newValue) => {
              const timeString = newValue ? newValue.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).slice(0, 5) : '';
              setFormData({ ...formData, availableEndTime: timeString });
              setTimeError(''); // 清除错误信息
            }}
            views={['hours', 'minutes']}
            ampm={false}
            sx={{ width: '100%' }}
          />

          {timeError && (
            <Typography color="error" variant="caption">
              {timeError}
            </Typography>
          )}

          <TextField
            name="description"
            label="描述"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
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

export default RoomForm; 