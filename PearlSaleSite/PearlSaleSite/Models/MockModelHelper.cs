using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pearl.Sale.Models
{
    public static class MockModelHelper
    {                                       
        public static List<KeyValuePair<string, string>> GetWarehoues()
        {
            var warehouses = new List<KeyValuePair<string, string>>();
            warehouses.Add(new KeyValuePair<string, string>("Seattle", "SEA"));
            warehouses.Add(new KeyValuePair<string, string>("Chongqing", "CQ"));
            warehouses.Add(new KeyValuePair<string, string>("Hebei", "HB"));

            return warehouses;
        }

        public static List<KeyValuePair<string, string>> GetBrands()
        {
            var brands = new List<KeyValuePair<string, string>>();
            brands.Add(new KeyValuePair<string, string>("Coach", "CH"));
            brands.Add(new KeyValuePair<string, string>("Kate Spade", "KS"));
            brands.Add(new KeyValuePair<string, string>("Michael Kors", "MK"));

            return brands;
        }

        public static List<KeyValuePair<string, string>> GetShipStatus()
        {
            var status = new List<KeyValuePair<string, string>>();
            status.Add(new KeyValuePair<string, string>("Packing", "PK"));
            status.Add(new KeyValuePair<string, string>("Shipping", "SP"));
            status.Add(new KeyValuePair<string, string>("Arrived", "AR"));

            return status;
        }

        public static List<KeyValuePair<string, string>> GetShippers()
        {
            var shippers = new List<KeyValuePair<string, string>>();
            shippers.Add(new KeyValuePair<string, string>("Feiyang", "FY"));
            shippers.Add(new KeyValuePair<string, string>("Xunyun", "XY"));            
            return shippers;
        }
    }
}