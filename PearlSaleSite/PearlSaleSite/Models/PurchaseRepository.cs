using System;
using System.Collections.Generic;
using Pearl.Sale.Models.DTO;

namespace Pearl.Sale.Models
{
    using System.Linq;

    public class PurchaseRepository : IPurchaseRepository
    {
       
        private static List<Purchase>  purchases = new List<Purchase>();

      
        public IEnumerable<PurchaseView> GetPurchases()
        {
            return purchases.Select(buy => new PurchaseView(buy)).ToList();
        }

        public string AddPurchase(PurchaseView buyInput)
        {
            throw new NotImplementedException();
        }
    }
}