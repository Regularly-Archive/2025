import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const getStatusChip = (status) => {
  const statusConfig = {
    upcoming: { label: '即将开始', color: 'primary' },
    ongoing: { label: '进行中', color: 'success' },
    completed: { label: '已完成', color: 'default' },
    cancelled: { label: '已取消', color: 'error' },
  };
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" />;
};

function BookingCard({ booking, onCancel }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {booking.title}
          </Typography>
          {getStatusChip(booking.status)}
        </Box>

        <Stack spacing={1}>
          <Typography color="text.secondary">
            <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {booking.roomName}
          </Typography>

          <Typography color="text.secondary">
            <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {format(booking.startTime, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })} - 
            {format(booking.endTime, 'HH:mm', { locale: zhCN })}
          </Typography>

          <Typography color="text.secondary">
            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {booking.attendees}
          </Typography>

          {booking.description && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {booking.description}
            </Typography>
          )}
        </Stack>

        {booking.status === 'upcoming' && onCancel && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onCancel(booking)}
            >
              取消预约
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingCard; 