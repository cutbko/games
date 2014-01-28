using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;
using MessagingToolkit.QRCode.Codec;

namespace Games.Controllers
{
    public class PingPongController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.GameName = "Ping Pong";
            return View();
        }

        //public HttpResponseMessage Subscribe()
        //{
        //}
        
        public ActionResult PlayerJoin(byte playerId)
        {
            return View("PlayerControl");
        }

        public ActionResult Player1JoinQr()
        {
            return Qr(Url.Action("PlayerJoin", "PingPong", new { playerId = 1 }, Request.Url.Scheme));
        }
        
        public ActionResult Player2JoinQr()
        {
            return Qr(Url.Action("PlayerJoin", "PingPong", new { playerId = 2 }, Request.Url.Scheme));
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
    }
}