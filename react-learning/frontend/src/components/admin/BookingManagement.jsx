import { useState, useEffect } from 'react';
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
  TablePagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { get } from '../../utils/request';

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
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async (pageIndex, pageSize) => {
    try {
      setLoading(true);
      const response = await get(`api/bookings/paginate?pageIndex=${pageIndex + 1}&pageSize=${pageSize}&keyword=${searchTerm}`);
      if (response.data) {
        setBookings(response.data.rows);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error('获取预约记录失败：', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page, rowsPerPage);
  }, [page, rowsPerPage, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      0: { label: '进行中', color: 'success' },
      1: { label: '已取消', color: 'error' },
      2: { label: '已完成', color: 'default' },
    };
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.title}</TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startTime), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.endTime), 'HH:mm', { locale: zhCN })}
                  </TableCell>
                  <TableCell>
                    {
                      booking.participants && booking.participants.length > 0 ? booking.participants.map(x => x.nickName).join(', ') : ''
                    }
                  </TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>
                    {booking.status === 0 && (
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
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} 共 ${count} 条`
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
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