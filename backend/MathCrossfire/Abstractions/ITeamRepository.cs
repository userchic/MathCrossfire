using MathCrossfire.Models;

namespace MathCrossfire.Abstractions
{
    public interface ITeamRepository
    {
        Teams GetTeam(int teamId);
        Teams? GetTeamWithUsers(int teamId);
        ICollection<Teams> GetTeams(int gameId);
        void CreateTeam(Teams teams);
        void UpdateTeam(Teams teams);
        void DeleteTeam(Teams teams);
        void Save();
        /// <summary>
        /// Возвращается команда игры в которой находится игрок. Если не находится то возвращается ничего
        /// </summary>
        /// <param name="user">Пользователь</param>
        /// <param name="game">Игра</param>
        /// <returns></returns>
        Teams? UserInGame(Users user, Game game);
    }
}
