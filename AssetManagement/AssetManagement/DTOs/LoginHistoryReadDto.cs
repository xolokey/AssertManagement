namespace AssetManagement.DTOs
{
    public class LoginHistoryReadDto
    {
        public int LoginID { get; set; }
        public string UserName { get; set; }
        public DateTime LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public string JwtToken { get; set; }
    }
}
