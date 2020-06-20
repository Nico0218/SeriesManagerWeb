using System.IO;

namespace ImageComparisonService.Interfaces {
    public interface IImageComparisonService {
        string GetImageComparisonData(string imageFilePath);

        bool isDuplicate(string imageCompData);
    }
}
