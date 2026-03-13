export class Endpoint {
    static Auth = class {
        static Login = "/auth/login"
        static OTP = "/auth/child/login"
        static ChildAccessCode = "/auth/child/request-access-code"
        static Signup = "/auth/signup"
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
        static GetChildById = "/api/children"
        static MyParent = "/users/my-parent"
        static Create = "/api/children"
        static Update = "/api/children"
        static Delete = "/api/children"
    }
    static Mission = class {
        static Get = "/missions/my-missions"
        static GetById = "/missions/get"
        static Create = "/missions/parent/create"
        static Update = "/missions/parent/update"
        static Complete = "/missions/child/complete"
        static Confirm = "/missions/parent/confirm"
        static Delete = "/missions/parent/delete"
    }
    static Inspector = class {
        static Get = "/api/guardians"
        static GetById = "/api/guardians"
        static Create = "/api/guardians"
        static Update = "/api/guardians"
        static Delete = "/api/guardians"
    }
    static Notification = class {
        static RegisterToken = "/device-tokens/register"
        static UnregisterToken = "/device-tokens/unregister"
        static RegisterTokenEmail = "/device-tokens/register-email"
        static SOS = "/notifications/sos"
        static Location = "/locations/add"
        static GetLocation = "/locations/family"
        static Pin = "/battery/create"
    }
    static BlockWeb = class {
        static Get = "/blocked/all/web"
        static GetByChild = "/blocked/all/web/child"
        static Create = "/blocked/web/add"
        static Delete = "/blocked/app/delete"
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
