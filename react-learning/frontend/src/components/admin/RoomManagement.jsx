import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  Chip,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import RoomForm from './RoomForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { get, post, put, del } from '../../utils/request';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');


  const fetchRooms = async (pageIndex, pageSize) => {
    try {
      setLoading(true);
      const response = await get(`api/rooms/paginate?pageIndex=${pageIndex + 1}&pageSize=${pageSize}&keyword=${keyword}`);
      if (response.data) {
        setRooms(response.data.rows);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleAdd = () => {
    setSelectedRoom(null);
    setOpenForm(true);
  };

  const handleEdit = (room) => {
    selectRoomById(room.id);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setOpenDelete(true);
  };

  const handleSave = async (roomData) => {
    let res = {};
    try {
      setLoading(true);
      if (selectedRoom) {
        res = await put('api/rooms', {
          ...roomData,
          id: selectedRoom.id
        });
      } else {
        res = await post('api/rooms', roomData);
      }
      if (res.code === 200) {
        setOpenForm(false);
        fetchRooms(page, rowsPerPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const res = await del(`api/rooms?ids=${selectedRoom.id}`);
      if (res.code === 200) {
        fetchRooms(page, rowsPerPage);
        setOpenDelete(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
    const timeoutId = setTimeout(() => {
      setPage(0);
      fetchRooms(0, rowsPerPage);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const selectRoomById = async (roomId) => {
    try {
      setLoading(true);
      const response = await get(`api/rooms/${roomId}`);
      if (response.data && response.code == 200) {
        setSelectedRoom(response.data);
        setOpenForm(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      0: { label: '可用', color: 'success' },
      1: { label: '维护中', color: 'warning' },
      2: { label: '占用', color: 'error' },
    };
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getTypeChip = (type) => {
    var typeConfig = {
      0: '普通会议室',
      1: '多媒体会议室'
    }

    return typeConfig[type]
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          添加会议室
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="搜索会议室..."
          value={keyword}
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
              <TableCell>名称</TableCell>
              <TableCell>容量</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>设施</TableCell>
              <TableCell>可用时间</TableCell>
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
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}人</TableCell>
                  <TableCell>{getTypeChip(room.type)}</TableCell>
                  <TableCell>
                    {room.facilities.map((facility) => (
                      <Chip
                        key={facility}
                        label={facility}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{room.availableStartTime}-{room.availableEndTime}</TableCell>
                  <TableCell>{getStatusChip(room.status)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(room)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(room)}
                    >
                      <DeleteIcon />
                    </IconButton>
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

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <RoomForm
          room={selectedRoom}
          onSave={handleSave}
          onCancel={() => setOpenForm(false)}
        />
      </Dialog>

      <DeleteConfirmDialog
        open={openDelete}
        title="删除会议室"
        content={`确定要删除会议室"${selectedRoom?.name}"吗？`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </Box>
  );
}

export default RoomManagement; 