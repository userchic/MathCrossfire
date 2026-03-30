using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MathCrossfire.Models
{
    public class InGameUser
    {
        public int Score { get; set; } = 0;
        public int SolvedTasks { get; set; } = 0;
        public int MistakedTasks { get; set; } = 0;
        public int Shots { get; set; } = 0;
        public int Hits { get; set; } = 0;
        public int Misses { get; set; } = 0;
        public void GetHit() { Score--; }
        public bool SolveTask(ref Random rand)
        {
            SolvedTasks++;
            Score++;
            Shots++;
            if (rand.NextDouble() > 0.5) { Hits++; return true; }
            else { Misses++; return false; }
        }
    }
}