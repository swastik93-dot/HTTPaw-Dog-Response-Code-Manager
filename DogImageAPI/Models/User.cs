using System.Collections.Generic;

namespace DogImageAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Name { get; set; }        
        public string Mobile { get; set; }      
        public string Address { get; set; }   
        public ICollection<List> Lists { get; set; }
    }

}
