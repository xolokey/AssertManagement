using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Models
{
    public class AssetAudit
    {
        [Key]
        public int AuditID { get; set; }

        [Required]
        public int AssetID { get; set; }

        [Required]
        public int EmployeeID { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        // Navigation properties
        [ForeignKey("AssetID")]
        public Asset? Asset { get; set; }

        [ForeignKey("EmployeeID")]
        public Employee? Employee { get; set; }
    }
}
