﻿using System;
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

        public ActionResult ShipInput()
        {
            var model = new ShipInputModel();

            model.Warehouses = MockModelHelper.GetWarehoues();
            model.Shippers = MockModelHelper.GetShippers();
            model.Status = MockModelHelper.GetShipStatus();


            return View(model);
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
