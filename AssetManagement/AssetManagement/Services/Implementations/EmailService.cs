using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;

namespace AssetManagement.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtp;

        public EmailService(IOptions<SmtpSettings> smtpOptions)
        {
            _smtp = smtpOptions.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MailMessage
                {
                    From = new MailAddress(_smtp.FromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(_smtp.Host, _smtp.Port)
                {
                    EnableSsl = _smtp.EnableSSL,
                    UseDefaultCredentials = false,                          // <-- added (best practice)
                    Credentials = string.IsNullOrWhiteSpace(_smtp.Username)
                                            ? CredentialCache.DefaultNetworkCredentials
                                            : new NetworkCredential(_smtp.Username, _smtp.Password)
                };

                await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
