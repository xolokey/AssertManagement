using System;
using System.Collections.Generic;

namespace AssetManagement.Models
{
    public class Employee
    {
        /* ─────────── Core fields ─────────── */
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public DateTime DateCreated { get; set; }

        /* ─────────── NEW: Password‑reset support ─────────── */
        public string? ResetToken { get; set; }      // GUID string
        public DateTime? ResetTokenExpiry { get; set; }      // UTC expiry

        /* ─────────── Navigation collections ─────────── */
        public ICollection<EmployeeAssetAllocation>? AssetAllocations { get; set; }
        public ICollection<AssetServiceRequest>? ServiceRequests { get; set; }
        public ICollection<AssetAudit>? AssetAudits { get; set; }
        public ICollection<LoginHistory>? LoginHistories { get; set; }
    }
}
