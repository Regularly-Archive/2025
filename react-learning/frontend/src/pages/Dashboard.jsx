import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography 
} from '@mui/material';
import RoomList from '../components/RoomList';
import MyBookings from '../components/MyBookings';
import Calendar from '../components/Calendar';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        控制台
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="会议室列表" />
          <Tab label="我的预约" />
          <Tab label="日历视图" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <RoomList />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MyBookings />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Calendar />
      </TabPanel>
    </Box>
  );
}

export default Dashboard; 