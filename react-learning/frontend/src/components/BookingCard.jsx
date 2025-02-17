import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
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
          <Tooltip title={booking.title} arrow>
            <Typography variant="h6" noWrap>
              {booking.title}
            </Typography>
          </Tooltip>
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
            <Tooltip title={
              booking.participants && booking.participants.length > 0 
                ? booking.participants.map(x => x.nickName).join(', ') 
                : ''
            } arrow>
              <span>
                <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {
                  booking.participants && booking.participants.length > 0 
                    ? booking.participants.map(x => x.nickName).join(', ') 
                    : ''
                }
              </span>
            </Tooltip>
          </Typography>

          {booking.description && (
            <Typography color="text.secondary" noWrap>
              <Tooltip title={booking.description} arrow>
                <span>
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {booking.description}
                </span>
              </Tooltip>
            </Typography>
          )}
        </Stack>

        <Box sx={{ mt: 2, display: booking.status === 0 && onCancel && onEdit ? 'flex' : 'none', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(booking)}
            startIcon={<EditIcon />}
          >
            编辑
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onCancel(booking)}
            startIcon={<CancelIcon />}
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