using System;
using System.Threading.Tasks;
using VideoProcessorService.Services;

namespace TestBench {
    class Program {
        static async Task Main(string[] args) {
            Console.WriteLine("Hello World!");
            VideoConversionService videoConversionService = new VideoConversionService();
            string input = @"H:\Code Repo\VideoProcessorTestApp\VideoProcessorTestApp\VideoProcessorTestApp\VideoIn\[HR] Hajimete no Gal 01 [1080p][x265].mkv";
            string output = @"H:\Code Repo\VideoProcessorTestApp\VideoProcessorTestApp\VideoProcessorTestApp\VideoOut";

            Task cancelTask = Task.Run(() => {
                while (Console.ReadKey().Key != ConsoleKey.Enter) {
                    Console.Out.WriteLineAsync("Press the ENTER key to cancel...");
                }

                Console.Out.WriteLineAsync("\nENTER key pressed: canceling conversion.\n");
                videoConversionService.CancelConversion();
            });
            Task conversionTask = videoConversionService.ConvertVideoAsync(input, output);

            await Task.WhenAny(new[] { cancelTask, conversionTask });

            Console.WriteLine("File re-encoding complete");
            Console.ReadKey();
        }
    }
}
