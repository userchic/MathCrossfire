using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MathCrossfire.Models
{
    public class Sent_Answers
    {
        public int Id { get; set; }
        public string Answer { get; set; } = "";
        public string? UserLogin { get; set; }
        public int TaskID { get; set; }
        public int? TeamID { get; set; }
        public int GameId { get; set; }
        public bool Correctness { get; set; }
        public DateTime SentTime { get; set; }
        public Tasks Task { get; set; }
        public Users User { get; set; }
        public Shots? Shot { get; set; }
        public Teams Team { get; set; }
        public Game Game { get; set; }
    }
}