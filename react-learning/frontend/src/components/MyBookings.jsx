import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
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

      <Stack spacing={2}>
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
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

              {booking.status === 'upcoming' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(booking)}
                  >
                    取消预约
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <Typography color="text.secondary" textAlign="center">
            暂无预约记录
          </Typography>
        )}
      </Stack>

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