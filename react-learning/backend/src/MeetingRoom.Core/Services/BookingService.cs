using Mapster;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using MeetingRoom.Infrastructure.Repositories;

namespace MeetingRoom.Core.Services
{
    public class BookingService : IBookingService
    {
        private readonly IRepository<Booking> _bookingRepository;
        private readonly IRepository<Room> _roomRepository;
        private readonly IRepository<User> _userRepository;

        public BookingService(
            IRepository<Booking> bookingRepository,
            IRepository<Room> roomRepository,
            IRepository<User> userRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
            _userRepository = userRepository;
        }

        public async Task<BookingDTO> GetByIdAsync(long id)
        {
            var booking = await _bookingRepository.GetAsync(id);
            return booking == null ? null : MapToDto(booking);
        }

        public async Task<PagedResult<BookingDTO>> GetPagedListAsync(QueryParameter<Booking, BookingQueryableFilter> queryParameter)
        {
            var result = await _bookingRepository.PaginateAsync(queryParameter);
            return new PagedResult<BookingDTO>
            {
                Rows = result.Rows.Adapt<List<BookingDTO>>(),
                TotalCount = result.TotalCount,
            };
        }

        public async Task<long> CreateAsync(CreateBookingDTO dto)
        {
            var room = await _roomRepository.GetAsync(dto.RoomId);
            if (room == null)
                throw new BusinessException("当前会议室不存在");

            if (room.Status != RoomStatus.Available)
                throw new BusinessException("当前会议室不可用");

            if (dto.StartTime.TimeOfDay < room.AvailableStartTime ||
                dto.EndTime.TimeOfDay > room.AvailableEndTime)
                throw new BusinessException("预约时间不在会议室开放时间范围内");

            if (dto.StartTime >= dto.EndTime)
                throw new BusinessException("结束时间必须晚于开始时间");

            if (dto.StartTime < DateTime.Now)
                throw new BusinessException("不能预约过去的时间");

            if (!await IsTimeSlotAvailableAsync(dto.RoomId, dto.StartTime, dto.EndTime))

                throw new BusinessException("该时间段已被预约");

            var booking = new Booking
            {
                RoomId = dto.RoomId,
                UserId = -1, // 从当前用户上下文获取
                Title = dto.Title,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Status = BookingStatus.Confirmed,
                Participants = dto.Participants,
                CreatedAt = DateTime.Now
            };

            var instance = await _bookingRepository.AddAsync(booking);
            return instance.Id;
        }

        public async Task<bool> UpdateAsync(UpdateBookingDTO dto)
        {
            var booking = await _bookingRepository.GetAsync(dto.Id);
            if (booking == null)
                throw new BusinessException("预约记录不存在");

            if (booking.Status == BookingStatus.Cancelled)
                throw new BusinessException("已取消的预约不能修改");

            if (booking.Status == BookingStatus.Completed)
                throw new BusinessException("已完成的预约不能修改");

            if (dto.StartTime.HasValue || dto.EndTime.HasValue)
            {
                var startTime = dto.StartTime ?? booking.StartTime;
                var endTime = dto.EndTime ?? booking.EndTime;

                if (startTime >= endTime)
                    throw new BusinessException("结束时间必须晚于开始时间");

                if (startTime < DateTime.Now)
                    throw new BusinessException("不能预约过去的时间");

                if (!await IsTimeSlotAvailableAsync(booking.RoomId, startTime, endTime, dto.Id))
                    throw new BusinessException("该时间段已被预约");

                booking.StartTime = startTime;
                booking.EndTime = endTime;
            }

            if (!string.IsNullOrEmpty(dto.Title))
                booking.Title = dto.Title;

            if (!string.IsNullOrEmpty(dto.Participants))
                booking.Participants = dto.Participants;

            if (dto.Status.HasValue)
                booking.Status = dto.Status.Value;

            await _bookingRepository.UpdateAsync(booking);

            return true;
        }

        public async Task<bool> CancelAsync(long id)
        {
            var userId = 0L;
            var booking = await _bookingRepository.GetAsync(id);
            if (booking == null)
                throw new BusinessException("预约记录不存在");

            if (booking.UserId != userId)
                throw new BusinessException("只能取消自己的预约");

            if (booking.Status != BookingStatus.Confirmed)
                throw new BusinessException("只能取消已确认的预约");

            if (booking.StartTime <= DateTime.Now)
                throw new BusinessException("不能取消已开始的预约");

            booking.Status = BookingStatus.Cancelled;
            booking.UpdatedAt = DateTime.Now;

            await _bookingRepository.UpdateAsync(booking);
            return true;
        }

        public async Task<bool> IsTimeSlotAvailableAsync(long roomId, DateTime startTime, DateTime endTime, long? excludeBookingId = null)
        {
            var query = _bookingRepository.SqlSugarClient.Queryable<Booking>()
            .Where(b => !b.IsDeleted)
            .Where(b => b.RoomId == roomId)
            .Where(b => b.Status != BookingStatus.Cancelled)
            .WhereIF(excludeBookingId.HasValue, b => b.Id != excludeBookingId.Value)
            .Where(b =>
                (b.StartTime <= startTime && b.EndTime > startTime) ||
                (b.StartTime < endTime && b.EndTime >= endTime) ||
                (b.StartTime >= startTime && b.EndTime <= endTime));

            return !await query.AnyAsync();
        }

        private BookingDTO MapToDto(Booking booking)
        {
            if (booking == null) return null;

            return new BookingDTO
            {
                Id = booking.Id,
                RoomId = booking.RoomId,
                RoomName = booking.Room?.Name,
                UserId = booking.UserId,
                Username = booking.User?.UserName,
                Title = booking.Title,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status,
                Participants = booking.Participants,
                CreatedAt = booking.CreatedAt
            };
        }
    }
}
