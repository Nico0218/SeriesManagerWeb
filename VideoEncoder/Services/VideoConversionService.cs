using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VideoProcessorService.Interfaces;
using Xabe.FFmpeg;

namespace VideoProcessorService.Services {
    public class VideoConversionService : IVideoConversionService {
        private readonly ILogger<VideoConversionService> logger;
        private Dictionary<string, CancellationTokenSource> cancelationTokens = new Dictionary<string, CancellationTokenSource>();
        IVideoConverter videoConverter;

        public VideoConversionService(ILogger<VideoConversionService> logger, IVideoConverter videoConverter) {
            this.logger = logger;
            this.videoConverter = videoConverter;
        }

        public CancellationTokenSource GetCancellationToken(string id) {
            
            CancellationTokenSource cancellationToken;
            if (!cancelationTokens.TryGetValue(id, out cancellationToken)) {
                cancellationToken = new CancellationTokenSource();
                cancelationTokens.Add(id, cancellationToken);
            }
            return cancellationToken;
        }

        public void CancelConversion(string id) {
            CancellationTokenSource cancellationToken;
            if (!cancelationTokens.TryGetValue(id, out cancellationToken)) {
                throw new System.Exception($"Cancelation token for {id} no longer exists.");
            }
            cancellationToken.Dispose();
            cancelationTokens.Remove(id);
        }

        public void CancelAllConversion() {
            foreach (var key in cancelationTokens.Keys) {
                CancelConversion(key);
            }
        }

        public Task<string> ConvertVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration, CancellationTokenSource cancellationTokenSource) {            
            return videoConverter.ConverVideoAsync(videoPath, outputPath, useHardwareAcceleration, cancellationTokenSource);
        }   
    }
}
