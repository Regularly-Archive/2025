import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// 模拟预约数据
const mockBookings = [
  {
    id: 1,
    roomName: '会议室 A',
    title: '产品评审会议',
    startTime: new Date('2024-03-20T10:00:00'),
    endTime: new Date('2024-03-20T11:30:00'),
    userName: '张三',
    status: 'upcoming',
    attendees: '张三, 李四, 王五',
  },
  {
    id: 2,
    roomName: '会议室 B',
    title: '团队周会',
    startTime: new Date('2024-03-18T14:00:00'),
    endTime: new Date('2024-03-18T15:00:00'),
    userName: '李四',
    status: 'completed',
    attendees: '整个开发团队',
  },
];

function BookingManagement() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setOpenDelete(true);
  };

  const handleConfirmCancel = () => {
    setBookings(bookings.map(booking =>
      booking.id === selectedBooking.id
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
    setOpenDelete(false);
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

  const filteredBookings = bookings.filter(booking =>
    booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="搜索预约记录..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>会议主题</TableCell>
              <TableCell>会议室</TableCell>
              <TableCell>预约人</TableCell>
              <TableCell>开始时间</TableCell>
              <TableCell>结束时间</TableCell>
              <TableCell>参会人员</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.title}</TableCell>
                <TableCell>{booking.roomName}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>
                  {format(booking.startTime, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell>
                  {format(booking.endTime, 'HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell>{booking.attendees}</TableCell>
                <TableCell>{getStatusChip(booking.status)}</TableCell>
                <TableCell>
                  {booking.status === 'upcoming' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleCancel(booking)}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmDialog
        open={openDelete}
        title="取消预约"
        content={`确定要取消"${selectedBooking?.title}"的预约吗？`}
        onConfirm={handleConfirmCancel}
        onCancel={() => setOpenDelete(false)}
      />
    </Box>
  );
}

export default BookingManagement; 