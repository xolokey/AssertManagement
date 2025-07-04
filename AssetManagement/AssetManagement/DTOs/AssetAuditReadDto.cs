namespace AssetManagement.DTOs
{
    public class AssetAuditReadDto
    {
        public int AuditID { get; set; }
        public string AssetName { get; set; }
        public string EmployeeName { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
    }
}
