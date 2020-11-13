using MediaLibraryCommon.Enums;
using System;
using System.Configuration;
using System.IO;

namespace MediaLibraryCommon.Classes.LogicModels.Config {
    public class FolderLibrary : LogicModelBase {
        public FolderType FileType { get; set; }
        [StringValidator(MaxLength = 1000)]
        public string BasePath { get; set; }
        //Handled like a %
        public double MinFreeSpace { get; set; } = 5;

        public FolderLibrary() {

        }

        public FolderLibrary(string name) : base(name) {

        }

        /// <summary>
        /// Gets the available space on the folder disk in Mb
        /// </summary>
        public long GetFreeSpace {
            get {
                return GetFreeBytes / 1024;
            }
        }

        /// <summary>
        /// Gets the available space in the folder in Mb
        /// </summary>
        public long GetAvailableSpace {
            get {
                long freeSpace = GetFreeBytes;
                long availableSpace = freeSpace - (long)(freeSpace * (MinFreeSpace / 100));
                return availableSpace / 1024;
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

        /// <summary>
        /// Converts a Mb disk size to a display friendly string
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public string FormatDisplayString(long Mb) {
            if (Mb > 1024) {
                Mb = Mb / 1024;
                if (Mb > 1024) {
                    Mb = Mb / 1024;
                    return $"{Mb} TB";
                } else {
                    return $"{Mb} GB";
                }
            } else {
                return $"{Mb} MB";
            }
        }

        public bool IsReady() {
            if (!Directory.Exists(BasePath)) {
                try {
                    Directory.CreateDirectory(BasePath);
                } catch (Exception ex) {
                    return false;
                }                
            }
            //Critical low space. Things are not OK
            if (GetFreeSpace < 1024)
                return false;
            return true;
        }
    }
}
