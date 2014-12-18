using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;

namespace Pearl.Sale.Models
{

    public class ShipInputModel
    {
        public List<KeyValuePair<string, string>> Warehouses { get; set; }
        public List<KeyValuePair<string, string>> Currencies { get; set; }
        public List<KeyValuePair<string, string>> Status { get; set; }
        public List<KeyValuePair<string, string>> Shippers { get; set; }
        public List<KeyValuePair<string, string>> Brands { get; set; }
    }
}
