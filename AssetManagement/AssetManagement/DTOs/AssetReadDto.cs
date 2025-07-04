namespace AssetManagement.DTOs
{
    public class AssetReadDto
    {
        public int AssetID { get; set; }
        public string AssetNo { get; set; }
        public string? AssetName { get; set; }
        public string? AssetModel { get; set; }
        public string AssetStatus { get; set; }
        public decimal? AssetValue { get; set; }
        public string? ImageURL { get; set; }
        public string CategoryName { get; set; }  // comes from related AssetCategory
    }
}
