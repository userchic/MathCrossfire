using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MathCrossfire.Models
{
    public class Game
    {
        public string Name { get; set; }
        public DateTime StartData { get; set; }
        public int Lenga { get; set; }
        public int ID { get; set; }
        public ICollection<Tasks> Tasks { get; set; }
        public ICollection<Teams> Teams { get; set; }
        public Game()
        {
            Tasks = new List<Tasks>();
            Teams = new List<Teams>();
        }
        public bool Started()
        {
            return StartData.ToLocalTime() <= DateTime.Now ? true : false;
        }
        public bool Ended()
        {
            return StartData.ToLocalTime().AddMinutes(Lenga) >= DateTime.Now ? false : true;
        }
        public bool Ongoing()
        {
            return Started() & !Ended() ? true : false;
        }
    }
}