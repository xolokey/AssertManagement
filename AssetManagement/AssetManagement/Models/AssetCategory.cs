namespace AssetManagement.Models
{
    public class AssetCategory
    {
        public int AssetCategoryID { get; set; }
        public string CategoryName { get; set; }

        public ICollection<Asset>? Assets { get; set; }

    }

}
