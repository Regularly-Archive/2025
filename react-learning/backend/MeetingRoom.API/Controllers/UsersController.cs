using MeetingRoom.API.Models;
using MeetingRoom.Core.DTOs;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Models;
using MeetingRoom.Infrastructure.Models;
using MeetingRoom.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetingRoom.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<JsonResult> Login([FromBody] UserLoginDTO loginRequest)
    {
        var loginResult = await _userService.LoginAsync(loginRequest);
        return ApiResult.Success(loginResult);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<JsonResult> Register([FromBody] UserRegisterDTO registerRequest)
    {
        await _userService.RegisterAsync(registerRequest);
        return ApiResult.Success(new { }, "注册成功");
    }

    [HttpGet("{id}")]
    public virtual async Task<JsonResult> SelectById(long id)
    {
        var userDTO = await _userService.GetByIdAsync(id);
        return ApiResult.Success(userDTO, "操作成功");
    }

    [HttpPut]
    public virtual async Task<JsonResult> Update([FromBody] UpdateUserDTO request)
    {
        await _userService.UpdateProfile(request);
        return ApiResult.Success(new { }, "操作成功");
    }

    [HttpPost("ChangePassword")]
    public async Task<JsonResult> ChangePassword([FromBody] ChangePasswordDTO request)
    {
        await _userService.ChangePassword(request);
        return ApiResult.Success(new { }, "操作成功");
    }

    [HttpGet("paginate")]
    public virtual async Task<JsonResult> GetByPageAsync([FromQuery] QueryParameter<User, UserQueryableFilter> queryParameter)
    {
        var result = await _userService.GetPagedListAsync(queryParameter);
        return ApiResult.Success(result, "操作成功");
    }

    [HttpDelete("{id}")]
    public virtual async Task<JsonResult> DeleteAsync(long id)
    {
        await _userService.DeleteAsync(id);
        return ApiResult.Success(new { }, "操作成功");
    }
}