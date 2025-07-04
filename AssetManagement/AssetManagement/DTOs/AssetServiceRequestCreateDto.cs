namespace AssetManagement.DTOs
{
    public class AssetServiceRequestCreateDto
    {
        public int EmployeeID { get; set; }
        public int AssetID { get; set; }
        public string IssueType { get; set; } // e.g., "Malfunction", "Repair"
        public string Description { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } // e.g., "Pending", "InProgress", "Completed"
    }
}
