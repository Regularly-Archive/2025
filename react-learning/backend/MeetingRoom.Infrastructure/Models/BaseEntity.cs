using SqlSugar;

namespace MeetingRoom.Infrastructure.Models;

public abstract class BaseEntity
{
    [SugarColumn(IsPrimaryKey = true, ColumnName = "id")]
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
}