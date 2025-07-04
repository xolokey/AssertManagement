using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetManagement.Models
{
    public class LoginHistory
    {
        [Key]
        public int LoginID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public DateTime LoginTime { get; set; }

        public DateTime? LogoutTime { get; set; }

        public string? JWTToken { get; set; }

        [ForeignKey("UserID")]
        public Employee? User { get; set; }
    }
}
