using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Pearl.Sale.Models.DTO
{
    [DataContract]
    public class PurchaseView
    {
        public PurchaseView(Purchase buy)
        {
            this.Date = buy.Date;
            this.Buyer = buy.Buyer;
            this.Fee = buy.Fee;
            this.Store = buy.Store;
            List<PurchaseItemView> items = new List<PurchaseItemView>();

            foreach (var a  in buy.Items)
            {

                var item = new PurchaseItemView()
                {
                    Sku = a.Product.Sku,
                    Quantity = a.Quantity,
                    ListPrice = a.ListPrice,
                    Price = a.Price,
                    HasTax = a.HasTax,
                };

                items.Add(item);
            }

        }

        [DataMember(Name = "date")]
        public DateTime Date { get; set; }

        [DataMember(Name = "store")]
        public string Store { get; set; }

        [DataMember(Name = "buyer")]
        public string Buyer { get; set; }

        [DataMember(Name = "fee")]
        public float Fee { get; set; }

        [DataMember(Name = "products")]
        public IEnumerable<PurchaseItemView> Items { get; set; }         
    }

    [DataContract]
    public class PurchaseItemView 
    {
        [DataMember(Name="sku")]
        public string Sku { get; set; }

        [DataMember(Name = "quantity")]
        public int Quantity { get; set; }

        [DataMember(Name = "listprice")]
        public float ListPrice { get; set; }

        [DataMember(Name = "price")]
        public float Price { get; set; }

        [DataMember(Name = "hastax")]
        public bool HasTax { get; set; }

    }
}