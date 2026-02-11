using System.Data.Common;
using infrastructure;
using infrastructure.DB;
using application.Interfaces;
using infrastructure.Repository;
using application.Services;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//conexio base de datos 

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddSingleton(new DBconexionfactory(connectionString!));

builder.Services.AddScoped<ITipo_Catalogo_Repository, Cls_Tipo_Catalogo_Repository>();
builder.Services.AddScoped<Cls_Tipo_Catalogo_Services>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ajuste cors 
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowAnyOrigin();

    });
      
        
});

var app = builder.Build();


 //swagger
 app.UseSwagger();
app.UseSwaggerUI(s =>
{
  s.SwaggerEndpoint( "/swagger/v1/swagger.json", "Api syncLayer");
    s.RoutePrefix = string.Empty;

});
if (app.Environment.IsDevelopment())
{
    app.MapSwagger();
}

app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
