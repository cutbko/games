using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;
using MessagingToolkit.QRCode.Codec;

namespace Games.Controllers
{
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Qr()
        {
            var qrCodeEncoder = new QRCodeEncoder();
            Bitmap bitmap = qrCodeEncoder.Encode("http://google.com/");
            var memoryStream = new MemoryStream();
            bitmap.Save(memoryStream, ImageFormat.Png);
            memoryStream.Position = 0;

            return File(memoryStream, "image/png", "Zalupa");
        }
    }
}