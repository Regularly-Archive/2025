using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

public class BookingDTO
{
    public long Id { get; set; }
    public long RoomId { get; set; }
    public string RoomName { get; set; }
    public long UserId { get; set; }
    public string Username { get; set; }
    public string Title { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public string Participants { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBookingDTO
{
    public long RoomId { get; set; }
    public string Title { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Participants { get; set; }
}

public class UpdateBookingDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Participants { get; set; }
    public BookingStatus? Status { get; set; }
}

public class BookingQueryableFilter : IQueryableFilter<Booking>
{
    public long? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public BookingStatus? Status { get; set; }

    public ISugarQueryable<Booking> Apply(ISugarQueryable<Booking> queryable)
    {
        queryable = queryable
            .WhereIF(UserId.HasValue, x => x.CreatedBy == UserId.Value.ToString())
            .WhereIF(StartDate.HasValue, x => x.StartTime >= StartDate.Value)
            .WhereIF(EndDate.HasValue, x => x.EndTime <= EndDate.Value)
            .WhereIF(Status.HasValue, x => x.Status == Status.Value);

        return queryable;
    }
}
