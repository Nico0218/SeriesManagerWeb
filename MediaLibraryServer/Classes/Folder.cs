using System;
using MediaLibraryCommon.Enums;
using System.IO;

namespace MediaLibraryServer.Classes {
    public class Folder {
        public FileType FileType { get; set; }
        public string BasePath { get; set; }
        //Handled like a %
        public double MinFreeSpace { get; set; } = 5;

        public string GetFreeSpace {
            get {
                return GetDisplayString(GetFreeBytes);
            }
        }
        public string GetAvailableSpace {
            get {
                long freeSpace = GetFreeBytes;
                long availableSpace = freeSpace - (long)(freeSpace * (MinFreeSpace/100));
                return GetDisplayString(availableSpace);
            }
        }

        private long GetFreeBytes {
            get {
                if (string.IsNullOrEmpty(BasePath))
                    throw new NullReferenceException("The base path has not been configured");
                DriveInfo driveInfo = new DriveInfo(Path.GetDirectoryName(BasePath));
                if (driveInfo == null)
                    throw new NullReferenceException($"Failed to get drive info for path {BasePath}");
                return driveInfo.AvailableFreeSpace;
            }
        }

        private string GetDisplayString(long bytes) {
            long value = bytes / 1024;
            if (value > 1024) {
                value = value / 1024;
                if (value > 1024) {
                    value = value / 1024;
                    return $"{value} TB";
                } else {
                    return $"{value} GB";
                }
            } else {
                return $"{value} MB";
            }
        }
    }
}
