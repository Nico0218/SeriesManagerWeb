using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VideoProcessorService.Interfaces;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Events;

namespace VideoProcessorService.Services {
    public class XabeVideoConverterService : IVideoConverter {
        private readonly ILogger<XabeVideoConverterService> logger;        

        public XabeVideoConverterService(ILogger<XabeVideoConverterService> logger) {
            //Set directory where app should look for FFmpeg 
            this.logger = logger;
            this.init();
        }

        public void init() {
            string ffMpegPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "FFmpeg");
            FFmpeg.SetExecutablesPath(ffMpegPath);
        }

        //https://ffmpeg.xabe.net/docs.html
        public async Task<string> ConverVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration, CancellationTokenSource cancellationTokenSource) {
            if (string.IsNullOrEmpty(videoPath)) {
                throw new ArgumentException($"'{nameof(videoPath)}' cannot be null or empty", nameof(videoPath));
            }
            if (string.IsNullOrEmpty(outputPath)) {
                throw new ArgumentException($"'{nameof(outputPath)}' cannot be null or empty", nameof(outputPath));
            }

            if (Directory.Exists(outputPath)) {
                try {
                    foreach (var file in Directory.GetFiles(outputPath)) {
                        File.Delete(file);
                    }
                } catch (Exception) {
                    throw;
                }
            }
            string outputName = Path.Combine(outputPath, Path.GetFileNameWithoutExtension(videoPath) + ".mp4");
            try {
                IMediaInfo mediaInfo = FFmpeg.GetMediaInfo(videoPath).Result;
                IConversion converter = FFmpeg.Conversions.New();

                IVideoStream videoStream = mediaInfo.VideoStreams.FirstOrDefault();
                if (videoStream == null) {
                    throw new NullReferenceException("Failed to extract video stream from the source file.");
                }
                converter.AddStream(videoStream);

                IAudioStream audioStream = mediaInfo.AudioStreams.FirstOrDefault(ii => !string.IsNullOrEmpty(ii.Language) && ii.Language.ToLower().Equals("jpn"));
                if (audioStream == null) {
                    //Could not find a Japanese audio stream lets take the default
                    audioStream = mediaInfo.AudioStreams.FirstOrDefault();
                    if (audioStream == null) {
                        throw new NullReferenceException("Failed to extract audio stream from the source file.");
                    }
                }
                audioStream.SetCodec(AudioCodec.aac);
                converter.AddStream(audioStream);

                foreach (var subtitleStream in mediaInfo.SubtitleStreams) {
                    subtitleStream.SetCodec(Xabe.FFmpeg.Streams.SubtitleStream.SubtitleCodec.mov_text);
                    converter.AddStream(subtitleStream);
                }

                ExtractSubsAsync(videoPath, outputPath, mediaInfo.SubtitleStreams, useHardwareAcceleration, cancellationTokenSource);

                converter.SetOutputFormat(Format.mp4);
                converter.SetOutput(outputName);
                converter.OnProgress += (sender, args) => { Converter_OnProgress_Video(sender, args, Path.GetFileName(videoPath)); };
                if (useHardwareAcceleration) {
                    converter.UseHardwareAcceleration(HardwareAccelerator.auto, VideoCodec.h264_cuvid, VideoCodec.h264_nvenc, 0);
                }

                IConversionResult result = await converter.Start(cancellationTokenSource.Token);
                return outputName;
            } catch (Exception ex) {
                logger.LogError($"Failed to convert video file {Path.GetFileName(videoPath)}", ex);
                throw;
            }

        }

        private async void ExtractSubsAsync(string sourceFile, string outputPath, IEnumerable<ISubtitleStream> subtitleStreams, bool useHardwareAcceleration, CancellationTokenSource cancellationTokenSource) {
            if (string.IsNullOrEmpty(sourceFile)) {
                throw new ArgumentException($"'{nameof(sourceFile)}' cannot be null or empty", nameof(sourceFile));
            }
            if (string.IsNullOrEmpty(outputPath)) {
                throw new ArgumentException($"'{nameof(outputPath)}' cannot be null or empty", nameof(outputPath));
            }
            if (subtitleStreams is null || subtitleStreams.Count() == 0) {
                return;
            }

            int count = 0;
            foreach (ISubtitleStream subtitleStream in subtitleStreams) {
                string subTitle = subtitleStream.Title;
                foreach (char invalidChar in Path.GetInvalidFileNameChars()) {
                    if (subTitle.Contains(invalidChar)) {
                        subTitle = subTitle.Replace(invalidChar, '_');
                    }
                }
                string outputFile = Path.Combine(outputPath, $"{Path.GetFileNameWithoutExtension(sourceFile)} - {subtitleStream.Language} - {subTitle}.vtt");

                string ffmpegArgs = $"-i \"{sourceFile}\" -map 0:s:{count} \"{outputFile}\"";
                count++;

                IConversion converter = FFmpeg.Conversions.New();
                converter.OnProgress += (sender, args) => { Converter_OnProgress_Subs(sender, args, Path.GetFileName(sourceFile)); };
                if (useHardwareAcceleration) {
                    converter.UseHardwareAcceleration(HardwareAccelerator.auto, VideoCodec.h264_cuvid, VideoCodec.h264_nvenc, 0);
                }

                try {
                    await converter.Start(ffmpegArgs, cancellationTokenSource.Token);
                } catch (Exception ex) {
                    logger.LogError($"Failed to extract subtitles for {subTitle}", ex);
                    logger.LogDebug($"Removing file {outputFile}");
                    File.Delete(outputFile);
                }
            }
        }

        private void Converter_OnProgress_Subs(object sender, ConversionProgressEventArgs args, string fileName) {
            Console.Out.WriteLineAsync($"Extracting Subs from {fileName} {args.Percent}% -- {args.Duration}/{args.TotalLength}");
        }

        private void Converter_OnProgress_Video(object sender, ConversionProgressEventArgs args, string fileName) {
            Console.Out.WriteLineAsync($"Encoding video for {fileName} {args.Percent}% -- {args.Duration}/{args.TotalLength}");
        }
    }
}
