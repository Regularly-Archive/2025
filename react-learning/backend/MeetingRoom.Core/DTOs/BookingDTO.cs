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
    public string UserName { get; set; }
    public string Title { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public List<Participant> Participants { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy {  get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
}

public class CreateBookingDTO
{
    public long RoomId { get; set; }
    public string Title { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public List<Participant> Participants { get; set; }
    public string Description {  get; set; }
}

public class UpdateBookingDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public List<Participant> Participants { get; set; }
    public string Description { get; set; }
    public BookingStatus? Status { get; set; }
}

public class BookingQueryableFilter : IQueryableFilter<Booking>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public BookingStatus? Status { get; set; }
    public string Keyword { get; set; }

    public ISugarQueryable<Booking> Apply(ISugarQueryable<Booking> queryable)
    {
        queryable = queryable
            .WhereIF(StartDate.HasValue, x => x.StartTime >= StartDate.Value)
            .WhereIF(EndDate.HasValue, x => x.EndTime <= EndDate.Value)
            .WhereIF(Status.HasValue && Status.Value != BookingStatus.All, x => x.Status == Status.Value)
            .WhereIF(!string.IsNullOrEmpty(Keyword), x => x.Title.Contains(Keyword));


        return queryable;
    }
}
