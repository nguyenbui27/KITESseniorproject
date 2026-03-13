export const messageConfig = (message: string) => {
    switch (message) {
        case "username_not_exists":
            return `Account does not exist. Please register to use the system.`;
        case "wrong_password":
            return `Incorrect password. Please check your login credentials.`;
        case "username_exists":
            return `Account already exists. Please register with a different account.`;
        case "email_exists":
            return `Email is already in use. Please use a different email.`;
        case "change_password_fail":
            return `Current password is incorrect.`;
        case "confirm_password_not_match":
            return `Confirmation password does not match.`;
        default:
            return "An error occurred.";
    }
}