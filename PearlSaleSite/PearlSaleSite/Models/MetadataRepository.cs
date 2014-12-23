using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pearl.Sale.Models
{
    using System.IO;
    using System.Runtime.Serialization.Json;
    using System.Web.Script.Serialization;

    public class MetadataRepository : IMetadataRepository
    {
        private static List<Buyer> buyers = new List<Buyer>();
        private static List<Brand> brands = new List<Brand>();
        private static List<Store> stores = new List<Store>();
        private static List<Warehouse> warehouses = new List<Warehouse>();

        private static List<Currency> currencies = new List<Currency>();
        private static List<Product>  products = new List<Product>();

        static MetadataRepository()
        {
            buyers.Add(new Buyer(){Name="Su Zhang", Code="SZ"});
            buyers.Add(new Buyer() { Name = "Andy Jing", Code = "AJ" });
            brands.Add(new Brand(){Name="Coach", Code="CH"});
            brands.Add(new Brand() { Name = "Kate Spade", Code = "KS" });
            brands.Add(new Brand() { Name = "Michael Kors", Code = "MK" });
            stores.Add(new Store() {Name="Coach Premium", Code="CPM", Address = "jjjjjjj"});
            stores.Add(new Store() { Name = "Coach Auburn", Code = "CAB", Address = "jjjjjjj" });
            warehouses.Add(new Warehouse(){Name="Seattle", Code="SEA"});
            warehouses.Add(new Warehouse() { Name = "Chongqing", Code = "CQ" });
            warehouses.Add(new Warehouse() { Name = "Hebei", Code = "HB" });
            currencies.Add(new Currency(){Name="Dollar", Code="D"} );
            currencies.Add(new Currency() { Name = "REN", Code = "R" });
            products.Add(new Product(){Brand="CH", Name="aaa", Color="bbb", Size="20*30*14", Sku="8888888", StyleNo = "F25671 SV/KB"});
        }

        public IEnumerable<Buyer> GetBuyers()
        {
            return buyers;

        }

        public IEnumerable<Currency> GetCurrencies()
        {
            return currencies;
        }

        public IEnumerable<Brand> GetBrands()
        {
            return brands;
        }

        public IEnumerable<Store> GetStores()
        {
            return stores;
        }

        public IEnumerable<Product> GetProducts()
        {
            return products;
        }

        public IEnumerable<Warehouse> GetWarehouses()
        {
            return warehouses;
        }

        public string BrandJson
        {
            get
            {
                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(List<Brand>));                
                ser.WriteObject(stream1, brands);

                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);


                var r = sr.ReadToEnd();
               // r=r.Replace("/&quot;", "\"");

                return r;
                // var ser = new JavaScriptSerializer();


                // var json = new JavaScriptSerializer().Serialize(brands);
                // return json;
            }
        }
    }
}