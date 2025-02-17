import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Tooltip,
  Button
} from '@mui/material';
import {
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

import dayjs from 'dayjs';
import { get } from '../utils/request';

// 配置本地化
const locales = {
  'zh-CN': zhCN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  today: '今天',
  previous: '上一页',
  next: '下一页',
  month: '月',
  week: '周',
  day: '日',
  agenda: '议程',
  date: '日期',
  time: '时间',
  event: '事件',
  noEventsInRange: '当前时间段无预约',
};

function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (startDate, endDate) => {
    try {
      const response = await get(`api/bookings/list?startDate=${startDate}&endDate=${endDate}`);
      const bookings = response.data.map((x, i) => {
        return {
          ...x,
          start: new Date(x.startTime),
          end: new Date(x.endTime),
        }
      })
      
      setBookings(bookings);
    } catch (error) {
      console.error('获取预约数据失败:', error);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = calculateDateRange(new Date());
    fetchBookings(startDate.toISOString(), endDate.toISOString());
  }, []);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#1976d2',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block'
    };
    return { style };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleNavigate = async (newDate) => {
    const { startDate, endDate } = calculateDateRange(newDate);
    await fetchBookings(startDate.toISOString(), endDate.toISOString());
  };

  const calculateDateRange = (currentDate) => {
    var startDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    var firstDayOfWeek = startDateOfMonth.getDay();
    let startDate = startDateOfMonth;
    if (firstDayOfWeek !== 1) {
      const daysToSubtract = (firstDayOfWeek + 6) % 7;
      startDate = dayjs(startDateOfMonth).subtract(daysToSubtract, 'day').toDate();
    }
    
    var lastDayOfWeek = endDateOfMonth.getDay();
    let endDate = endDateOfMonth;
    if (lastDayOfWeek !== 0) {
      const daysToAdd = 7 - lastDayOfWeek;
      endDate = dayjs(endDateOfMonth).add(daysToAdd, 'day').toDate();
    }

    return { startDate, endDate };
  }

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <BigCalendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
        onNavigate={handleNavigate}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        culture="zh-CN"
      />

      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedEvent?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedEvent?.roomName}
            </Typography>

            <Typography>
              <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedEvent ? 
                `${format(new Date(selectedEvent.startTime), 'yyyy/MM/dd HH:mm', { locale: zhCN })} - ${format(new Date(selectedEvent.endTime), 'HH:mm', { locale: zhCN })}` : ''
              }
            </Typography>

            <Typography>
              <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              <Tooltip title={
              selectedEvent && selectedEvent.participants && selectedEvent.participants.length > 0 
                ? selectedEvent.participants.map(x => x.nickName).join(', ') 
                : ''
            } arrow>
              <span>
                {
                  selectedEvent && selectedEvent.participants && selectedEvent.participants.length > 0 
                    ? selectedEvent.participants.map(x => x.nickName).join(', ') 
                    : ''
                }
              </span>
            </Tooltip>
            </Typography>

            {selectedEvent?.description && (
              <Typography color="text.secondary" noWrap>
              <Tooltip title={selectedEvent.description} arrow>
                <span>
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedEvent.description}
                </span>
              </Tooltip>
            </Typography>
            )}
          </Stack>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setSelectedEvent(null)}>
            关闭
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Calendar; 