using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pearl.Sale.Models;

namespace Pearl.Sale.Controllers
{
    public class HomeController : Controller
    {        
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to ASP.NET MVC!";

            return View();
        }

        public ActionResult PurchaseInput()
        {
            var model = new MetadataRepository();            

            return View(model);
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
