using Microsoft.EntityFrameworkCore;
using MathCrossfire.Abstractions;
using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Repositories
{
    public class GameRepository :IGameRepository
    {
        public GameContext _context;
        public GameRepository(GameContext context)
        {
            _context=context;
        }
        public Game? GetGame(int id)
        {
            return _context.Games.Where(x => x.ID == id).Include(x=>x.Teams).ThenInclude(x=>x.Users).Include(x=>x.Tasks).ThenInclude(x=>x.UsersAnswers).ThenInclude(x=>x.Shot).FirstOrDefault();
        }
        public ICollection<Game> GetGames()
        {
            return _context.Games.Select(x=>x).ToList();
        }
        public void CreateGame(Game game)
        {
            _context.Games.Add(game);
        }
        public void UpdateGame(Game game)
        {
            _context.Games.Update(game);
        }
        public void DeleteGame(Game game)
        {
            _context.Games.Remove(game);
        }
        public void Save()
        {
            _context.SaveChanges();
        }


    }
}
