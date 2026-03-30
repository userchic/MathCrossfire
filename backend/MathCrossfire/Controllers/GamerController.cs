using GameHubSpace;
using MathCrossfire.Abstractions;
using MathCrossfire.DataBase;
using MathCrossfire.Models;
using MathCrossfire.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Timers;

namespace MathCrossfire.Controllers
{
    [ApiController]
    [Route("/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = "Cookies")]
    public class GamerController : Controller
	{


		static Random rand1 = new Random();
		static Random rand2 = new Random();

		public IHubContext<GameHub, IGameClient> hubContext;
		public ITaskRepository taskRep;
		public IGameRepository gameRep;
		public ITeamRepository teamRep;
		public IUserRepository userRep;
        public IShotRepository shotRep;
        public ISent_AnswersRepository sentAnswersRep;
		public GamerController(ITaskRepository tasks,
			IGameRepository games,
			ITeamRepository teams,
			IUserRepository users,
			ISent_AnswersRepository sent_Answers,
			IShotRepository shots,
            IHubContext<GameHub, IGameClient> gameContext)
		{
			taskRep = tasks;
			gameRep = games;
			teamRep = teams;
			userRep = users;
			sentAnswersRep = sent_Answers;
			shotRep = shots;
			hubContext = gameContext;
		}
		[HttpGet]
		public ActionResult GetTeams(int gameId)
		{
			Game game = gameRep.GetGame(gameId);
			if (game is null) 
			{
				return NotFound(); 
			}
			List<Teams> teams = (List<Teams>)teamRep.GetTeams(gameId);
			return Json(JsonSerializer.Serialize(teams, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }
		[HttpGet]
		public IActionResult GetGame(int gameId)
        {
            Users user = GetUser();
            Game game = gameRep.GetGame(gameId);
            if (game is null)
                return NotFound();
            return Json(JsonSerializer.Serialize(game, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }
        [HttpGet]
        public ActionResult GetTeam(int teamId)
		{
			Teams team = teamRep.GetTeamWithUsers(teamId);
			if (team is null)
			{
				return NotFound();
			}
			return Json(JsonSerializer.Serialize(team, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }
		[HttpPost]
        public ActionResult CreateTeam(int gameId,  string teamName)
		{
			teamName = teamName.Trim();
			if (teamName.Trim().IsNullOrEmpty())
			{
				return Json(new { success = 0, message = "Не введено название команды. Введите его." });
			}
			Game game = gameRep.GetGame(gameId);
			if (game.Started())
			{
				return Json(new { success = 0, message = "Игра началась." });
			}
            Users user = GetUser();
            if (teamRep.UserInGame(user, game) is not null)
            {
				return Json(new { success = 0, message = "Вы уже в другой команде этой игры." });
            }
			if (game.Teams.FirstOrDefault((team) => team.Name == teamName) is not null)
			{
				return Json(new { success = 0, message = "в игре уже создана команда с таким именем" });
			}
			Teams team = Teams.Create(  teamName,gameId, new List<Users>() { user } );
            teamRep.CreateTeam(team);
			teamRep.Save();
			return Json(new {success=1,message="Успешно создана команда."});
		}
		//[HttpPut]
		//public ActionResult UpdateTeam(int teamId, string teamName)
		//{
		//	Teams team=teamRep.GetTeam(teamId);
		//	Game game = gameRep.GetGame(team.GameID); 
		//	if (game is null)
		//	{
		//		ViewBag.Message = "Игра не существует";
		//		return View("TeamUpdate");
		//	}
		//	if (game.Ongoing())
		//	{
		//		ViewBag.Message = "Игра началась";
		//		return View("TeamUpdate");
		//	}
		//	Users user = GetUser();
		//	if (!team.Validation())
		//	{
		//		ViewBag.Message = "Название команды не введено";
		//		return View("TeamUpdate");
		//	}
		//	teamRep.UpdateTeam(team);
		//	teamRep.Save();
		//	ViewBag.Message = "Команда изменена";
		//	return View("Teams");
		//}
		[HttpPost]
		public ActionResult JoinTeam(int teamId)
		{
            /*
			Находим команду чтобы проверить что она существует, подгружаем членов этой команды
			Получаем игру
			Проверяем что игра ещё не начиналась
			Получаем пользователя
			Проверяем что пользователь в рамках этой игры ещё не присоединился ни к какой команде
			Добавляем к членам команды пользователя
			обновляем команду в БД
			  */
            Teams team = teamRep.GetTeamWithUsers(teamId);
			if (team is null)
			{
				return Json(new { success = 0, message = "Пользователь уже в другой команде этой игры." });
			}
			Game game = gameRep.GetGame(team.GameID);
            if (game.Started())
			{
				return Json(new { success = 0, message = "Игра началась, присоединяться к командам больше нельзя." });
			}
			Users user = GetUser();
            if (teamRep.UserInGame(user, game) is not null)
            {
				return Json(new { success = 0, message = "Пользователь уже в другой команде." });
            }
            if (team.Users.Contains(user))
			{
				return Json(new { success = 0, message = "Пользователь уже в этой команде." });
			}
			team.Users.Add(user);
			teamRep.UpdateTeam(team);
			teamRep.Save();
			return Json(new {success=1,message="Успешное присоединение к команде."});
		}
		[HttpPost]
		public ActionResult LeaveTeam(int teamId)
		{
            /*
			Находим команду чтобы проверить что она существует, подгружаем членов этой команды
			Получаем игру
			Проверяем что игра ещё не начиналась
			Получаем пользователя
			Проверяем что пользователь находится в этой команде
			Удаляем из членов команды пользователя
			обновляем команду в БД
			*/
            Teams team = teamRep.GetTeamWithUsers(teamId);
			if(team is null)
			{
				return Json(new { success = 0, message = "Команда не существует." });
            }
			Game game = gameRep.GetGame(team.GameID);
			Users user = GetUser();
			if (!team.Users.Contains(user))
            {
				return Json(new { success = 0, message = "Пользователя нет в этой команде." });
			}
			if (game.Started())
			{
				return Json(new { success = 0, message = "Игра началась, нельзя уходить." });
			}
			team.Users.Remove(user);
			if (team.Users.Count == 0)
			{
				teamRep.DeleteTeam(team);
				teamRep.Save();
				return Json(new {success=1,message="Успешно удалене команда."});
            }
			teamRep.UpdateTeam(team);
			teamRep.Save();
			return Json(new { success = 1, message = "Успешно покинута команда." });
        }

		[HttpPost]
		public ActionResult SendAnswer(int targetTeamId, int gameId, int teamId, int taskId, string answer)
		{
			Game game = gameRep.GetGame(gameId);
			if (game is null)
			{
				return Json(new { success = 0, message = "Такая игра не существует" });
			}
			if (!game.Ongoing())
			{
				return Json(new { success = 0, message = "Игра не проходит в данный момент, возможно она уже закончилась." });
			}
			Users user = GetUser();
			Teams team = teamRep.GetTeamWithUsers(teamId);
			if (team is null)
			{
				return Json(new { success = 0, message = "Эта команда не существует" });
			}
			if (!game.Teams.Any(team => team.Id == teamId))
			{
				return Json(new { success = 0, message = "Данная команда не участвует в указанной игре" });
			}
			if (!team.Users.Any(u => u.Login == user.Login))
			{
				return Json(new { success = 0, message = "Вы не входите в указанную команду" });
			}
			Tasks task = taskRep.GetTask(taskId);
			if (!game.Tasks.Any(t => t.Id == task.Id))
			{
				return Json(new { success = 0, message = "Эта задача не рассматривается в этой игре" });
			}
			Teams targetTeam = teamRep.GetTeam(targetTeamId);
			if (targetTeamId != -1 && targetTeam is null)
			{
				return Json(new { success = 0, message = "Целевая команда не существует" });
			}
			if (game.Tasks.SelectMany(x => x.UsersAnswers).Any(answer => answer.TeamID == teamId && answer.TaskID == task.Id))
			{
				return Json(new { success = 0, message = "На эту задачу вашей командой уже был отправлен ответ" });
			}
			Sent_Answers newAnswer = new Sent_Answers()
			{
				GameId = gameId,
				Correctness = answer == task.Answer,
				Answer = answer,
				SentTime = DateTime.UtcNow,
				TaskID = task.Id,
				UserLogin = user.Login,
				TeamID = team.Id,

			};
			sentAnswersRep.CreateAnswer(newAnswer);
			sentAnswersRep.Save();
			team.Score++;
			teamRep.UpdateTeam(team);
			if (targetTeamId != -1 && answer == task.Answer)
			{
				double pick = rand1.NextDouble();
				Shots newShot = new Shots();
				newShot.isSuccessful = pick > 0.5;
				if (newShot.isSuccessful)
				{
					targetTeam.Score--;
					teamRep.UpdateTeam(targetTeam);
				}
				newShot.AnswerID = newAnswer.Id;
				newShot.TargetTeamID = targetTeamId;
				shotRep.CreateShot(newShot);
				shotRep.Save();
			}
			teamRep.Save();
			var sentAnswersCount = game.Tasks.SelectMany(x => x.UsersAnswers).Where(answer => answer.GameId == gameId).Count();

			if (game.Tasks.Count * game.Teams.Count == sentAnswersCount)
			{
				hubContext.Clients.Group(gameId.ToString()).EndGameMessage(gameId);
				game.GameEnded = true;
				gameRep.Save();
			}
			hubContext.Clients.Group(gameId.ToString()).SolvedTaskMessage(user.Login, taskId, teamId, targetTeamId, newAnswer.Correctness, newAnswer.Shot is null ? false : newAnswer.Shot.isSuccessful);
			return Json(new { success = 1, message = "Успешно принят ответ на задачу" });
		}
		
		private Users GetUser() => userRep.GetUser(User.Identity.Name);
    }
}