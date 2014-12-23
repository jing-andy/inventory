using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pearl.Sale.Models
{
    interface IMetadataRepository
    {
        IEnumerable<Buyer> GetBuyers();

        IEnumerable<Currency> GetCurrencies();

        IEnumerable<Brand> GetBrands();

        IEnumerable<Store> GetStores();

        IEnumerable<Product> GetProducts();

        IEnumerable<Warehouse> GetWarehouses();

    }
}
