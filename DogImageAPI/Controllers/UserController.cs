using DogImageAPI.Services;
using Microsoft.AspNetCore.Mvc;


namespace DogImageAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthService _authService;

        public UserController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserSignUpDto dto)
        {
            var result = await _authService.RegisterUser(dto.Username, dto.Password, dto.Name, dto.Mobile, dto.Address);
            if (!result) return BadRequest("User already exists.");
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var result = await _authService.LoginUser(dto.Username, dto.Password);
            if (!result.Success) return Unauthorized();

            return Ok(new
            {
                message = "User logged in successfully.",
                userId = result.UserId
            });
        }
    }

    public class UserSignUpDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; } 
        public string Mobile { get; set; } 
        public string Address { get; set; } 
    }

    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

}
