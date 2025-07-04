namespace AssetManagement.DTOs
{
    public class AssetServiceRequestReadDto
    {
        public int ServiceRequestID { get; set; }
        public int EmployeeID { get; set; }           
        public int AssetID { get; set; }
        public string EmployeeName { get; set; }
        public string AssetName { get; set; }
        public string IssueType { get; set; }
        public string Description { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
    }
}
