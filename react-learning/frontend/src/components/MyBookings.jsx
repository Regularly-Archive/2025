import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Event as EventIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import BookingCard from './BookingCard';

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
    status: 'upcoming', // upcoming, ongoing, completed, cancelled
    description: '讨论新产品功能特性',
  },
  {
    id: 2,
    roomId: 2,
    roomName: '会议室 B',
    title: '团队周会',
    startTime: new Date('2024-03-18T14:00:00'),
    endTime: new Date('2024-03-18T15:00:00'),
    attendees: '整个开发团队',
    status: 'completed',
    description: '回顾本周工作进展',
  },
  {
    id: 3,
    roomId: 2,
    roomName: '会议室 B',
    title: '团队周会',
    startTime: new Date('2024-03-18T14:00:00'),
    endTime: new Date('2024-03-18T15:00:00'),
    attendees: '整个开发团队',
    status: 'upcoming',
    description: '回顾本周工作进展',
  }
  // 更多预约记录...
];

function MyBookings() {
  const [tabValue, setTabValue] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    try {
      // 这里应该调用实际的取消预约 API
      console.log('取消预约：', selectedBooking.id);
      setOpenCancelDialog(false);
      // 刷新预约列表
    } catch (err) {
      console.error('取消预约失败：', err);
    }
  };

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

  const filteredBookings = mockBookings.filter(booking => booking.status === tabValue);

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab value="upcoming" label="即将开始" />
        <Tab value="ongoing" label="进行中" />
        <Tab value="completed" label="已完成" />
        <Tab value="cancelled" label="已取消" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredBookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          </Grid>
        ))}

        {filteredBookings.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <Typography color="text.secondary" textAlign="center">
                暂无预约记录
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>确认取消预约</DialogTitle>
        <DialogContent>
          <Typography>
            您确定要取消"{selectedBooking?.title}"的预约吗？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>
            返回
          </Button>
          <Button
            onClick={confirmCancelBooking}
            color="error"
            variant="contained"
          >
            确认取消
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyBookings; 