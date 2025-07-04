using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AssetManagement.Models
{
    public class Asset
    {
        [Key]
        public int AssetID { get; set; }

        [Required]
        [StringLength(50)]
        public string AssetNo { get; set; } = string.Empty;

        [StringLength(100)]
        public string? AssetName { get; set; }

        [Required]
        public int AssetCategoryID { get; set; }

        public AssetCategory? AssetCategory { get; set; }

        [StringLength(100)]
        public string? AssetModel { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ManufacturingDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ExpiryDate { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal? AssetValue { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))] // 👈 key line for enum deserialization
        public AssetStatus AssetStatus { get; set; } = AssetStatus.Available;

        public string? ImageURL { get; set; }

        // Navigation properties
        public ICollection<EmployeeAssetAllocation>? Allocations { get; set; }
        public ICollection<AssetAudit>? Audits { get; set; }
        public ICollection<AssetServiceRequest>? ServiceRequests { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))] // 👈 optional, adds extra safety
    public enum AssetStatus
    {
        Available,
        Borrowed,
        InService,
        Damaged,
        Retired
    }
}
