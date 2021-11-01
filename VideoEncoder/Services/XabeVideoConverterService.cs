﻿using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VideoProcessorService.Interfaces;
using Xabe.FFmpeg;

namespace VideoProcessorService.Services {
    public class XabeVideoConverterService : IVideoConverter {
        private readonly ILogger<XabeVideoConverterService> logger;
        public CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

        public XabeVideoConverterService(ILogger<XabeVideoConverterService> logger) {
            //Set directory where app should look for FFmpeg 
            this.logger = logger;
            FFmpeg.SetExecutablesPath(@"H:\Code Repo\SeriesManagerWeb\VideoEncoder\FFmpeg");
        }

        //https://ffmpeg.xabe.net/docs.html
        public async Task<IConversionResult> ConverVideoAsync(string videoPath, string outputPath, bool useHardwareAcceleration = true) {
            if (string.IsNullOrEmpty(videoPath)) {
                throw new ArgumentException($"'{nameof(videoPath)}' cannot be null or empty", nameof(videoPath));
            }
            if (string.IsNullOrEmpty(outputPath)) {
                throw new ArgumentException($"'{nameof(outputPath)}' cannot be null or empty", nameof(outputPath));
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

                ExtractSubsAsync(videoPath, outputPath, mediaInfo.SubtitleStreams, useHardwareAcceleration);

                converter.SetOutputFormat(Format.mp4);
                converter.SetOutput(outputName);
                converter.OnProgress += Converter_OnProgress_Video;
                if (useHardwareAcceleration) {
                    converter.UseHardwareAcceleration(HardwareAccelerator.auto, VideoCodec.h264_cuvid, VideoCodec.h264_nvenc, 0);
                }

                IConversionResult result = await converter.Start(cancellationTokenSource.Token);
                return result;
            } catch (Exception ex) {
                logger.LogError($"Failed to convert video file {Path.GetFileName(videoPath)}", ex);
                throw;
            }

        }

        private async void ExtractSubsAsync(string sourceFile, string outputPath, IEnumerable<ISubtitleStream> subtitleStreams, bool useHardwareAcceleration = true) {
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
                converter.OnProgress += Converter_OnProgress_Subs;
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

        private void Converter_OnProgress_Subs(object sender, Xabe.FFmpeg.Events.ConversionProgressEventArgs args) {
            Console.Out.WriteLineAsync($"Extracting Subs {args.Percent}% -- {args.Duration}/{args.TotalLength}");
        }

        private void Converter_OnProgress_Video(object sender, Xabe.FFmpeg.Events.ConversionProgressEventArgs args) {
            Console.Out.WriteLineAsync($"Encoding video {args.Percent}% -- {args.Duration}/{args.TotalLength}");
        }

        public void CancelConversion() {
            cancellationTokenSource.Cancel();
        }
    }
}