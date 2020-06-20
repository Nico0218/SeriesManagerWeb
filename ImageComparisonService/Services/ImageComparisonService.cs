using DBProviderBase.Classes;
using ImageComparisonService.Classes;
using ImageComparisonService.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace ImageComparisonService.Services {
    public class ImageComparisonService : IImageComparisonService {
        private List<string> filters;
        private readonly ILogger<ImageComparisonService> logger;
        private readonly IDataService dataService;

        public ImageComparisonService(ILogger<ImageComparisonService> logger, IDataService dataService) {
            this.logger = logger;
            this.dataService = dataService;
        }

        /// <summary>
        /// Computes a 16 x 16 grayscale data set of any image and then returns a hash version of the data set.
        /// </summary>
        /// <param name="imageFilePath"></param>
        /// <returns></returns>
        public string GetImageComparisonData(string imageFilePath) {
            if (imageFilePath is null) {
                throw new ArgumentNullException(nameof(imageFilePath));
            }

            if (!isValidImage(Path.GetExtension(imageFilePath)))
                throw new Exception($"{Path.GetFileName(imageFilePath)} is not a valid image");

            byte[,] grayScaleData;
            using (Image image = Image.FromFile(imageFilePath)) {
                try {
                    grayScaleData = image.GetGrayScaleValues();
                } catch (Exception ex) {
                    logger.LogError("Failed to get image gray scale data.", ex);
                    return null;
                }
            }

            //Flatten grayscale to string
            string imgCompData = "";
            for (int i = 0; i < grayScaleData.GetLength(0); i++) {
                byte[] arr = new byte[grayScaleData.GetLength(1)];
                for (int j = 0; j < grayScaleData.GetLength(1); j++) {
                    arr[j] = grayScaleData[i, j];
                }
                imgCompData += Convert.ToBase64String(arr);
                if (i + 1 != grayScaleData.GetLength(0)) {
                    imgCompData += "|";
                }
            }

            string[] imageparts = imgCompData.Split('|');
            byte[,] testArr = new byte[grayScaleData.GetLength(0), grayScaleData.GetLength(1)];
            for (int i = 0; i < testArr.GetLength(0); i++) {
                byte[] arr = Convert.FromBase64String(imageparts[i]);
                for (int j = 0; j < testArr.GetLength(1); j++) {
                    testArr[i, j] = arr[j];
                }
            }

            return GetHashString(imgCompData);
        }

        public bool isDuplicate(string imageCompData) {
            List<IParameter> paramerters = new List<IParameter>();
            paramerters.Add(new Parameter() {
                ColumnName = "ImageComparisonHash",
                DataType = "System.String",
                Operator = DBProviderBase.Enums.ParamOperator.Equals,
                Value = imageCompData
            });
            return dataService.GetObjectData<ImageData>(paramerters).Count >= 1;
        }

        private bool isValidImage(string fileExtension) {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
            if (filters == null) {
                filters = new List<string>();
                foreach (var c in codecs) {
                    filters.AddRange(c.FilenameExtension.Replace("*", "").Split(new char[] { ';' }));
                }
            }
            if (filters.Contains(fileExtension.ToUpper()))
                return true;
            return false;
        }

        private byte[] GetHash(string inputString) {
            using (HashAlgorithm algorithm = SHA256.Create())
                return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
        }

        private string GetHashString(string inputString) {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }



    }
}
