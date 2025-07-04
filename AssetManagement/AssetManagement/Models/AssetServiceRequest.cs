using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Models
{
    public class AssetServiceRequest
    {
        [Key]
        public int ServiceRequestID { get; set; }

        [Required]
        public int EmployeeID { get; set; }

        [Required]
        public int AssetID { get; set; }

        [Required]
        [StringLength(50)]
        public string IssueType { get; set; }

        public string? Description { get; set; }

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
