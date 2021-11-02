using System.Threading.Tasks;
using Xabe.FFmpeg;

namespace VideoProcessorService.Interfaces {
    public interface IVideoConverter {
        Task<string> ConverVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration);
        void CancelConversion();
    }
}
