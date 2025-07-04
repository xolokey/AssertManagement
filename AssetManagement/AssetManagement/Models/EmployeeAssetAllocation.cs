using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Models
{
    public class EmployeeAssetAllocation
    {
        [Key]
        public int AllocationID { get; set; }

        [Required]
        public int EmployeeID { get; set; }

        [Required]
        public int AssetID { get; set; }

        [Required]
        public DateTime AllocationDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Allocated";

        // Navigation properties (nullable to avoid circular serialization issues)
        [ForeignKey("EmployeeID")]
        public Employee? Employee { get; set; }

        [ForeignKey("AssetID")]
        public Asset? Asset { get; set; }
    }
}
