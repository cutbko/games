using System;
using System.Collections.Concurrent;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using Games.Models;
using MessagingToolkit.QRCode.Codec;
using Microsoft.Web.WebSockets;

namespace Games.Controllers
{
    public class PingPongController : Controller
    {
        private static readonly Random _rng = new Random();
        private const string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        private static readonly ConcurrentDictionary<string, GameWebSocketHandler> _gameWebSocketHandlers = 
                            new ConcurrentDictionary<string, GameWebSocketHandler>();

        public ActionResult Index()
        {
            ViewBag.GameName = "Ping Pong";
            ViewBag.GameId = RandomString(5);
            _gameWebSocketHandlers.TryAdd(ViewBag.GameId, new GameWebSocketHandler());
            return View();
        }

        public HttpResponseMessage Subscribe(string gameId)
        {
            GameWebSocketHandler handler;
            if (_gameWebSocketHandlers.TryGetValue(gameId, out handler))
            {
                System.Web.HttpContext.Current.AcceptWebSocketRequest(handler);
                return new HttpResponseMessage(HttpStatusCode.SwitchingProtocols);
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }
        
        public ActionResult PlayerJoin(string gameId, byte playerId)
        {
            GameWebSocketHandler handler;
            if (_gameWebSocketHandlers.TryGetValue(gameId, out handler))
            {
                handler.PlayerJoined(playerId);
                return View("PlayerControl");
            }

            return HttpNotFound();
        }

        public ActionResult Player1JoinQr(string gameId)
        {
            return Qr(Url.Action("PlayerJoin", "PingPong", new { gameId = gameId, playerId = 1 }, Request.Url.Scheme));
        }

        public ActionResult Player2JoinQr(string gameId)
        {
            return Qr(Url.Action("PlayerJoin", "PingPong", new { gameId = gameId, playerId = 2 }, Request.Url.Scheme));
        }

        private ActionResult Qr(string uri)
        {
            var qrCodeEncoder = new QRCodeEncoder();
            Bitmap bitmap = qrCodeEncoder.Encode(uri);
            var memoryStream = new MemoryStream();
            bitmap.Save(memoryStream, ImageFormat.Png);
            memoryStream.Position = 0;

            return File(memoryStream, "image/png");
        }
        
        private static string RandomString(int size)
        {
            var buffer = new char[size];

            for (int i = 0; i < size; i++)
            {
                buffer[i] = _chars[_rng.Next(_chars.Length)];
            }

            return new string(buffer);
        }

        class GameWebSocketHandler : WebSocketHandler
        {
            public void PlayerJoined(int playerId)
            {
                string playerJoinEncoded = System.Web.Helpers.Json.Encode(new PlayerJoinAction { PlayerId = playerId });
                Send(playerJoinEncoded);
            }
        }
    }
}