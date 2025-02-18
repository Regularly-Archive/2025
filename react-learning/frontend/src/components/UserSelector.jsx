// UserSelector.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { AddCircle as AddCircleIcon, Search as SearchIcon } from '@mui/icons-material';
import { get } from '../utils/request';

const UserSelector = ({ placeholder, maxVisibleUsers = 5, initialUsers = [], onConfirm }) => {
    const [selectedUsers, setSelectedUsers] = useState(initialUsers);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        setOpen(false)
        onConfirm(selectedUsers)
    }

    const handleSelectUser = (user) => {
        if (!selectedUsers.find(x => x.id == user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleDeleteUser = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user !== userToDelete));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        handleSearch();
    }, [pageIndex, rowsPerPage, searchTerm]);

    const handleSearch = async () => {
        const response = await get(`api/Users/paginate?pageIndex=${pageIndex}&pageSize=${rowsPerPage}&keyword=${searchTerm}`);
        setSearchResults(response.data.rows);
        setTotalCount(response.data.totalCount);
    };

    const handleSelectResult = (user) => {
        handleSelectUser(user);
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') { 
            handleSearch();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {selectedUsers.length === 0 ? (
                        <Typography variant="body2" color="textSecondary" style={{ marginRight: '8px' }}>
                            {placeholder}
                        </Typography>
                    ) : (
                        (isExpanded ? selectedUsers : selectedUsers.slice(0, maxVisibleUsers)).map(user => (
                            <Chip
                                key={user.id}
                                label={user.nickName}
                                onDelete={() => handleDeleteUser(user)}
                                style={{ marginRight: '4px' }}
                            />
                        ))
                    )}
                    {selectedUsers.length > maxVisibleUsers && (
                        <Button onClick={handleToggleExpand}>{isExpanded ? '收起' : '展开'}</Button>
                    )}
                </div>
                <Button onClick={handleOpen} style={{ minWidth: '40px', marginLeft: '8px' }}>
                    <AddCircleIcon />
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>选择用户</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" style={{ marginRight: '8px', marginBottom: '8px' }}>
                        当前选择:
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {selectedUsers.map(user => (
                            <Chip
                                key={user.id}
                                label={user.nickName}
                                onDelete={() => handleDeleteUser(user)}
                                style={{ marginRight: '4px' }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="搜索用户"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyPress}
                        />
                        <Button onClick={handleSearch} style={{ marginLeft: '8px' }}>
                            <SearchIcon />
                        </Button>
                    </div>
                    <div>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>用户名</TableCell>
                                        <TableCell align='center'>姓名</TableCell>
                                        <TableCell align='center'>邮箱</TableCell>
                                        <TableCell align='center'>部门</TableCell>
                                        <TableCell align='center'>操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchResults.map(user => (
                                        <TableRow key={user.id} onClick={() => handleSelectResult(user)}>
                                            <TableCell align='center'>{user.userName}</TableCell>
                                            <TableCell align='center'>{user.nickName}</TableCell>
                                            <TableCell align='center'>{user.email}</TableCell>
                                            <TableCell align='center'>{user.department}</TableCell>
                                            <TableCell align='center'>
                                                <Button onClick={() => handleSelectResult(user)}>选择</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={rowsPerPage}
                                page={pageIndex - 1}
                                onPageChange={(event, newPage) => {
                                    setPageIndex(newPage + 1);
                                    handleSearch();
                                }}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPageIndex(1);
                                    handleSearch();
                                }}
                                labelRowsPerPage="每页行数"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} 共 ${count} 条`
                                }
                            />
                        </TableContainer>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleConfirm} type="submit" variant="contained">确定</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserSelector;