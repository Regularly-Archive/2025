import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import RoomManagement from '../components/admin/RoomManagement';
import BookingManagement from '../components/admin/BookingManagement';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Admin() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        系统管理
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="用户管理" />
          <Tab label="会议室管理" />
          <Tab label="预约记录" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <UserManagement />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RoomManagement />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BookingManagement />
      </TabPanel>
    </Box>
  );
}

export default Admin; 