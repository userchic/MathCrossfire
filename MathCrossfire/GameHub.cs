using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MathCrossfire.Abstractions;
using MathCrossfire.Models;
namespace GameHubSpace
{
    public interface IGameClient
    {
        Task SolvedTaskMessage(int taskId,int teamId,int targetTeamId,bool Correctness,bool IsShotSuccessful);
        Task EndGameMessage(int gameId);
        Task PlayerConnected(string login);
        Task PlayerDisconnected(string login);
    }
    [Authorize (Roles="Игрок")]
    public class GameHub:Hub<IGameClient>
    {
        public async Task ConnectToTheGame(int gameId,string playerLogin)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            Clients.Group(gameId.ToString()).PlayerConnected(playerLogin);
        }
        public async Task DisconnectFromGame(int gameId, string playerLogin)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId,gameId.ToString());
            Clients.Group(gameId.ToString()).PlayerDisconnected(playerLogin);
        }
    }
}