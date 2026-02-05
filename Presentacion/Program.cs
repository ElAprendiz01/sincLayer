using System.Data.Common;
using infrastructure;
using infrastructure.DB;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//conexio base de datos 

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddSingleton(new DBconexionfactory(connectionString!));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ajuste cors 
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();

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

app.UseAuthorization();

app.MapControllers();

app.Run();
