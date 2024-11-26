namespace DogImageAPI.Models
{
    public class List
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreationDate { get; set; }
        public string ResponseCodes { get; set; }
        public string ImageLink { get; set; } 
        public User User { get; set; }
        public int UserId { get; set; }
    }
}
