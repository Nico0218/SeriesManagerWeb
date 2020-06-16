using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Helpers {
    public static class NewStingFunctions {
        public static string RemoveStringAndBrackets(this string temp, List<string> stufftoremove) {
            if (temp == null) {
                throw new NullReferenceException("No string provided to sanitize.");
            }
            if (stufftoremove == null || stufftoremove.Count == 0) {
                throw new NullReferenceException("No strip strings provided");
            }
            foreach (var item in stufftoremove) {
                temp = temp.Replace(item, " ", StringComparison.InvariantCultureIgnoreCase);
            }

            while (temp.IndexOf('[', StringComparison.InvariantCultureIgnoreCase) != -1) {
                int start = temp.IndexOf('[', StringComparison.InvariantCultureIgnoreCase);
                int end = temp.IndexOf(']', StringComparison.InvariantCultureIgnoreCase) - start + 1;
                temp = temp.Remove(start, end);
            }

            while (temp.IndexOf('(', StringComparison.InvariantCultureIgnoreCase) != -1) {
                int start = temp.IndexOf('(', StringComparison.InvariantCultureIgnoreCase);
                int end = temp.IndexOf(')', StringComparison.InvariantCultureIgnoreCase) - start + 1;
                temp = temp.Remove(start, end);
            }
            temp = temp.Trim();
            return temp;
        }

        public static string FirstLetterToUpper(this string StringToChange) {
            if (StringToChange == null) {
                throw new NullReferenceException("StringToChange");
            }
            List<string> NewStringList = new List<string>();
            string[] arrRemoveStrings = new string[1];
            arrRemoveStrings[0] = " ";
            NewStringList = StringToChange.Split(arrRemoveStrings, StringSplitOptions.RemoveEmptyEntries).ToList();
            StringToChange = "";
            for (int j = 0; j < NewStringList.Count(); j++) {
                if (j < NewStringList.Count() - 1) {
                    StringToChange += NewStringList[j].Substring(0, 1).ToUpper() + NewStringList[j].Remove(0, 1) + " ";
                } else {
                    StringToChange += NewStringList[j].Substring(0, 1).ToUpper() + NewStringList[j].Remove(0, 1);
                }
            }
            return StringToChange;
        }
    }
}
