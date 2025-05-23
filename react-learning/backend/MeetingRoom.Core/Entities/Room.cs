using System;
using System.Collections.Generic;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.Entities;

[SugarTable("rooms")]
public class Room : BaseEntity
{
    [SugarColumn(Length = 50)]
    public string Name { get; set; }

    public int Capacity { get; set; }

    public RoomStatus Status { get; set; }

    public RoomType Type { get; set; }

    [SugarColumn(Length = 500)]
    public string Description { get; set; }

    public TimeSpan AvailableStartTime { get; set; }

    public TimeSpan AvailableEndTime { get; set; }

    [SugarColumn(IsJson = true)]
    public List<string> Facilities { get; set; }
}