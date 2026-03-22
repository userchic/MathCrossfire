
using Microsoft.IdentityModel.Tokens;

namespace MathCrossfire.Models
{
    public class Teams
    {
        public int Id { get; set; }
        public int GameID { get; set; }
        public string Name { get; set; } = "";
        public int Score { get; set; } = 0;
        public Game Game { get; set; }
        public ICollection<Sent_Answers> Answers { get; set; }
        public ICollection<Users> Users { get; set; }
        public ICollection<Shots> Shots { get; set; }

        public static Teams Create(string teamName,int gameID, List<Users> users)
        {
            return new Teams() { GameID=gameID,Name=teamName,Users=users};
        }
    }
}