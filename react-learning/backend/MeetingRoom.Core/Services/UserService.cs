using Mapster;
using Masuit.Tools.Security;
using MeetingRoom.Core.DTOs;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.Enums;
using MeetingRoom.Core.Models;
using MeetingRoom.Infrastructure.Models;
using MeetingRoom.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MeetingRoom.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IOptions<JwtSetting> _jwtSettingOptions;
        private const string DEFAULT_AES_KEY = "V2lraXRBZG1pbg==";

        public UserService(IRepository<User> userRepository, IOptions<JwtSetting> jwtSettingOptions, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _jwtSettingOptions = jwtSettingOptions;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<UserDTO> GetByIdAsync(long id)
        {
            var userInfo = await _userRepository.GetAsync(id);
            if (userInfo == null) throw new ArgumentException("指定用户不存在");

            return userInfo.Adapt<UserDTO>();
        }

        public async Task<PagedResult<UserDTO>> GetPagedListAsync(QueryParameter<User, UserQueryableFilter> queryParameter)
        {
            var result = await _userRepository.PaginateAsync(queryParameter);
            return new PagedResult<UserDTO>
            {
                Rows = result.Rows.Adapt<List<UserDTO>>(),
                TotalCount = result.TotalCount,
            };
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                throw new BusinessException("用户不存在");
            }

            if (user.Role == UserRole.Admin)
            {
                throw new BusinessException("不能删除管理员用户");
            }

            await _userRepository.DeleteAsync(id);
            return true;
        }

        public async Task<UserDTO> GetCurrentUserAsync()
        {
            var userName = _httpContextAccessor.HttpContext?.User.Identity?.Name;
            if (userName == null) return null;

            var userInfo = await _userRepository.FindAsync(x => x.UserName == userName);
            if (userName == null) return null;

            return userInfo.Adapt<UserDTO>();
        }

        public async Task<LoginResult> LoginAsync(UserLoginDTO request)
        {
            var encrypted = request.Password.AESEncrypt(DEFAULT_AES_KEY);
            var userInfo = await _userRepository.FindAsync(x => x.UserName == request.UserName && x.Password == encrypted);
            if (userInfo == null) throw new ArgumentException("用户名或密码不正确");

            var token = GenerateJwtToken(userInfo);
            return new LoginResult
            {
                Token = token,
                UserInfo = new UserDTO
                {
                    Id = userInfo.Id,
                    NickName = userInfo.NickName,
                    UserName = userInfo.UserName,
                    Email = userInfo.Email,
                    Department = userInfo.Department,
                    Role = userInfo.Role,
                    CreatedAt = userInfo.CreatedAt,
                    CreatedBy = userInfo.CreatedBy,
                    UpdatedAt = userInfo.UpdatedAt,
                    UpdatedBy = userInfo.UpdatedBy,
                }
            };
        }

        public async Task RegisterAsync(UserRegisterDTO request)
        {
            var encrypted = request.Password.AESEncrypt(DEFAULT_AES_KEY);
            var userInfo = await _userRepository.FindAsync(x => x.UserName == request.UserName);
            if (userInfo != null) throw new ArgumentException("该用户已存在");

            var newUser = new User
            {
                Role = request.Role.HasValue ? request.Role.Value : UserRole.User,
                Email = request.Email,
                UserName = request.UserName,
                Password = encrypted,
                NickName = request.NickName,
                Department = request.Department,
            };
            await _userRepository.AddAsync(newUser);
        }

        public async Task UpdateProfile(UpdateUserDTO request)
        {
            var systemUser = await _userRepository.GetAsync(request.Id);
            if (systemUser == null) throw new ArgumentException("指定用户不存在"); ;

            request.Adapt(systemUser);
            await _userRepository.UpdateAsync(systemUser);
        }

        public async Task ChangePassword(ChangePasswordDTO request)
        {
            var currentUserName = (await GetCurrentUserAsync()).UserName;
            if (currentUserName != request.UserName)
                throw new ArgumentException("不允许修改他人密码");

            var currentUser = await _userRepository.FindAsync(x => x.UserName == request.UserName);
            if (currentUser == null) throw new ArgumentException("指定用户不存在");

            if (request.OldPassword == request.NewPassword)
                throw new ArgumentException("新/旧密码不能相同");

            var encryptedPassword = request.NewPassword.AESEncrypt(DEFAULT_AES_KEY);
            currentUser.Password = encryptedPassword;
            await _userRepository.UpdateAsync(currentUser);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSetting = _jwtSettingOptions.Value;
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting.Secret));
            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var jwtToken = new JwtSecurityToken(
                issuer: jwtSetting.Issuer,
                audience: jwtSetting.Audience,
                claims: claims,
                expires: DateTime.Now.Add(jwtSetting.Expires),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}