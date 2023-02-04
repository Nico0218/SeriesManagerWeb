using System.Threading;
using System.Threading.Tasks;
using Xabe.FFmpeg;

namespace VideoProcessorService.Interfaces {
    public interface IVideoConversionService {
        Task<string> ConvertVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration, CancellationTokenSource cancellationTokenSource);

        CancellationTokenSource GetCancellationToken(string id);

        void CancelConversion(string id);

        void CancelAllConversion();
    }
}
