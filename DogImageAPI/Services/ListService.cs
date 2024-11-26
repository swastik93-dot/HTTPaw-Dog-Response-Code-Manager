using Microsoft.EntityFrameworkCore;
using DogImageAPI.Models;

namespace DogImageAPI.Services
{
   
    public class ListService
    {
        private readonly DataContext _context;
        public ListService(DataContext context)
        {
            _context = context;
        }

        public async Task CreateList(int userId, string name, string responseCodes, string imageLink)
        {
            //TD
            var (validatedCodes, validatedLinks) = ValidateAndPairCodesWithLinks(responseCodes, imageLink);

            var newList = new List
            {
                UserId = userId,
                Name = name,
                ResponseCodes = validatedCodes,
                ImageLink = validatedLinks,
                CreationDate = DateTime.Now
            };
            _context.Lists.Add(newList);
            await _context.SaveChangesAsync();
        }

        public async Task<List<List>> GetUserLists(int userId)
        {
            return await _context.Lists.Where(l => l.UserId == userId).ToListAsync();
        }

        public async Task DeleteList(int listId)
        {
            var list = await _context.Lists.FindAsync(listId);
            if (list == null) return;
            _context.Lists.Remove(list);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateList(int listId, string name, string responseCodes, string imageLink)
        {
            var list = await _context.Lists.FindAsync(listId);
            //var list = _context.Lists.Find(listId);

            if (list == null)
            {
                throw new KeyNotFoundException($"List with ID {listId} not found.");
            }

            // Validate and update the response codes and image links
            var (validatedCodes, validatedLinks) = ValidateAndPairCodesWithLinks(responseCodes, imageLink);

            list.Name = name;
            list.ResponseCodes = validatedCodes;
            list.ImageLink = validatedLinks;

            await _context.SaveChangesAsync();
        }

        private (string responseCodes, string imageLinks) ValidateAndPairCodesWithLinks(string responseCodes, string imageLink)
        {
            
            if (string.IsNullOrEmpty(responseCodes))
            {
                return (string.Empty, string.Empty);
            }

            var codes = responseCodes.Split(',').Select(c => c.Trim()).Where(c => !string.IsNullOrEmpty(c)).ToList();
            var links = !string.IsNullOrEmpty(imageLink)
                ? imageLink.Split(',').Select(l => l.Trim()).Where(l => !string.IsNullOrEmpty(l)).ToList()
                : new List<string>();

           
            while (links.Count < codes.Count)
            {
                links.Add(string.Empty);
            }

            //if (links.Count > codes.Count)
            //{
            //    links = links.Take(codes.Count).ToList();
            //}

          
            var validatedCodes = string.Join(",", codes);
            var validatedLinks = string.Join(",", links);

            return (validatedCodes, validatedLinks);
        }
    }
}
