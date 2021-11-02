using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using VideoProcessorService.Interfaces;
using Xabe.FFmpeg;

namespace VideoProcessorService.Services {
    public class VideoConversionService : IVideoConversionService {
        private readonly ILogger<VideoConversionService> logger;
        IVideoConverter videoConverter;

        public VideoConversionService(ILogger<VideoConversionService> logger, IVideoConverter videoConverter) {
            this.logger = logger;
            this.videoConverter = videoConverter;
        }

        public void CancelConversion() {
            videoConverter.CancelConversion();
        }

        public Task<string> ConvertVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration = true) {
            return videoConverter.ConverVideoAsync(videoPath, outputPath, useHardwareAcceleration);
        }
    }
}
