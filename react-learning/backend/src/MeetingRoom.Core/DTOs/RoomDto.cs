
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.DTOs;

public class RoomDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }
    public RoomStatus Status { get; set; }
    public RoomType Type { get; set; }
    public string Description { get; set; }
    public TimeSpan AvailableStartTime { get; set; }
    public TimeSpan AvailableEndTime { get; set; }
}

public class CreateRoomDto
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    public RoomType Type { get; set; }
    public string Description { get; set; }
    public TimeSpan AvailableStartTime { get; set; }
    public TimeSpan AvailableEndTime { get; set; }
}

public class UpdateRoomDto
{
    public string Name { get; set; }
    public int? Capacity { get; set; }
    public RoomStatus? Status { get; set; }
    public RoomType? Type { get; set; }
    public string Description { get; set; }
    public TimeSpan? AvailableStartTime { get; set; }
    public TimeSpan? AvailableEndTime { get; set; }
}

public class RoomQueryDto
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Keywords { get; set; }
    public RoomStatus? Status { get; set; }
    public RoomType? Type { get; set; }
}

public class RoomQueryableFilter : IQueryableFilter<Room>
{
    public string Keyword { get; set; }
    public RoomStatus? Status { get; set; }
    public RoomType? Type { get; set; }

    public ISugarQueryable<Room> Apply(ISugarQueryable<Room> queryable)
    {
        queryable = queryable
            .WhereIF(!string.IsNullOrEmpty(Keyword), x => x.Name.IndexOf(Keyword) != -1 || x.Description.IndexOf(Keyword) != -1)
            .WhereIF(Status.HasValue, x => x.Status == Status.Value)
            .WhereIF(Type.HasValue, x => x.Type == Type.Value);

        return queryable;
    }
}