import { useState, useEffect } from 'react';
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
  TablePagination
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
import { get, put } from '../utils/request'; 
import BookingForm from './BookingForm';


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pageIndex, setPageIndex] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [totalCount, setTotalCount] = useState(0); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState('whole');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [tabValue, pageIndex, pageSize]);

  const fetchBookings = async () => {
    try {
      const statusMap = {
        whole: -1,
        pending: 0,
        completed: 2,
        cancelled: 1,
      };
      const response = await get(`api/bookings/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}&status=${statusMap[tabValue]}`);
      setBookings(response.data.rows);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('获取预约记录失败：', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    try {

      await put(`api/Bookings/${selectedBooking.id}/cancel`);
      setOpenCancelDialog(false);
      await fetchBookings();
    } catch (err) {
      console.error('取消预约失败：', err);
    }
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenEditDialog(true);
  };

  const handleCompleteBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenCompleteDialog(true);
  };

  const confirmCompleteBooking = async () => {
    try {
      await put(`api/bookings/${selectedBooking.id}/complete`);
      setOpenCompleteDialog(false);
      await fetchBookings();
    } catch (err) {
      console.error('完成预约失败：', err);
    }
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab value="whole" label="全部" />
        <Tab value="pending" label="进行中" />
        <Tab value="completed" label="已完成" />
        <Tab value="cancelled" label="已取消" />
      </Tabs>

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              onEdit={handleEditBooking}
              onComplete={handleCompleteBooking}
            />
          </Grid>
        ))}

        {bookings.length === 0 && (
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="每页行数"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} 共 ${count} 条`
        }
      />

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

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <BookingForm
          room={selectedBooking?.room}
          bookingData={selectedBooking}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={async () => {
            setOpenEditDialog(false)
            await fetchBookings()
          }}
        />
      </Dialog>

      <Dialog
        open={openCompleteDialog}
        onClose={() => setOpenCompleteDialog(false)}
      >
        <DialogTitle>确认完成预约</DialogTitle>
        <DialogContent>
          <Typography>
            您确定要完成此预约吗？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompleteDialog(false)}>
            取消
          </Button>
          <Button
            onClick={confirmCompleteBooking}
            color="success"
            variant="contained"
          >
            确认完成
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyBookings; 