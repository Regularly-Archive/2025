using MeetingRoom.Core.DTOs;
using MeetingRoom.Core.Models;
using MeetingRoom.Infrastructure.Models;
using static Azure.Core.HttpHeader;

public interface IUserService
{
    Task<UserDTO> GetByIdAsync(long id);
    Task<PagedResult<UserDTO>> GetPagedListAsync(UserQueryDTO query);
    Task<bool> DeleteAsync(long id);

    Task<UserDTO> GetCurrentUserAsync();

    Task<LoginResult> LoginAsync(UserLoginDTO request);

    Task RegisterAsync(UserRegisterDTO request);

    Task ChangePassword(ChangePasswordDTO request);

    Task UpdateProfile(UpdateUserDTO request);
} 