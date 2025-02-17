using Newtonsoft.Json;

namespace MeetingRoom.Infrastructure.Models;

public class PagedResult<T>
{
    [JsonProperty("totalCount")]
    public int TotalCount { get; set; }

    [JsonProperty("rows")]
    public List<T> Rows { get; set; }
}
