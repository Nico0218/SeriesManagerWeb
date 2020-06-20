namespace MediaLibraryCommon.Classes
{
    public class IngestSettings
    {
        public string IngestFolderPath = @"E:\LibraryIngest";
        public string InterimFolderPath = @"E:\LibraryInterim";
        public string RejectedPath = @"E:\LibraryRejected";
        public int timerInterval = 1000 * 5;
    }
}
