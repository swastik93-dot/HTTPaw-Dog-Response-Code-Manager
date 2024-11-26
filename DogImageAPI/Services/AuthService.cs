using DogImageAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace DogImageAPI.Services
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public int? UserId { get; set; }
    }

    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AuthService
    {
        private readonly DataContext _context;

        public AuthService(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> RegisterUser(string username, string password, string name, string mobile, string address)
        {
            if (await _context.Users.AnyAsync(u => u.Username == username)) return false;

            var passwordHash = HashPassword(password);
            var user = new User
            {
                Username = username,
                PasswordHash = passwordHash,
                Name = name,
                Mobile = mobile,
                Address = address
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LoginResponse> LoginUser(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return new LoginResponse { Success = false, UserId = null };

            var isPasswordValid = VerifyPassword(password, user.PasswordHash);
            return new LoginResponse
            {
                Success = isPasswordValid,
                UserId = isPasswordValid ? user.Id : null
            };
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var passwordHash = HashPassword(password);
            return storedHash == passwordHash;
        }
    }
}