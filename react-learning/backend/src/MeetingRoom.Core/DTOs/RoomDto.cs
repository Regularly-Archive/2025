
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.DTOs;

public class RoomQueryableFilter : IQueryableFilter<Room>
{
    public string Keyword { get; set; }
    public RoomStatus? Status { get; set; }
    public RoomType? Type { get; set; }

    public ISugarQueryable<Room> Apply(ISugarQueryable<Room> queryable)
    {
        queryable = queryable
            .WhereIF(!string.IsNullOrEmpty(Keyword), x => x.Name.Contains(Keyword) || x.Description.Contains(Keyword))
            .WhereIF(Status.HasValue, x => x.Status == Status.Value)
            .WhereIF(Type.HasValue, x => x.Type == Type.Value);

        return queryable;
    }
}