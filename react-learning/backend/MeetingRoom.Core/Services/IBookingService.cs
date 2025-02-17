
using MeetingRoom.Core.Entities;
using MeetingRoom.Infrastructure.Models;

public interface IBookingService
{
    Task<BookingDTO> GetByIdAsync(long id);
    Task<PagedResult<BookingDTO>> GetPagedListAsync(QueryParameter<Booking, BookingQueryableFilter> queryParameter);

    Task<List<BookingDTO>> GetBookingListAsync(BookingQueryableFilter queryableFilter);
    Task<long> CreateAsync(CreateBookingDTO dto);
    Task<bool> UpdateAsync(UpdateBookingDTO dto);
    Task<bool> CancelAsync(long id);
    Task<bool> IsTimeSlotAvailableAsync(long roomId, DateTime startTime, DateTime endTime, long? excludeBookingId = null);
    Task<bool> DeleteAsync(long id);
} 