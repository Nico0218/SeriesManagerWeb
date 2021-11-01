using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using VideoProcessorService.Services;

namespace TestBench {
    class Program {
        static VideoConversionService videoConversionService;
        static string input;
        static string output;
        static string FileName;
        static int Run = 0;

        static List<TestResult> TestResults = new List<TestResult>();

        static async Task Main(string[] args) {
            Console.WriteLine("Hello World!");
            LoggerFactory loggerFactory = new LoggerFactory();
            videoConversionService = new VideoConversionService(loggerFactory.CreateLogger<VideoConversionService>(), new XabeVideoConverterService(loggerFactory.CreateLogger<XabeVideoConverterService>()));
            string TestFolder = @"E:\TestFolder";
            //FileName = @"Azur Lane - Bisoku Zenshin! - 01.mkv";
            FileName = @"[Edge] Nande Koko ni Sensei ga! 01.mkv";
            input = Path.Combine(TestFolder, "VideoIn", FileName);
            output = @Path.Combine(TestFolder, "VideoOut");

            TestResult testResult = await RunConversion(false);
            TestResults.Add(testResult);

            //for (int i = 0; i < 3; i++) {
            //    Run++;
            //    TestResult testResult = await RunConversion(true);
            //    TestResults.Add(testResult);
            //}

            //for (int i = 0; i < 3; i++) {
            //    Run++;
            //    TestResult testResult = await RunConversion(false);
            //    TestResults.Add(testResult);
            //}
            Console.Clear();
            Console.WriteLine("Results");
            foreach (var item in TestResults) {
                Console.WriteLine(item);
            }

            Console.WriteLine("File re-encoding complete");
            Console.ReadKey();
        }

        static async Task<TestResult> RunConversion(bool UseHardwardAcceleration) {
            foreach (string file in Directory.GetFiles(output)) {
                File.Delete(file);
            }

            Task cancelTask = Task.Run(() => {
                while (Console.ReadKey().Key != ConsoleKey.Enter) {
                    Console.Out.WriteLineAsync("Press the ENTER key to cancel...");
                }

                Console.Out.WriteLineAsync("\nENTER key pressed: canceling conversion.\n");
                videoConversionService.CancelConversion();
            });
            Task conversionTask = videoConversionService.ConvertVideoAsync(input, output, UseHardwardAcceleration);

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            await Task.WhenAny(new[] { cancelTask, conversionTask });
            stopwatch.Stop();

            TestResult testResult = new TestResult();
            testResult.Run = Run;
            testResult.FileName = FileName;
            testResult.IsHardwareAccelerated = UseHardwardAcceleration;
            testResult.TimeElapsed = stopwatch.Elapsed;            
            return testResult;
        }
    }

    class TestResult {
        public int Run;
        public string FileName;
        public bool IsHardwareAccelerated;
        public TimeSpan TimeElapsed;

        public override string ToString() {
            return $"{FileName} - Run: {Run} - IsHardWareAccelerated: {IsHardwareAccelerated} - Time Elapsed: {TimeElapsed}";
        }
    }
}