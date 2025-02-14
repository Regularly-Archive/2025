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
    0: { label: '进行中', color: 'success' },
    1: { label: '已取消', color: 'error' },
    2: { label: '已完成', color: 'default' },
  };
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" />;
};

function BookingCard({ booking, onCancel, onEdit }) {
  return (
    <Card sx={{ minHeight: '200px' }}>
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
            {format(new Date(booking.startTime), 'yyyy/MM/dd HH:mm', { locale: zhCN })} - {format(new Date(booking.endTime), 'HH:mm', { locale: zhCN })}
          </Typography>

          <Typography color="text.secondary">
            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {
              booking.participants && booking.participants.length > 0 ? booking.participants.map(x => x.nickName).join(', ') : ''
            }
          </Typography>

          {booking.description && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {booking.description}
            </Typography>
          )}
        </Stack>

        <Box sx={{ mt: 2, display: booking.status === 0 && onCancel && onEdit ? 'flex' : 'none', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(booking)}
          >
            修改
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onCancel(booking)}
          >
            取消
          </Button>
        </Box>
        {!(booking.status === 0 && onCancel && onEdit) && <Box sx={{ height: '48px' }} />}
      </CardContent>
    </Card>
  );
}

export default BookingCard; 