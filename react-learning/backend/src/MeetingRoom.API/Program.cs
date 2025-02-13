using MeetingRoom.API.Middlewares;
using MeetingRoom.Core.Converters;
using MeetingRoom.Core.Entities;
using MeetingRoom.Core.ModelBindings;
using MeetingRoom.Core.Models;
using MeetingRoom.Core.Services;
using MeetingRoom.Infrastructure.Repositories;
using MeetingRoom.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SqlSugar;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    options.ModelBinderProviders.Insert(0, new QueryParameterBinderProvider());
    options.Filters.Add<GlobalExceptionFilter>();
})
.AddJsonOptions(cfg =>
{
    cfg.JsonSerializerOptions.Converters.Add(new BigIntJsonConverter());
    cfg.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
    cfg.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSetting:Issuer"],
            ValidAudience = builder.Configuration["JwtSetting:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSetting:Secret"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build()
   );
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        policyBuilder.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>())
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });

});

// Register Services
builder.Services.AddScoped<ISqlSugarClient, SqlSugarClient>(sp =>
{
    var sqlSugarClient = new SqlSugarClient(new ConnectionConfig()
    {
        DbType = DbType.PostgreSQL,
        InitKeyType = InitKeyType.Attribute,
        IsAutoCloseConnection = true,
        ConnectionString = builder.Configuration["ConnectionStrings:Default"]
    });

    return sqlSugarClient;
});
builder.Services.AddScoped(typeof(SimpleClient<>));
builder.Services.AddScoped(typeof(CrudBaseService<>));
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddScoped<IBookingService, BookingService>();

builder.Services.Configure<JwtSetting>(builder.Configuration.GetSection(nameof(JwtSetting)));
builder.Services.AddHttpContextAccessor();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Meeting Room API", Version = "v1" });

    // Configure JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 自动创建数据库和表
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ISqlSugarClient>();
    db.DbMaintenance.CreateDatabase();
    db.CodeFirst.InitTables(
        typeof(User),
        typeof(Room),
        typeof(Booking)
    );
}

app.Run();