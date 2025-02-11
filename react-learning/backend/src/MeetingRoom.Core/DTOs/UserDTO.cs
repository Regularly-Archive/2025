using MeetingRoom.Core.Enums;

namespace MeetingRoom.Core.DTOs;

public class UserDTO
{
    public long Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
}


public class UserQueryDTO
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Keywords { get; set; }
    public UserRole? Role { get; set; }
}

public class UserLoginDTO
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class UpdateUserDTO
{
    public long Id { get; set; }
    public string Email { get; set; }
}

public class UserRegisterDTO
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class ChangePasswordDTO
{
    public string UserName { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
