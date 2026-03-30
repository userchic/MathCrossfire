using MathCrossfire.Abstractions;
using MathCrossfire.Contracts;
using MathCrossfire.DataBase;
using MathCrossfire.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Web;

namespace MathCrossfire.Controllers
{
    [ApiController]
    [Route("/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = "Cookies")]
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
            List<Tasks> tasks = (List<Tasks>)taskRep.GetTasks().OrderBy(Task=>-Task.Id).ToList();
            return Json(JsonSerializer.Serialize(tasks, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }

        [HttpGet]
        public ActionResult GetTask(int taskId)
        {
            Tasks task=taskRep.GetTask(taskId);
            if (task is null)
            {
                return NotFound();
            }
            return Json(JsonSerializer.Serialize(task, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }

        [HttpPost]
        public ActionResult CreateTask(TaskRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { error = ModelState.GetEnumerator().Current.Value });
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
                return Json(new { error = ModelState.GetEnumerator().Current.Value });
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
                return Json(new { error = ModelState.GetEnumerator().Current.Value });
            }
            List<Tasks> tasks = taskRep.GetTasks().ToList();
            if(!request.TasksIds.All(taskId=>tasks.Any(t=>t.Id==taskId)))
            {
                return Json(new {success=0,message="Указаны идентификаторы несуществующих задач"});
            }
            Game game = new Game();
            for (int i = 0; i < request.TasksIds.Length; i++)
                game.Tasks.Add(taskRep.GetTask(request.TasksIds[i]));
            game.Name = request.Name;
            game.Lenga = request.Length;
            game.StartDate = request.StartDate;
            game.GameEnded = false;
            gameRep.CreateGame(game);
            gameRep.Save();
            //gameManager.AddGame(game);
            return Json(new { success = 1, message = "Успешно создана игра" });
        }
    }
}