namespace MathCrossfire.Models
{
    public class Shots
    {
        public int ID { get; set; }
        public int AnswerID { get; set; }
        public int TargetTeamID { get; set; }
        public bool isSuccessful { get; set; }
        public Sent_Answers Sent_answer { get; set; }
        public Teams TargetTeam { get; set; }
    }
}