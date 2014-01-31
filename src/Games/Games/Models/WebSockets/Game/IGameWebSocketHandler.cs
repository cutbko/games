namespace Games.Models.WebSockets.Game
{
    public interface IGameWebSocketHandler
    {
        void PlayerJoined(int playerId);

        void PlayerLeft(int playerId);

        void PlayerMoved(int playerId, PlayerPosition position);
    }
}