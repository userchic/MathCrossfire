using MathCrossfire.Abstractions;
using MathCrossfire.Contracts;
using MathCrossfire.DataBase;
using MathCrossfire.Models;
using MathCrossfire.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Web;

namespace MathCrossfire.Controllers
{
    [ApiController]
    [Route("/[controller]/[action]")]
    public class HomeController : Controller
    {
        GameContext db;

		IGameRepository gameRep; 
        ClassRepository classRep;


        public HomeController(GameContext context,ClassRepository classes,IGameRepository games)
        {
            db = context;
            classRep = classes;
            gameRep = games;
        }
        [HttpGet]
        public IActionResult GetGames()
        {
            List<Game> games = gameRep.GetGames().OrderBy(game=>-game.ID).ToList();
            foreach (Game game in games)
                game.StartDate = game.StartDate.ToLocalTime();
            return Json(JsonSerializer.Serialize(games, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.Preserve }));
        }
        [HttpPost]
        public IActionResult Login( Contracts.LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { error = ModelState.GetEnumerator().Current.Value });
            }
            var user = db.Users.FirstOrDefault(u => u.Login == request.Login);
            if (user is null)
            {
                return Json(new { success = 0, message = "Неверный логин" });
            }
            if(user.Password!=request.Password)
            {
                return Json(new { success = 0, message = "Неверный пароль" });
            }
            ExecuteLogin(user);
            return Json(new { success = 1, message = "Успешно выполнен вход в систему"});
        }
        [HttpPost]
        public ActionResult Register( Contracts.RegisterRequest request)
        {
            //валидация
            if(!ModelState.IsValid)
            {
                return Json(new { error = ModelState.GetEnumerator().Current.Value });
            }
            if (db.Users.Where(u => u.Login == request.Login).Any())
            {
                return Json(new { success=0,message= "Пользователь с таким именем уже существует" });
            }
            Users user=Users.Create(request.Login, request.Password, request.Name, request.Surname, request.Fatname, classRep.GetClass(request.@Class).ID);
            db.Users.Add(user);
            db.SaveChanges();
            ExecuteLogin(user);
            return Json(new { success = 1, message = "Успешная регистрация, войдите в систему под введенными данными" });
        }
        [HttpPost]
        public IActionResult LogOut()
        {
            HttpContext.SignOutAsync();
            return Ok();
        }
        private void ExecuteLogin(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType,user.Login),
            };
            var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
            HttpContext.SignInAsync(claimsPrincipal);
        }
        public static bool UserIsAdmin(ClaimsPrincipal User) => User.IsInRole("Администратор");
        public static bool UserIsPlayer(ClaimsPrincipal User) =>  User.IsInRole("Игрок");
    }
}