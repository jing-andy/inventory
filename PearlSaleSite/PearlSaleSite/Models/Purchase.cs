using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pearl.Sale.Models
{
    public class Purchase
    {
        public string Id { get; set; }
        public DateTime Date { get; set; }

        public string Buyer { get; set; }
        public string Store { get; set; }

        public float Fee { get; set; }

        public IEnumerable<PurchaseItem> Items { get; set; }

    }
}