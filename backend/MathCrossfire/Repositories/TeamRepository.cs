using Microsoft.EntityFrameworkCore;
using MathCrossfire.Abstractions;
using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Repositories
{
    public class TeamRepository:ITeamRepository
    {
        public GameContext _context;
        public TeamRepository(GameContext context)
        {
            _context = context;
        }
        public Teams GetTeam(int id)
        {
            return _context.Teams.Find(id);
        }
        public Teams? GetTeamWithUsers(int teamId)
        {
            return _context.Teams.Include(x=>x.Users).FirstOrDefault(x=>x.Id==teamId);
        }
        public ICollection<Teams> GetTeams(int gameId)
        {
            return _context.Teams.Where(x => x.GameID==gameId).ToList();
        }
        public Teams? UserInGame(Users user,Game game)
        {
            return _context.Teams.Include(x=>x.Users).FirstOrDefault(x => x.GameID == game.ID && x.Users.Contains(user));
        }
        public void CreateTeam(Teams Team)
        {
            _context.Teams.Add(Team);
        }
        public void UpdateTeam(Teams Team)
        {
            _context.Teams.Update(Team);
        }
        public void DeleteTeam(Teams Team)
        {
            _context.Teams.Remove(Team);
        }
        public void Save()
        {
            _context.SaveChanges();
        }

        public List<Users> GetUsers(int teamId)
        {
            return _context.Teams.Where(x=> x.Id==teamId).Include(x => x.Users).First().Users.ToList();
        }


    }
}
