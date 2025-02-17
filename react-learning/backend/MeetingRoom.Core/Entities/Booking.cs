using System;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using Newtonsoft.Json;
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

    [SugarColumn(IsJson = true)]
    public List<Participant> Participants { get; set; }

    public string Description {  get; set; }

    [SugarColumn(IsIgnore = true)]
    [Navigate(NavigateType.OneToOne, "RoomId")]
    public Room Room { get; set; }

    [SugarColumn(IsIgnore = true)]
    [Navigate(NavigateType.OneToOne, "UserId")]
    public User User { get; set; }
}

public class Participant
{
    [JsonProperty("id")]
    public long Id { get; set; }

    [JsonProperty("nickName")]
    public string NickName { get; set; }
}

