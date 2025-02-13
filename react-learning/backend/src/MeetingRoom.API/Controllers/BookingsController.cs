using MeetingRoom.API.Models;
using MeetingRoom.Core.Entities;
using MeetingRoom.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace MeetingRoom.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<JsonResult> Login([FromBody] CreateBookingDTO bookingDTO)
        {
            var bookingId = await _bookingService.CreateAsync(bookingDTO);
            return ApiResult.Success(bookingId);
        }

        [HttpGet("{id}")]
        public async Task<JsonResult> SelectById(long id)
        {
            var userDTO = await _bookingService.GetByIdAsync(id);
            return ApiResult.Success(userDTO, "操作成功");
        }

        [HttpPut]
        public async Task<JsonResult> Update([FromBody] UpdateBookingDTO bookingDTO)
        {
            await _bookingService.UpdateAsync(bookingDTO);
            return ApiResult.Success(new { }, "操作成功");
        }

        [HttpPut("{id}/cancel")]
        public async Task<JsonResult> Canncel(long id)
        {
            await _bookingService.CancelAsync(id);
            return ApiResult.Success(new { }, "操作成功");
        }

        [HttpGet("paginate")]
        public async Task<JsonResult> GetByPageAsync([FromQuery] QueryParameter<Booking, BookingQueryableFilter> queryParameter)
        {
            var result = await _bookingService.GetPagedListAsync(queryParameter);
            return ApiResult.Success(result, "操作成功");
        }

        [HttpGet("list")]
        public async Task<JsonResult> FindList([FromQuery] QueryParameter<Booking, BookingQueryableFilter> queryParameter)
        {
            throw new NotImplementedException();
        }


        [HttpDelete("{id}")]
        public virtual async Task<JsonResult> DeleteAsync(long id)
        {
            await _bookingService.DeleteAsync(id);
            return ApiResult.Success(new { }, "操作成功");
        }
    }
}
