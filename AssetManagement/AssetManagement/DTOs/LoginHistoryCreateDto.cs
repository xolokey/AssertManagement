namespace AssetManagement.DTOs
{
    public class LoginHistoryCreateDto
    {
        public int UserID { get; set; }
        public DateTime LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public string JwtToken { get; set; }
    }
}
