﻿using System.Threading.Tasks;
using Xabe.FFmpeg;

namespace VideoProcessorService.Interfaces {
    public interface IVideoConverter {
        Task<IConversionResult> ConverVideoAsync(string videoPath, string outputPath);
        void CancelConversion();
    }
}
