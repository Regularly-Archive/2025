import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  TablePagination,
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  Group as GroupIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  AccessTime
} from '@mui/icons-material';
import BookingForm from './BookingForm';
import { get } from '../utils/request';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRooms = async (pageIndex, pageSize) => {
    try {
      const response = await get(`api/rooms/paginate?pageIndex=${pageIndex + 1}&pageSize=${pageSize}`);
      if (response.data) {
        setRooms(response.data.rows);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleBooking = (room) => {
    setSelectedRoom(room);
    setOpenBooking(true);
  };

  const getRoomStatusChip = (status) => {
    const statusConfig = {
      0: { label: '可用', color: 'success' },
      1: { label: '维护中', color: 'warning' },
      2: { label: '占用', color: 'error' },
    };
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getRoomType = (type) => {
    var typeConfig = {
      0: '普通会议室',
      1: '多媒体会议室'
    }

    return typeConfig[type]
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {room.name}
                  </Typography>
                  {getRoomStatusChip(room.status)}
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  会议室容量：{room.capacity}人
                </Typography>
                
                <Typography color="text.secondary" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  会议室类型：{getRoomType(room.type)}
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                  <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  可用时间：{room.availableStartTime} - {room.availableEndTime}
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
                  disabled={room.status != 0 }
                  onClick={() => handleBooking(room)}
                >
                  预约
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        maxWidth="sm"
        fullWidth
      >
        <BookingForm
          room={selectedRoom}
          onClose={() => setOpenBooking(false)}
          onConfirm={() => setOpenBooking(false)}
        />
      </Dialog>
    </Box>
  );
}

export default RoomList; 