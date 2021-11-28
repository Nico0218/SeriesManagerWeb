using MediaLibraryCommon.Classes.Models;
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
        /// Gets the total free space on the disk in Mb.
        /// </summary>
        public long GetTotalFreeSpace {
            get {
                return GetFreeBytes.AvailableFreeSpace / 1024 / 1024;
            }
        }

        /// <summary>
        /// Gets the total usable free space in Mb.
        /// </summary>
        public long GetAvailableSpace {
            get {
                DriveInfo driveSpace = GetFreeBytes;
                double reservedSpace = driveSpace.TotalSize * (MinFreeSpace / 100);
                double availableSpace = driveSpace.AvailableFreeSpace - reservedSpace;
                if (availableSpace < 0)
                    return 0;
                return Convert.ToInt64(Math.Ceiling(availableSpace) / 1024 / 1024);
            }
        }

        private DriveInfo GetFreeBytes {
            get {
                if (string.IsNullOrEmpty(BasePath))
                    throw new NullReferenceException("The base path has not been configured");
                DriveInfo driveInfo = new DriveInfo(Path.GetDirectoryName(BasePath));
                if (driveInfo == null)
                    throw new NullReferenceException($"Failed to get drive info for path {BasePath}");
                return driveInfo;
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
            if (GetTotalFreeSpace < 1024)
                return false;
            return true;
        }
    }
}
