using MathCrossfire.DataBase; 
using Microsoft.EntityFrameworkCore;
using MathCrossfire.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Net;
using MathCrossfire.Models;
using MathCrossfire.Repositories;
using MathCrossfire.Abstractions;
using GameHubSpace;
//using GameHubSpace;
//using MathCrossfire.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<GameContext>(
    options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
    );
builder.Services.AddAuthentication("Cookies")
    .AddCookie();
builder.Services.AddAuthorization();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<ClassRepository>()
                .AddScoped<IGameRepository, GameRepository>()
                .AddScoped<ITaskRepository, TaskRepository>()
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<IShotRepository, ShotsRepository>()
                .AddScoped<ITeamRepository, TeamRepository>()
                .AddScoped<ISent_AnswersRepository, Sent_AnswersRepository>()
                .AddLogging();

builder.Services.AddSignalR(options=>
{
    options.ClientTimeoutInterval=new TimeSpan(1, 0, 0);
});
//builder.Services.AddSingleton<IGameManager, GameManager>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCookiePolicy(new CookiePolicyOptions
{
    HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.None
}
);
app.UseCors(x => {
    x.AllowAnyHeader();
    x.WithOrigins("https://localhost:5173");
    x.AllowAnyMethod();
    x.AllowCredentials();
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/gameHub");

app.Run();
