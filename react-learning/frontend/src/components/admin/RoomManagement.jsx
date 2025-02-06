import { useState } from 'react';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import RoomForm from './RoomForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// 模拟会议室数据
const mockRooms = [
  {
    id: 1,
    name: '会议室 A',
    capacity: 10,
    type: '普通会议室',
    status: 'available',
    facilities: ['投影仪', '白板'],
    availableTime: '09:00-18:00',
    description: '适合小型会议',
  },
  {
    id: 2,
    name: '会议室 B',
    capacity: 20,
    type: '多媒体会议室',
    status: 'maintenance',
    facilities: ['视频会议系统', '投影仪', '音响'],
    availableTime: '09:00-18:00',
    description: '配备完整视频会议设备',
  },
];

function RoomManagement() {
  const [rooms, setRooms] = useState(mockRooms);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleAdd = () => {
    setSelectedRoom(null);
    setOpenForm(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setOpenForm(true);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setOpenDelete(true);
  };

  const handleSave = (roomData) => {
    if (selectedRoom) {
      setRooms(rooms.map(room => 
        room.id === selectedRoom.id ? { ...room, ...roomData } : room
      ));
    } else {
      setRooms([...rooms, { id: Date.now(), ...roomData }]);
    }
    setOpenForm(false);
  };

  const handleConfirmDelete = () => {
    setRooms(rooms.filter(room => room.id !== selectedRoom.id));
    setOpenDelete(false);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      available: { label: '可用', color: 'success' },
      occupied: { label: '占用', color: 'error' },
      maintenance: { label: '维护中', color: 'warning' },
    };
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

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
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.capacity}人</TableCell>
                <TableCell>{room.type}</TableCell>
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
                <TableCell>{room.availableTime}</TableCell>
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
            ))}
          </TableBody>
        </Table>
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