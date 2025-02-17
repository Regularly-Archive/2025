using MeetingRoom.Core.DTOs;
using Newtonsoft.Json;

namespace MeetingRoom.Core.Models
{
    public class LoginResult
    {
        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("userInfo")]
        public UserDTO UserInfo { get; set; }
    }
}
