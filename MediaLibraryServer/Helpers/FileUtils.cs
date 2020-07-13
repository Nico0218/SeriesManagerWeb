using System.Collections.Generic;
using System.IO;

namespace MediaLibraryServer.Helpers
{
    public static class FileUtils
    {
        public static void CheckAndCreateDirectory(string directoryPath)
        {
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
        }

        public static bool IsFileLocked(string filePath)
        {
            FileInfo fileInfo = new FileInfo(filePath);
            return IsFileLocked(fileInfo);
        }

        public static bool IsFileLocked(FileInfo file)
        {
            try
            {
                using (FileStream stream = file.Open(FileMode.Open, FileAccess.Read, FileShare.None))
                {
                    stream.Close();
                }
            }
            catch (IOException ex)
            {
                if (ex.Message.ToUpper().StartsWith("Could not find file".ToUpper()))
                    return false;
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }

            //file is not locked
            return false;
        }

        public static string NameFix(string FileName, List<string> removeStrings)
        {
            FileName = FileName.Remove(FileName.Length - 4);
            FileName = FileName.RemoveStringAndBrackets(removeStrings);
            FileName = FileName.FirstLetterToUpper();
            return FileName;
        }

    }
}
