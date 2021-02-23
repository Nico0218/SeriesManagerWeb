using System.Threading.Tasks;
using VideoProcessorService.Interfaces;
using Xabe.FFmpeg;

namespace VideoProcessorService.Services {
    public class VideoConversionService : IVideoConversionService {
        IVideoConverter videoConverter;

        public VideoConversionService() {
            videoConverter = new XabeVideoConverterService();
        }

        public void CancelConversion() {
            videoConverter.CancelConversion();
        }

        public Task<IConversionResult> ConvertVideoAsync(string videoPath, string outputPath) {
            return videoConverter.ConverVideoAsync(videoPath, outputPath);
        }
    }
}
