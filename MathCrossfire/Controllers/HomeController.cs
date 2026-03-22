using MathCrossfire.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using MathCrossfire.DataBase;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.Razor;
using MathCrossfire.Repositories;
using MathCrossfire.Abstractions;
using MathCrossfire.Contracts;
using Microsoft.AspNetCore.Identity.Data;

namespace MathCrossfire.Controllers
{
    [ApiController]
    [Route("/[controller]/[action]")]
    public class HomeController : Controller
    {
        GameContext db;

		IGameRepository gameRep; 
        RoleRepository roleRep;
        ClassRepository classRep;


        public HomeController(GameContext context,RoleRepository roles,ClassRepository classes,IGameRepository games)
        {
            db = context;
            roleRep = roles;
            classRep = classes;
            gameRep = games;
        }
        [HttpGet]
        public IActionResult GetGames()
        {
            List<Game> games = gameRep.GetGames().ToList();
            foreach (Game game in games)
                game.StartData = game.StartData.ToLocalTime();
            return Json(games);
        }
        [HttpPost]
        public async Task<IActionResult> Login(Contracts.LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Json(ModelState.GetEnumerator().Current.Value);
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
            await ExecuteLogin(user);
            return Json(new { success = 1, message = "Успешно выполнен вход в систему" });
        }
        [HttpPost]
        public async Task<ActionResult> Register(Contracts.RegisterRequest request)
        {
            //валидация
            if(!ModelState.IsValid)
            {
                return Json(ModelState.GetEnumerator().Current.Value);
            }
            if (db.Users.Where(u => u.Login == request.Login).Any())
            {
                return Json(new { success=0,message= "Пользователь с таким именем уже существует" });
            }
            Users user=Users.Create(request.Login, request.Password, request.Name, request.SurName, request.FatName, roleRep.GetRole(request.Role).ID,classRep.GetClass(request.@Class).ID);

            db.Users.Add(user);
            db.SaveChanges();
            await ExecuteLogin(user);
            return Json(new { success = 1, message = "Успешная регистрация, войдите в систему под введенными данными" });
        }
        [HttpPost]
        public IActionResult LogOut()
        {
            HttpContext.SignOutAsync();
            return Ok();
        }
        private async Task ExecuteLogin(Users user)
        {
            user.Role = db.Roles.FirstOrDefault(x => x.ID == user.RoleID);
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType,user.Login),
                new Claim(ClaimsIdentity.DefaultRoleClaimType,user.Role.Name)
            };
            var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
            await HttpContext.SignOutAsync();
            await HttpContext.SignInAsync(claimsPrincipal);
        }
        public static bool UserIsAdmin(ClaimsPrincipal User) => User.IsInRole("Администратор");
        public static bool UserIsPlayer(ClaimsPrincipal User) =>  User.IsInRole("Игрок");
    }
}