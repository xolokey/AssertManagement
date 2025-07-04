namespace AssetManagement.DTOs
{
    public class EmployeeAssetAllocationReadDto
    {
        public int AllocationID { get; set; }

        /* ▶️  New identifiers so React can filter accurately  */
        public int EmployeeID { get; set; }
        public int AssetID { get; set; }

        /* Existing display fields */
        public string EmployeeName { get; set; }
        public string AssetNo { get; set; }   // optional but useful
        public string AssetName { get; set; }
        public DateTime AllocationDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; }
    }
}
