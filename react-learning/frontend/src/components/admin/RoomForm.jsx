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
} from '@mui/material';

const facilityOptions = [
  '投影仪',
  '白板',
  '视频会议系统',
  '音响',
  'LED大屏',
  'WiFi',
  '电话会议设备',
];

const roomTypes = [
  '普通会议室',
  '多媒体会议室',
  '培训室',
  '董事会议室',
];

function RoomForm({ room, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    type: '',
    status: 'available',
    facilities: [],
    availableTime: '',
    description: '',
  });

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        type: room.type,
        status: room.status,
        facilities: room.facilities,
        availableTime: room.availableTime,
        description: room.description || '',
      });
    }
  }, [room]);

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
              {roomTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
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
              <MenuItem value="available">可用</MenuItem>
              <MenuItem value="maintenance">维护中</MenuItem>
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

          <TextField
            name="availableTime"
            label="可用时间"
            value={formData.availableTime}
            onChange={handleChange}
            required
            placeholder="例如：09:00-18:00"
          />

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