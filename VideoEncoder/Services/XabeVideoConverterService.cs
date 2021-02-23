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
        public CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

        public XabeVideoConverterService() {
            //Set directory where app should look for FFmpeg 
            FFmpeg.SetExecutablesPath(@"H:\Code Repo\SeriesManagerWeb\VideoEncoder\FFmpeg");
        }

        //https://ffmpeg.xabe.net/docs.html
        public async Task<IConversionResult> ConverVideoAsync(string videoPath, string outputPath) {
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

                IConversionResult subsResult = await ExtractSubsAsync(videoPath, outputPath, mediaInfo.SubtitleStreams);

                converter.SetOutputFormat(Format.mp4);
                converter.SetOutput(outputName);
                converter.OnProgress += Converter_OnProgress;
                
                IConversionResult result = await converter.Start(cancellationTokenSource.Token);
                return result;
            } catch (Exception ex) {
                throw;
            }

        }

        private async Task<IConversionResult> ExtractSubsAsync(string sourceFile, string outputPath, IEnumerable<ISubtitleStream> subtitleStreams) {
            if (string.IsNullOrEmpty(sourceFile)) {
                throw new ArgumentException($"'{nameof(sourceFile)}' cannot be null or empty", nameof(sourceFile));
            }
            if (string.IsNullOrEmpty(outputPath)) {
                throw new ArgumentException($"'{nameof(outputPath)}' cannot be null or empty", nameof(outputPath));
            }
            if (subtitleStreams is null || subtitleStreams.Count() == 0) {
                return null;
            }

            int subsStreamIndex = subtitleStreams.ToList().Find(ii => ii.Default == 1)?.Index ?? -1;
            if (subsStreamIndex == -1) {
                subsStreamIndex = subtitleStreams.FirstOrDefault().Index;
            }

            string outputFile = Path.Combine(outputPath, Path.GetFileNameWithoutExtension(sourceFile) + ".vtt");
            string ffmpegArgs = $"-i \"{sourceFile}\" -map 0:s:{0} \"{outputFile}\"";

            try {
                IConversion conversion = FFmpeg.Conversions.New();
                conversion.OnProgress += Converter_OnProgress;
                IConversionResult conversionResult = await conversion.Start(ffmpegArgs, cancellationTokenSource.Token);

                return conversionResult;
            } catch (Exception ex) {
                throw;
            }

        }

        private void Converter_OnProgress(object sender, Xabe.FFmpeg.Events.ConversionProgressEventArgs args) {
            Console.Out.WriteLineAsync($"Encoding in progress {args.Percent}% -- {args.Duration}/{args.TotalLength}");
        }

        public void CancelConversion() {
            cancellationTokenSource.Cancel();
        }
    }
}
