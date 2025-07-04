namespace AssetManagement.DTOs
{
    public class EmployeeAssetAllocationCreateDto
    {
        public int EmployeeID { get; set; }
        public int AssetID { get; set; }
        public DateTime AllocationDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; }  // e.g., "Allocated", "Returned"
    }
}
