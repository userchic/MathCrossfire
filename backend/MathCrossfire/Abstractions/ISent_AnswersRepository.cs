using Microsoft.EntityFrameworkCore;
using MathCrossfire.DataBase;
using MathCrossfire.Models;

namespace MathCrossfire.Abstractions
{
    public interface ISent_AnswersRepository
    {
        public void CreateAnswer(Sent_Answers answer);
        public Sent_Answers GetAnswer(int id);
        public Tasks GetTask(Sent_Answers answer);
        public Sent_Answers GetAnswerByTeamAndTask(int taskId, int teamId);
        void Save();
    }
}