using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Repositories
{
    public class ClassRepository
    {
        public GameContext _context;
        public ClassRepository(GameContext context)
        {
            _context = context;
        }
        public Class GetClass(string className)
        {
            return _context.Classes.FirstOrDefault(x => x.Name == className);
        }
    }
}
