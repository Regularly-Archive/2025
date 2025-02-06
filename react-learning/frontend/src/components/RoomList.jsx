import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
} from '@mui/material';
import { 
  MeetingRoom as RoomIcon,
  Group as GroupIcon,
  Event as EventIcon 
} from '@mui/icons-material';
import BookingForm from './BookingForm';

// 模拟会议室数据
const mockRooms = [
  {
    id: 1,
    name: '会议室 A',
    capacity: 10,
    type: '普通会议室',
    status: 'available',
    facilities: ['投影仪', '白板'],
  },
  {
    id: 2,
    name: '会议室 B',
    capacity: 20,
    type: '多媒体会议室',
    status: 'occupied',
    facilities: ['视频会议系统', '投影仪', '音响'],
  },
  // 更多会议室...
];

function RoomList() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  const handleBooking = (room) => {
    setSelectedRoom(room);
    setOpenBooking(true);
  };

  const getStatusColor = (status) => {
    return status === 'available' ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    return status === 'available' ? '空闲' : '占用';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {mockRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {room.name}
                  </Typography>
                  <Chip
                    label={getStatusText(room.status)}
                    color={getStatusColor(room.status)}
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  容纳人数：{room.capacity}人
                </Typography>
                
                <Typography color="text.secondary" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  类型：{room.type}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {room.facilities.map((facility) => (
                    <Chip
                      key={facility}
                      label={facility}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={room.status !== 'available'}
                  onClick={() => handleBooking(room)}
                >
                  预约
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        maxWidth="sm"
        fullWidth
      >
        <BookingForm
          room={selectedRoom}
          onClose={() => setOpenBooking(false)}
        />
      </Dialog>
    </Box>
  );
}

export default RoomList; 