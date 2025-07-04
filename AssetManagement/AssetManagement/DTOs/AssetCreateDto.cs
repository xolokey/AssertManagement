namespace AssetManagement.DTOs
{
    public class AssetCreateDto
    {
        public string AssetNo { get; set; }
        public string? AssetName { get; set; }
        public int AssetCategoryID { get; set; }
        public string? AssetModel { get; set; }
        public DateTime? ManufacturingDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? AssetValue { get; set; }
        public string AssetStatus { get; set; } = "Available";
        public string? ImageURL { get; set; }
    }
}
