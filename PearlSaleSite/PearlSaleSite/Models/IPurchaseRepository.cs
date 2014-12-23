using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Pearl.Sale.Models.DTO;

namespace Pearl.Sale.Models
{
    interface IPurchaseRepository
    {
        IEnumerable<PurchaseView> GetPurchases();

        string AddPurchase(PurchaseView buyInput);  

    }
}
