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

        public ViewResult Index()
        {
            ViewBag.GameName = "Ping Pong";
            ViewBag.GameId = RandomString(5);
            return View();
        }

        public ViewResult PlayerControl(string gameId, int playerId)
        {
            ViewBag.GameId = gameId;
            ViewBag.PlayerId = playerId;

            return View("PlayerControl");
        }

        public ActionResult Player1JoinQr(string gameId)
        {
            return Qr(Url.Action("PlayerControl", "PingPong", new { gameId = gameId, playerId = 1 }, Request.Url.Scheme));
        }

        public ActionResult Player2JoinQr(string gameId)
        {
            return Qr(Url.Action("PlayerControl", "PingPong", new { gameId = gameId, playerId = 2 }, Request.Url.Scheme));
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
    }
}