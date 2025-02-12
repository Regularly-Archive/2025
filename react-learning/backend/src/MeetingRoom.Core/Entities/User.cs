using System;
using System.Collections.Generic;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.Entities;

public class User : BaseEntity
{
    [SugarColumn(Length = 50)]
    public string NickName { get; set; }

    [SugarColumn(Length = 50)]
    public string UserName { get; set; }

    [SugarColumn(Length = 100)]
    public string Password { get; set; }

    [SugarColumn(Length = 100)]
    public string Email { get; set; }

    [SugarColumn(Length = 50)]
    public string Department { get; set; }

    public UserRole Role { get; set; }

    [SugarColumn(IsIgnore = true)]
    public List<Booking> Bookings { get; set; }
}
