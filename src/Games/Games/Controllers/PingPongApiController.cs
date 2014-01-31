using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Games.Models;
using Games.Models.WebSockets;
using Games.Models.WebSockets.Game;
using Microsoft.Web.WebSockets;

namespace Games.Controllers
{
    public class PingPongApiController : ApiController
    {
        private static readonly ConcurrentDictionary<string, GameWebSocketHandler> _gameWebSocketHandlers =
                            new ConcurrentDictionary<string, GameWebSocketHandler>();

        public HttpResponseMessage Get(string gameId)
        {
            if (HttpContext.Current.IsWebSocketRequest && _gameWebSocketHandlers.TryAdd(gameId, new GameWebSocketHandler()))
            {
                HttpContext.Current.AcceptWebSocketRequest(_gameWebSocketHandlers[gameId]);

                return Request.CreateResponse(HttpStatusCode.SwitchingProtocols);
            }

            return Request.CreateErrorResponse(HttpStatusCode.Conflict, "game has been already connected to the server");
        }

        [HttpGet]
        [ActionName("PlayerJoined")]
        public HttpResponseMessage PlayerJoined(string gameId, int playerId)
        {
            GameWebSocketHandler handler;
            if (_gameWebSocketHandlers.TryGetValue(gameId, out handler))
            {
                handler.PlayerJoined(playerId);
                return Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }
    }
}
