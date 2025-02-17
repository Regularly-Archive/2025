using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MeetingRoom.Core.DTOs;
using MeetingRoom.Core.Services;
using MeetingRoom.Infrastructure.Models;
using MeetingRoom.Core.Entities;
using MeetingRoom.Infrastructure.Services;

namespace MeetingRoom.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : CrudBaseController<Room, RoomQueryableFilter>
    {

        public RoomsController(CrudBaseService<Room> crudBaseService) : base(crudBaseService)
        {

        }
    }
}