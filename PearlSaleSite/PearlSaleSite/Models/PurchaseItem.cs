using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pearl.Sale.Models
{
    public class PurchaseItem
    {
        public Product Product { get; set; }

        public int Quantity { get; set; }

        public float ListPrice { get; set; }

        public float Price { get; set; }

        public bool HasTax { get; set; }
    }
}