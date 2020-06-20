namespace MediaLibraryCommon.Classes.Security {
    public class LoginRequest {
        public string UserName { get; set; }
        //Should be encrypted at some stage
        public string Password { get; set; }
    }
}
