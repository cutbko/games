using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;
using MessagingToolkit.QRCode.Codec;

namespace Games.Controllers
{
    public class PingPongController : Controller
    {
        private static readonly Random _rng = new Random();
        private const string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public ActionResult Index()
        {
            ViewBag.GameName = "Ping Pong";
            ViewBag.GameId = RandomString(5);
            return View();
        }

        //public HttpResponseMessage Subscribe()
        //{
        //}
        
        public ActionResult PlayerJoin(string gameId, byte playerId)
        {
            return View("PlayerControl");
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
    }
}