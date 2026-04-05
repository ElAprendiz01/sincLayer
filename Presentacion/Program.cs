using System.Data.Common;
using infrastructure;
using infrastructure.DB;
using application.Interfaces;
using infrastructure.Repository;
using application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Servicios al contenedor
builder.Services.AddControllers();

// Configuración de CORS
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});

// Conexión base de datos 
var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddSingleton(new DBconexionfactory(connectionString!));

// Configuración JWT
var jwtKey = builder.Configuration["Jwt:Key"];
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
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Inyección de servicios
builder.Services.AddScoped<IautoresRepository, AutoresRepository>();
builder.Services.AddScoped<AutoresServices>();
builder.Services.AddScoped<ITipo_Catalogo_Repository, Cls_Tipo_Catalogo_Repository>();
builder.Services.AddScoped<Cls_Tipo_Catalogo_Services>();
builder.Services.AddScoped<ImultasRepository, MultasRepository>();
builder.Services.AddScoped<MultasServices>();
builder.Services.AddScoped<IDevolucionesRepository, DevolucionesRepository>();
builder.Services.AddScoped<DevolucionesServices>();
builder.Services.AddScoped<IPrestamosRepository, PrestamosRepository>();
builder.Services.AddScoped<PrestamosServices>();
builder.Services.AddScoped<IEstdoRepositorio, EstatdoRepository>();
builder.Services.AddScoped<EsatdosServices>();
builder.Services.AddScoped<IDatos_Personales_Repository, Datos_Personales_Repository>();
builder.Services.AddScoped<Datos_Personales_Services>();
builder.Services.AddScoped<ICatalogoRepositorio, CatalogoRepository>();
builder.Services.AddScoped<CatalogoServices>();
builder.Services.AddScoped<IContacto_Repository, Contacto_Repository>();
builder.Services.AddScoped<Contacto_Services>();
builder.Services.AddScoped<IDireccionRepository, DireccionRepository>();
builder.Services.AddScoped<DireccionServices>();
builder.Services.AddScoped<IRolRepository, RolRepository>();
builder.Services.AddScoped<rolservice>();
builder.Services.AddScoped<IUsuarioRepository, UsarioRepositoy>();
builder.Services.AddScoped<UsuarioServices>();
builder.Services.AddScoped<ILibrosRepository, LibrosRepository>();
builder.Services.AddScoped<LibrosService>();
builder.Services.AddScoped<IAcuerdos_Pago_Repository, Acuerdos_Pagos_Repository>();
builder.Services.AddScoped<Acuerdos_Pago_Services>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


app.UseCors("AllowAll"); // Primero CORS

app.UseSwagger();
app.UseSwaggerUI(s =>
{
    s.SwaggerEndpoint("/swagger/v1/swagger.json", "Api syncLayer");
    s.RoutePrefix = string.Empty;
});

app.UseAuthentication();
app.UseAuthorization(); // Único punto de autorización

app.MapControllers();

app.Run();