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
import UserForm from './UserForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { get, post, put, del } from '../../utils/request';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('')

  // 获取用户列表数据
  const fetchUsers = async (pageIndex, pageSize) => {
    try {
      setLoading(true);
      const response = await get(`api/users/paginate?pageIndex=${pageIndex + 1}&pageSize=${pageSize}&keyword=${keyword}`);
      if (response.data) {
        setUsers(response.data.rows);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage, keyword]);

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEdit = (user) => {
    selectUserById(user.id);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleSave = async (userData) => {
    let res = {}
    try {
      setLoading(true);
      if (selectedUser) {
        res = await put(`api/users`, {
          ...userData,
          id: selectedUser.id
        });
      } else {
        res = await post('api/users/register', userData);
      }
      if (res.code == 200) {
        setOpenForm(false);
        fetchUsers(page, rowsPerPage);
        //showMessage(res.message, 'success');
      }
      fetchUsers(page, rowsPerPage);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    let res = {}
    try {
      setLoading(true);
      res = await del(`api/users/${selectedUser.id}`);
      //showMessage(res.message, 'success');
    } catch (error) {
    } finally {
      setLoading(false);
      fetchUsers(page, rowsPerPage);
      setOpenDelete(!(res.code == 200));
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
  };

  const selectUserById = async (userId) => {
    try {
      setLoading(true);
      const response = await get(`api/users/${userId}`);
      if (response.data) {
        setSelectedUser(response.data);
        setOpenForm(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          添加用户
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="搜索用户"
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
              <TableCell>用户名</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>部门</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.nickName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 1 ? '管理员' : '普通用户'}
                      color={user.role === 1 ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user)}
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
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => setOpenForm(false)}
        />
      </Dialog>

      <DeleteConfirmDialog
        open={openDelete}
        title="删除用户"
        content={`确定要删除用户"${selectedUser?.nickName}"吗？`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </Box>
  );
}

export default UserManagement; 