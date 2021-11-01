using System.Threading.Tasks;
using Xabe.FFmpeg;

namespace VideoProcessorService.Interfaces {
    public interface IVideoConversionService {
        Task<IConversionResult> ConvertVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration);

        void CancelConversion();
    }
}
