using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VideoProcessorService.Interfaces;

namespace MediaLibraryServer {
    public class Program {
        public static IVideoConversionService videoConversionService;
        public static async System.Threading.Tasks.Task Main(string[] args) {
            IHost host = CreateHostBuilder(args).Build();

            using (IServiceScope serviceScope = host.Services.CreateScope()) {
                //Services that need to run at application start
                ILibraryManagerService libraryManagerService = serviceScope.ServiceProvider.GetRequiredService<ILibraryManagerService>();
                videoConversionService = serviceScope.ServiceProvider.GetRequiredService<IVideoConversionService>();
                await host.RunAsync();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.ConfigureAppConfiguration((hostingContext, config) => {
                        config.AddJsonFile("appsettings.json", false, true);
                    });
                    webBuilder.UseStartup<Startup>();
                });
    }
}
