using System;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.Entities;

[SugarTable("bookings")]
public class Booking : BaseEntity
{
    public long RoomId { get; set; }

    public long UserId { get; set; }

    [SugarColumn(Length = 100)]
    public string Title { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public BookingStatus Status { get; set; }

    [SugarColumn(Length = 500)]
    public string Participants { get; set; }

    [SugarColumn(IsIgnore = true)]
    public Room Room { get; set; }

    [SugarColumn(IsIgnore = true)]
    public User User { get; set; }
}

