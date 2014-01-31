using System;

namespace Games.Models.WebSockets.Player
{
    public interface IPlayerWebSocketHandler
    {
        int PlayerId { get; }

        event EventHandler Joined;

        event EventHandler Left;

        event EventHandler<PlayerPosition> Moved;
    }
}