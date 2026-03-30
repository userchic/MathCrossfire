using Microsoft.EntityFrameworkCore;
using MathCrossfire.Abstractions;
using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Repositories
{
    public class ShotsRepository: IShotRepository
    {
        public GameContext _context;
        public ShotsRepository(GameContext context)
        {
            _context = context;
        }

        public void CreateShot(Shots shot)
        {
            _context.Shots.Add(shot);
        }
        public Shots GetShot(int answerId)
        {
            return _context.Shots.Where(x => x.AnswerID == answerId ).Include(x=>x.Sent_answer).First();
        }
        public void Save()
        {
            _context.SaveChanges(); 
        }
    }
}
