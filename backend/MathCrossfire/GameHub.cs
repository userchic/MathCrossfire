using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MathCrossfire.Abstractions;
using MathCrossfire.Models;
namespace GameHubSpace
{
    public interface IGameClient
    {
        Task SolvedTaskMessage(string solverLogin,int taskId,int teamId,int targetTeamId,bool Correctness,bool IsShotSuccessful);
        Task EndGameMessage(int gameId);
        Task PlayerConnected(string login);
        Task PlayerDisconnected(string login);
        Task PlayerIsOnline(string login);
    }
    [Authorize]
    public class GameHub:Hub<IGameClient>
    {
        ILogger logger;
        public GameHub(ILogger<GameHub> logger)
        {
            this.logger = logger;
        }
        public async Task ConnectToTheGame(int gameId,string playerLogin)
        {
            logger.LogInformation($"Игрок {playerLogin} присоединился к игре {gameId}");
            Clients.Group(gameId.ToString()).PlayerConnected(playerLogin);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
        }
        public async Task DisconnectFromGame(int gameId, string playerLogin)
        {
            logger.LogInformation($"Игрок {playerLogin} отсоединился от {gameId}");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId,gameId.ToString());
            Clients.Group(gameId.ToString()).PlayerDisconnected(playerLogin);
            
        }
        public void PlayerInGame(int gameId,string playerLogin)
        {
            Clients.Group(gameId.ToString()).PlayerIsOnline(playerLogin);
        }
    }
}