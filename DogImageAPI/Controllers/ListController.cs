using DogImageAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace DogImageAPI.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class ListController : ControllerBase
    {
        private readonly ListService _listService;
        public ListController(ListService listService)
        {
            _listService = listService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateList([FromBody] CreateListDto dto)
        {
            await _listService.CreateList(dto.UserId, dto.Name, dto.ResponseCodes, dto.ImageLink);
            return Ok("List created successfully.");
        }

        //get for display lists by user id
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserLists(int userId)
        {
            var lists = await _listService.GetUserLists(userId);
            return Ok(lists);
        }

        // delete opration  
        [HttpDelete("{listId}")]
        public async Task<IActionResult> DeleteList(int listId)
        {
            await _listService.DeleteList(listId);
            return Ok("List deleted successfully.");
        }

        [HttpPut("{listId}")]
        public async Task<IActionResult> UpdateList(int listId, [FromBody] UpdateListDto dto)
        {
            try
            {
                await _listService.UpdateList(listId, dto.Name, dto.ResponseCodes, dto.ImageLink);
                return Ok("List updated successfully.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("List not found.");
            }
        }
    }

    public class CreateListDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string ResponseCodes { get; set; }
        public string ImageLink { get; set; }
    }
    public class UpdateListDto
    {
        public string Name { get; set; }
        public string ResponseCodes { get; set; }
        public string ImageLink { get; set; }
    }

}
