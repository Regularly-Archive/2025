import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import {
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 模拟预约数据
const mockBookings = [
  {
    id: 1,
    roomId: 1,
    roomName: '会议室 A',
    title: '产品评审会议',
    startTime: new Date('2024-03-20T10:00:00'),
    endTime: new Date('2024-03-20T11:30:00'),
    attendees: '张三, 李四, 王五',
    status: 'upcoming',
    description: '讨论新产品功能特性',
  },
  {
    id: 2,
    roomId: 2,
    roomName: '会议室 B',
    title: '团队周会',
    startTime: new Date('2024-03-20T14:00:00'),
    endTime: new Date('2024-03-20T15:00:00'),
    attendees: '整个开发团队',
    status: 'upcoming',
    description: '回顾本周工作进展',
  },
  // 更多预约记录...
];

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const getDayBookings = (date) => {
    return mockBookings.filter(booking => isSameDay(booking.startTime, date));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      upcoming: 'primary',
      ongoing: 'success',
      completed: 'default',
      cancelled: 'error',
    };
    return statusColors[status];
  };

  const selectedDayBookings = getDayBookings(selectedDate);

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Paper sx={{ p: 2, flex: '0 0 auto' }}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          locale={zhCN}
          // 高亮有会议的日期
          renderDay={(day, _value, DayComponentProps) => {
            const hasBookings = getDayBookings(day).length > 0;
            return (
              <Box
                sx={{
                  position: 'relative',
                  '&::after': hasBookings ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                  } : undefined,
                }}
              >
                {DayComponentProps.children}
              </Box>
            );
          }}
        />
      </Paper>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })}的预约
        </Typography>

        <Stack spacing={2}>
          {selectedDayBookings.map((booking) => (
            <Paper
              key={booking.id}
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => setSelectedBooking(booking)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {booking.title}
                </Typography>
                <Chip
                  size="small"
                  label={format(booking.startTime, 'HH:mm') + ' - ' + format(booking.endTime, 'HH:mm')}
                  color={getStatusColor(booking.status)}
                />
              </Box>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                <RoomIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                {booking.roomName}
              </Typography>
            </Paper>
          ))}

          {selectedDayBookings.length === 0 && (
            <Typography color="text.secondary" textAlign="center">
              当天暂无预约
            </Typography>
          )}
        </Stack>
      </Box>

      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedBooking?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedBooking?.roomName}
            </Typography>
            
            <Typography>
              <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedBooking && format(selectedBooking.startTime, 'HH:mm')} - 
              {selectedBooking && format(selectedBooking.endTime, 'HH:mm')}
            </Typography>

            <Typography>
              <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedBooking?.attendees}
            </Typography>

            {selectedBooking?.description && (
              <Typography sx={{ mt: 2 }}>
                {selectedBooking.description}
              </Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Calendar; 