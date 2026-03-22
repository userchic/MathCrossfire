using MathCrossfire.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using MathCrossfire.DataBase;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using MathCrossfire.Abstractions;
using Microsoft.AspNetCore.Mvc.Rendering;
using MathCrossfire.Contracts;

namespace MathCrossfire.Controllers
{
    [ApiController]
    [Route("/[controller]/[action]")]
    [Authorize(Roles = "Администратор")]
    public class AdminController : Controller
    {
        Random rand1 = new Random();
        Random rand2 = new Random();
        public ITaskRepository taskRep;
        public IGameRepository gameRep;
        public AdminController(ITaskRepository tasks,
            IGameRepository games)
        {
            taskRep = tasks;
            gameRep = games;
        }
        [HttpGet]
        public ActionResult GetTasks()
        {
            List<Tasks> tasks = (List<Tasks>)taskRep.GetTasks();
            return Json(tasks);
        }

        [HttpGet]
        public ActionResult GetTask(int taskId)
        {
            Tasks task=taskRep.GetTask(taskId);
            if (task is null)
            {
                return NotFound();
            }
            return Json (task);
        }

        [HttpPost]
        public ActionResult CreateTask(TaskRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(ModelState.GetEnumerator().Current.Value);
            }
            Tasks task = new Tasks() { Text = request.Text, Answer = request.Answer };
            taskRep.CreateTask(task);
            taskRep.Save();
            return Json(new { success = 1, message = "Успешно создана задача" });
        }
        [HttpPut]
        public ActionResult UpdateTask(TaskRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(ModelState.GetEnumerator().Current.Value);
            }
            Tasks task = taskRep.GetTask(request.Id);
            if (task is null)
            {
                return NotFound();
            }
            task.Text = request.Text;
            task.Answer = request.Answer;
            taskRep.UpdateTask(task);
            taskRep.Save();
            return Json(new {success=1,message="Успешно изменена задача"});
        }
        [HttpDelete]
        public ActionResult DeleteTask(int id)
        {
            Tasks task = taskRep.GetTask(id);
            if(task is null)
            {
                return NotFound();
            }
            taskRep.DeleteTask(task);
            taskRep.Save();
            return Json(new {success=1,message="Успешно удалена задача"});
        }
        [HttpPost]
        public ActionResult CreateGame(GameRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(ModelState.GetEnumerator().Current.Value);
            }
            Game game = new Game();
            for (int i = 0; i < request.TasksIds.Length; i++)
                game.Tasks.Add(taskRep.GetTask(request.TasksIds[i]));
            game.Name = request.Name;
            game.Lenga = request.Length;
            game.StartData = game.StartData;
            gameRep.CreateGame(game);
            gameRep.Save();
            //gameManager.AddGame(game);
            return Json(new { success = 1, message = "Успешно создана игра" });
        }
    }
}