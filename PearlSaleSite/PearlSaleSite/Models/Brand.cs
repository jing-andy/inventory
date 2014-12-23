namespace Pearl.Sale.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class Brand
    {
        [DataMember(Name="display")]
        public string Name { get; set; }

        [DataMember(Name="value")]
        public string Code { get; set; }
    }
}