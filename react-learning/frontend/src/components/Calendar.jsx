import { useState } from 'react';
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
} from '@mui/material';
import {
  Room as RoomIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

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

// 自定义日历消息
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

// 模拟预约数据
const mockBookings = [
  {
    id: 1,
    roomId: 1,
    roomName: '会议室 A',
    title: '产品评审会议',
    start: new Date('2024-03-20T10:00:00'),
    end: new Date('2024-03-20T11:30:00'),
    attendees: '张三, 李四, 王五',
    status: 'upcoming',
    description: '讨论新产品功能特性',
  },
  {
    id: 2,
    roomId: 2,
    roomName: '会议室 B',
    title: '团队周会',
    start: new Date('2024-03-20T14:00:00'),
    end: new Date('2024-03-20T15:00:00'),
    attendees: '整个开发团队',
    status: 'upcoming',
    description: '回顾本周工作进展',
  },
  // 更多预约记录...
];

function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 自定义事件样式
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

  // 处理事件点击
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <BigCalendar
        localizer={localizer}
        events={mockBookings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
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
              {selectedEvent && format(selectedEvent.start, 'HH:mm')} -
              {selectedEvent && format(selectedEvent.end, 'HH:mm')}
            </Typography>

            <Typography>
              <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {selectedEvent?.attendees}
            </Typography>

            {selectedEvent?.description && (
              <Typography sx={{ mt: 2 }}>
                {selectedEvent.description}
              </Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Calendar; 