using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using AssetManagement.Services.Implementations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

namespace AssetManagement
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            /* ────────────── 1.  CORS  ────────────── */
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            /* ────────────── 2.  Controllers + JSON  ────────────── */
            builder.Services.AddControllers()
                .AddJsonOptions(opts =>
                {
                    opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
                    opts.JsonSerializerOptions.WriteIndented = true;
                });

            /* ────────────── 3.  EF Core DbContext  ────────────── */
            builder.Services.AddDbContext<EFCoreDbContext>();
            // ^ ensure you have a "DefaultConnection" in appsettings.json

            /* ────────────── 4.  Domain Services  ────────────── */
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();
            builder.Services.AddScoped<IAssetService, AssetService>();
            builder.Services.AddScoped<IAssetCategoryService, AssetCategoryService>();
            builder.Services.AddScoped<IEmployeeAssetAllocationService, EmployeeAssetAllocationService>();
            builder.Services.AddScoped<IAssetAuditService, AssetAuditService>();
            builder.Services.AddScoped<IAssetServiceRequestService, AssetServiceRequestService>();
            builder.Services.AddScoped<ILoginHistoryService, LoginHistoryService>();

            /* ────────────── 5.  SMTP & Email  ────────────── */
            builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
            builder.Services.AddScoped<IEmailService, EmailService>();


            /* ────────────── 6.  JWT Auth  ────────────── */
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

            /* ────────────── 7.  Swagger  ────────────── */
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "AssetManagement", Version = "v1" });

                // JWT in Swagger
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' + space + token"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id   = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            /* ────────────── 8.  Build & Pipeline  ────────────── */
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();          // JWT
            app.UseCors("AllowFrontend");     // CORS
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}
