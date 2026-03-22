using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Repositories
{
    public class RoleRepository
    {
        public GameContext _context;
        public RoleRepository(GameContext context)
        {
            _context = context;
        }
        public Role GetRole(string roleName)
        {
            return _context.Roles.FirstOrDefault(x=>x.Name == roleName);
        }
    }
}
