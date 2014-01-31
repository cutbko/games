using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Games.Models.WebSockets.Game;
using Games.Models.WebSockets.Player;
using Microsoft.Web.WebSockets;

namespace Games.Models.WebSockets.Communications
{
    public class GameCommunicator : IGameCommunicator
    {
        private readonly GameWebSocketHandler _gameWebSocketHandler = 
                     new GameWebSocketHandler();

        private readonly ConcurrentDictionary<int, PlayerWebSocketHandler> _playerWebSocketHandlers;

        public GameCommunicator(int numberOfPlayers)
        {
            if (numberOfPlayers < 1)
            {   
                throw new ArgumentOutOfRangeException("numberOfPlayers", "must be more than 0");
            }

            NumberOfPlayers = numberOfPlayers;

            _playerWebSocketHandlers = new ConcurrentDictionary<int, PlayerWebSocketHandler>(Enumerable.Range(1, numberOfPlayers)
                                                                                                       .Select(playerId => new KeyValuePair<int, PlayerWebSocketHandler>(playerId, new PlayerWebSocketHandler(playerId))));

            foreach (var playerWebSocketHandler in _playerWebSocketHandlers.Values)
            {
                playerWebSocketHandler.Joined += (handler, __) => _gameWebSocketHandler.PlayerJoined(((IPlayerWebSocketHandler)handler).PlayerId);
                playerWebSocketHandler.Left += (handler, __) => _gameWebSocketHandler.PlayerLeft(((IPlayerWebSocketHandler)handler).PlayerId);
                playerWebSocketHandler.Moved += (handler, playerPosition) => _gameWebSocketHandler.PlayerMoved(((IPlayerWebSocketHandler)handler).PlayerId, playerPosition);
            }
        }

        public int NumberOfPlayers { get; private set; }

        public WebSocketHandler GameWebSocketHandler
        {
            get { return _gameWebSocketHandler; }
        }

        public WebSocketHandler GetPlayerWebSocketHandler(int playerId)
        {
            if (playerId < 1 || playerId > NumberOfPlayers)
            {
                throw new ArgumentOutOfRangeException("playerId", "Must be between 1 and " + NumberOfPlayers);
            }

            return _playerWebSocketHandlers.GetOrAdd(playerId, _ => new PlayerWebSocketHandler(playerId));
        }
    }
}