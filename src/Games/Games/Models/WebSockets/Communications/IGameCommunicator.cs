using Microsoft.Web.WebSockets;

namespace Games.Models.WebSockets.Communications
{
    public interface IGameCommunicator
    {
        int NumberOfPlayers { get; }

        WebSocketHandler GameWebSocketHandler { get; }

        WebSocketHandler GetPlayerWebSocketHandler(int playerId);
    }
}