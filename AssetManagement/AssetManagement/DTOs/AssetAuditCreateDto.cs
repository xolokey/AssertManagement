namespace AssetManagement.DTOs
{
    public class AssetAuditCreateDto
    {
        public int AssetID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }  // "Pending", "Verified", "Rejected"
    }
}
