export default class Constants {
    static AuthTab = class {
        static List = [
            {
                label: "Sign In",
                value: 1
            },
            {
                label: "Sign Up",
                value: 2
            },
        ]
    }
    static Navigator = class {
        static HomeScreen = class {
            static value = "HomeScreen"
        }
        static Branch = class {
            static BranchScreen = class {
                static value = "BranchScreen"
            }
            static DetailBranchScreen = class {
                static value = "DetailBranchScreen"
            }
        }
        static Package = class {
            static PackageScreen = class {
                static value = "PackageScreen"
            }
            static DetailPackageScreen = class {
                static value = "DetailPackageScreen"
            }
        }
        static Room = class {
            static RoomScreen = class {
                static value = "RoomScreen"
            }
            static DetailRoomScreen = class {
                static value = "DetailRoomScreen"
            }
        }
        static BookingScreen = class {
            static value = "BookingScreen"
        }
        static ExamScreen = class {
            static value = "ExamScreen"
        }
        static Navbar = class {
            static value = "Navbar"
        }
        static InfoUserScreen = class {
            static value = "InfoUserScreen"
            static EditProfile = class {
                static value = "EditProfile"
            }
            static BookingSchedule = class {
                static value = "BookingSchedule"
            }
            static WorkoutSessions = class {
                static value = "WorkoutSessions"
            }
            static BranchMember = class {
                static value = "BranchMember"
            }
            static PackageUser = class {
                static value = "PackageUser"
            }
        }
        static Auth = class {
            static LoginScreen = class {
                static value = "LoginScreen"
            }
            static ForgotPasswordScreen = class {
                static value = "ForgotPasswordScreen"
            }
            static ChangePasswordScreen = class {
                static value = "ChangePasswordScreen"
            }
            static VerifyScreen = class {
                static value = "VerifyScreen"
            }
        }
    }

    static InfoUser = class {
        static List = [
            {
                value: "ViewProfile",
                label: "Profile Info",
                icon: "person-sharp",
                roles: ["admin", "parent", "child"]
            },
            {
                value: "EditProfile",
                label: "Edit Profile",
                icon: "settings-sharp",
                roles: ["admin", "parent", "child"]
            },
            {
                value: "ChangePasswordScreen",
                label: "Change Password",
                icon: "keypad",
                roles: ["admin", "parent"]
            },
        ]
    }
    static Gender = class {
        static MALE = class {
            static value = "MALE";
            static label = "Male";
        }
        static FEMALE = class {
            static value = "FEMALE";
            static label = "Female";
        }
        static List = [
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
        ]
    }
}