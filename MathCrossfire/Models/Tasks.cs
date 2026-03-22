using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//using MathCrossfire.Configurations;

namespace MathCrossfire.Models
{
    public class Tasks
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Answer { get; set; }
        public ICollection<Game> Game { get; set; }
        public ICollection<Sent_Answers> UsersAnswers { get; set; }
        public Tasks()
        {
            Game= new List<Game>();
            UsersAnswers = new List<Sent_Answers>();
        }
        public InGameTask ToInGameTask()
        {
            InGameTask task = new InGameTask();
            task.ID = Id;
            task.Text = Text;
            return task;
        }
    }
}