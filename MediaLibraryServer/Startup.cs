using DBProviderBase.Classes;
using DBProviderBase.Enums;
using ImageComparisonService.Interfaces;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using MySQLProvider.Services;
using SQLiteProvider.Services;
using System;

namespace MediaLibraryServer {
    public class Startup {
        private const string msgDataStoreTypeError = "Not supported data store type";
        private readonly string AppSettingsKey = "AppSettings";
        private readonly string AllowAllCors = "AllowAllCors";
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            ConnectionSettings connectionSettings = new ConnectionSettings();

            services.Configure<ConnectionSettings>(Configuration.GetSection(typeof(ConnectionSettings).Name));

            DBProviderType dataStoreType = (DBProviderType)Enum.Parse(typeof(DBProviderType), Configuration.GetSection($"{typeof(ConnectionSettings).Name}:DataStoreType").Value.ToString());

            services.AddMvc();            
            switch (dataStoreType) {
                case DBProviderType.MySQLProvider:
                    services.AddSingleton<IDataService, MySqlDataClient>();
                    break;
                case DBProviderType.SQLiteProvider:
                    services.AddSingleton<IDataService, SQLiteClient>();
                    break;
                default:
                    throw new Exception(msgDataStoreTypeError);
            }

            services.AddSingleton<IConfigService, ConfigService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<IMemoryCache, MemoryCache>();
            

            services.AddScoped<ILibraryManagerService, LibraryManagerService>();
            services.AddScoped<IFileProcessorService, FileProcessorService>();

            services.AddScoped<IVideoLibraryService, VideoGalleryService>();
            services.AddScoped<IVideoStreamService, VideoStreamService>();

            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<IImageGalleryService, ImageGalleryService>();            
            services.AddScoped<IImageComparisonService, ImageComparisonService.Services.ImageComparisonService>();

            services.AddControllers();

            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            });

            services.AddCors(options => {
                options.AddPolicy(AllowAllCors, builder => {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });
            services.AddApplicationInsightsTelemetry();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = string.Empty;
            });

            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors(AllowAllCors);

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
