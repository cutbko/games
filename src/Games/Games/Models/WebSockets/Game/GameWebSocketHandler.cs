using Microsoft.Web.WebSockets;
using Newtonsoft.Json;

namespace Games.Models.WebSockets.Game
{
    public class GameWebSocketHandler : WebSocketHandler, IGameWebSocketHandler
    {
        public void PlayerJoined(int playerId)
        {
            string playerJoinEncoded = JsonConvert.SerializeObject(new PlayerJoinAction { PlayerId = playerId });
            Send(playerJoinEncoded);
        }

        public void PlayerLeft(int playerId)
        {
            string playerLeftEncoded = JsonConvert.SerializeObject(new PlayerLeftAction { PlayerId = playerId });
            Send(playerLeftEncoded);
        }

        public void PlayerMoved(int playerId, PlayerPosition position)
        {
            string playerMoveEncoded = JsonConvert.SerializeObject(new PlayerMoveAction { Position = position, PlayerId = playerId });
            Send(playerMoveEncoded);
        }
    }
}