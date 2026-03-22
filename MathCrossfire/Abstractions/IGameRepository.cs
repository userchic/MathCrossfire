using MathCrossfire.Models;

namespace MathCrossfire.Abstractions
{
    public interface IGameRepository
    {
        Game? GetGame(int id);
        ICollection<Game> GetGames();
        void CreateGame(Game game);
        void UpdateGame(Game game);
        void DeleteGame(Game game);
        void Save();
    }
}