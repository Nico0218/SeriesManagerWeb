using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MediaLibraryCommon.Classes
{
    public class FileTypeSettings
    {
        private List<string> removeStrings;

        public List<string> GetRemoveStrings()
        {
            if (removeStrings == null)
            {
                removeStrings = new List<string>();
                removeStrings.Clear();
                removeStrings.Add("_");
                removeStrings.Add(".");
                removeStrings.Add(",");
                removeStrings.Add("-");
                removeStrings.Add("~");
                removeStrings.Add(";");
                removeStrings.Add("lol");
                removeStrings.Add("xvid");
                removeStrings.Add("dvd");
                removeStrings.Add("hdtv");
                removeStrings.Add("asap");
                removeStrings.Add("repack");
                removeStrings.Add("x246");
                removeStrings.Add("x264");
                removeStrings.Add("02hd");
                removeStrings.Add("2hd");
                removeStrings.Add("480p");
                removeStrings.Add("720p");
                removeStrings.Add("1080p");
                removeStrings.Add("hd");
                removeStrings.Add("sd");
                removeStrings.Add("tv");
                removeStrings.Add("Episode");
            }
            return removeStrings;
        }

        public void SetRemoveStrings(List<string> value)
        {
            removeStrings = value;
        }

        private List<string> videoFileTypes;

        public List<string> GetVideoFileTypes()
        {
            if (videoFileTypes == null)
            {
                videoFileTypes = new List<string>();
                videoFileTypes.Clear();
                videoFileTypes.Add(".mkv");
                videoFileTypes.Add(".avi");
                videoFileTypes.Add(".mp4");
                videoFileTypes.Add(".flv");
                videoFileTypes.Add(".m4v");
                videoFileTypes.Add(".rmvb");
            }
            return videoFileTypes;
        }

        public void SetVideoFileTypes(List<string> value)
        {
            videoFileTypes = value;
        }

        private List<string> imageFileTypes;

        public List<string> GetImageFileTypes()
        {
            if (imageFileTypes == null)
            {
                imageFileTypes = new List<string>();
                imageFileTypes.Add(".jpg");
                imageFileTypes.Add(".jpeg");
                imageFileTypes.Add(".png");
            }
            return imageFileTypes;
        }

        public void SetImageFileTypes(List<string> value)
        {
            imageFileTypes = value;
        }
    }
}
