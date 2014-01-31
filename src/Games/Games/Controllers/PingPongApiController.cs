using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Games.Models.WebSockets.Communications;
using Microsoft.Web.WebSockets;

namespace Games.Controllers
{
    public class PingPongApiController : ApiController
    {
        private static readonly ConcurrentDictionary<string, IGameCommunicator> _games =
                            new ConcurrentDictionary<string, IGameCommunicator>();

        [HttpGet]
        public HttpResponseMessage ConnectGame(string gameId)
        {
            if (HttpContext.Current.IsWebSocketRequest && _games.TryAdd(gameId, new GameCommunicator(2)))
            {
                HttpContext.Current.AcceptWebSocketRequest(_games[gameId].GameWebSocketHandler);
                return Request.CreateResponse(HttpStatusCode.SwitchingProtocols);
            }

            return Request.CreateErrorResponse(HttpStatusCode.Conflict, "game has been already connected to the server");
        }

        [HttpGet]
        public HttpResponseMessage ConnectPlayer(string gameId, int playerId)
        {
            IGameCommunicator gameCommunicator;
            if (_games.TryGetValue(gameId, out gameCommunicator))
            {
                HttpContext.Current.AcceptWebSocketRequest(gameCommunicator.GetPlayerWebSocketHandler(playerId));
                return Request.CreateResponse(HttpStatusCode.SwitchingProtocols);
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }
    }
}
