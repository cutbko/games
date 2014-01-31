using System;
using Microsoft.Web.WebSockets;
using Newtonsoft.Json;

namespace Games.Models.WebSockets.Player
{
    class PlayerWebSocketHandler : WebSocketHandler, IPlayerWebSocketHandler
    {
        public PlayerWebSocketHandler(int playerId)
        {
            PlayerId = playerId;
        }

        public int PlayerId { get; private set; }

        public event EventHandler Joined;

        public event EventHandler Left;

        public event EventHandler<PlayerPosition> Moved;

        protected virtual void OnLeft()
        {
            EventHandler handler = Left;
            if (handler != null) handler(this, EventArgs.Empty);
        }

        protected virtual void OnMoved(PlayerPosition e)
        {
            EventHandler<PlayerPosition> handler = Moved;
            if (handler != null) handler(this, e);
        }

        protected virtual void OnJoined()
        {
            EventHandler handler = Joined;
            if (handler != null) handler(this, EventArgs.Empty);
        }

        public override void OnOpen()
        {
            base.OnOpen();

            OnJoined();
        }

        public override void OnClose()
        {
            base.OnClose();

            OnLeft();
        }

        public override void OnMessage(string message)
        {
            base.OnMessage(message);

            var playerPosition = JsonConvert.DeserializeObject<PlayerPosition>(message);

            OnMoved(playerPosition);
        }
    }
}