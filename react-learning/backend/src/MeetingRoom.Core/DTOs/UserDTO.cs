using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Infrastructure.Models;
using SqlSugar;

namespace MeetingRoom.Core.DTOs;

public class UserDTO
{
    public long Id { get; set; }
    public string NickName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public UserRole Role { get; set; }
    public string Department { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
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
    public string NickName { get; set; }
    public string Department { get; set; }
    public UserRole? Role { get; set; }
}

public class UserRegisterDTO
{
    public string NickName { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Department { get; set; }
    public UserRole? Role { get; set; }
}

public class ChangePasswordDTO
{
    public string UserName { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}

public class UserQueryableFilter : IQueryableFilter<User>
{
    public string Keyword { get; set; }

    public ISugarQueryable<User> Apply(ISugarQueryable<User> queryable)
    {
        queryable = queryable
            .WhereIF(!string.IsNullOrEmpty(Keyword), x => x.NickName.Contains(Keyword) || x.UserName.Contains(Keyword));

        return queryable;
    }
}
