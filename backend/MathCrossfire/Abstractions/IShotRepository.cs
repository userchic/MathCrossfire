using MathCrossfire.Models;

namespace MathCrossfire.Abstractions
{
    public interface IShotRepository
    {
        Shots GetShot(int answerId);
        void CreateShot(Shots shot);
        void Save();
    }
}