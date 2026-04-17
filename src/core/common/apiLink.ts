export class Endpoint {
    static Auth = class {
        static Login = "/auth/login"
        static OTP = "/auth/child/login"
        static ChildAccessCode = "/auth/child/request-access-code"
        static Signup = "/auth/signup"
        static SignupVerify = "/auth/signup/verify"
        static Profile = "/users/profile"
        static UpdateProfile = "/users/update-profile"
        static ResetPassword = "/auth/reset-password"
        static ForgotPassword = "/auth/forgot-password"
        static ChangePassword = "/users/change-password"
        static Logout = "/auth/logout"
    }

    static Conversation = class {
        static MyConversation = "/conversations/my-conversations"
        static SendMessage = "/conversations/send-message"
        static ChatLog = "/conversations/chatlogs"
        static GetConversation = "/conversations/get"
    }
    static User = class {
        static MyChild = "/users/my-children"
        static GetChildById = "/children"
        static MyParent = "/users/my-parent"
        static Create = "/children"
        static Update = "/children"
        static Delete = "/children"
    }
    static Inspector = class {
        static Get = "/guardians"
        static GetById = "/guardians"
        static Create = "/guardians"
        static Update = "/guardians"
        static Delete = "/guardians"
    }
    static Notification = class {
        static RegisterToken = "/device-tokens/register"
        static UnregisterToken = "/device-tokens/unregister"
        static RegisterTokenEmail = "/device-tokens/register-email"
        static SOS = "/notifications/sos"
        static MyNotifications = "/notifications/my"
        static MarkRead = "/notifications/mark-read"
        static Location = "/locations/add"
        static GetLocation = "/locations/family"
        static Pin = "/battery/create"
    }
    static Folder = class {
        static Get = "/folders/my-folders"
        static GetById = "/folders"
        static Create = "/folders/create"
        static Save = "/folders/add-message"
        static Update = "/folders/update"
        static Delete = "folders/delete"
    }
};
