using System;
using VideoProcessorService;

namespace TestBench {
    class Program {
        //https://sourceforge.net/p/mediainfo/discussion/297610/thread/40a22e58/
        static void Main(string[] args) {
            Console.WriteLine("Hello World!");
            SubtitleExtractionService SubtitleExtractionService = new SubtitleExtractionService();
            string subtitles = SubtitleExtractionService.ExtractSubtitle();
            Console.WriteLine(subtitles);
            Console.ReadKey();
        }
    }
}
