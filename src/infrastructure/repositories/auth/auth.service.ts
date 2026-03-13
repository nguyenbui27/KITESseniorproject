import { Endpoint } from "../../../core/common/apiLink";
import { Alert } from "react-native";
import { RequestService } from "../../utils/response";
import { clearStorage, saveToken } from "../../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fcmService from "../fcm/fcmService";

class AuthService {
    private getErrorMessage(error: any, fallback: string) {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallback
        );
    }

    async login(data: object, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService
                .post(Endpoint.Auth.Login, data)
                .then(async response => {
                    if (response) {
                        await saveToken(response.accessToken);
                    }
                    setLoading(false);
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Login failed', this.getErrorMessage(error, 'Unable to login. Please try again.'));
            console.log('[AuthService.login]', this.getErrorMessage(error, 'Unable to login. Please try again.'));
        } finally {
            setLoading(false);
        }
    }

    async loginOTP(otp: string, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService
                .post(`${Endpoint.Auth.OTP}/${otp}`, {})
                .then(async response => {
                    if (response) {
                        await saveToken(response.accessToken);
                    }
                    setLoading(false);
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Login failed', this.getErrorMessage(error, 'Unable to login. Please try again.'));
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async requestChildAccessCode(email: string, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService
                .post(Endpoint.Auth.ChildAccessCode, { email })
                .then(response => {
                    Alert.alert('Access code sent', 'Please check your email for the 6-digit code.');
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Request failed', this.getErrorMessage(error, 'Unable to send access code email. Please try again.'));
        } finally {
            setLoading(false);
        }
    }

    async registerFCMTokenAfterLogin(email: string) {
        try {
            const pendingToken = await AsyncStorage.getItem('pendingFcmToken');
            if (pendingToken) {
                await fcmService.registerTokenWithEmail(pendingToken, email);
                await AsyncStorage.removeItem('pendingFcmToken');
            } else {
                await fcmService.getFCMToken();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async logout(setLoading: Function) {
        setLoading(true);
        try {
            console.log("Deleting FCM token...");
            await fcmService.deleteToken();
            console.log("Calling API logout...");
            await RequestService.post(Endpoint.Auth.Logout, {});
            console.log("Clearing storage...");
            clearStorage();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    async register(data: any, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService
                .post(Endpoint.Auth.Signup, { ...data })
                .then(response => {
                    Alert.alert('Registration successful');
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Registration failed', this.getErrorMessage(error, 'Unable to register. Please check your information.'));
        } finally {
            setLoading(false);
        }
    }

    async profile(setLoading: Function) {
        setLoading(true);
        try {
            try {
                const token = await fcmService.getFCMToken();
                console.log("token", token);
                await RequestService.post(Endpoint.Notification.RegisterToken, { token });
            } catch (error) {
                console.log("Register token error", error);
            }
            const response = await RequestService.get(Endpoint.Auth.Profile);
            return response;
        } catch (error) {
            console.log("Error fetching profile:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async updateProfile(data: object, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService.put(Endpoint.Auth.UpdateProfile, data)
                .then(response => {
                    Alert.alert('Update successful');
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Update failed', this.getErrorMessage(error, 'Unable to update profile. Please try again.'));
        } finally {
            setLoading(false);
        }
    }

    async resetPassword(otp: string, newPassword: string, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService.post(
                `${Endpoint.Auth.ResetPassword}?otp=${otp}&newPassword=${newPassword}`,
                {}
            ).then(response => {
                Alert.alert('Password reset successful');
                return response;
            });
        } catch (error: any) {
            Alert.alert('Password reset failed', this.getErrorMessage(error, 'Unable to reset password. Please try again.'));
        } finally {
            setLoading(false);
        }
    }

    async forgotPassword(data: any, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService.post(Endpoint.Auth.ForgotPassword, data)
                .then(response => {
                    Alert.alert('Email sent successfully');
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Email sending failed', this.getErrorMessage(error, 'Unable to send email. Please try again.'));
        } finally {
            setLoading(false);
        }
    }

    async changePassword(data: any, setLoading: Function) {
        setLoading(true);
        try {
            return await RequestService.put(Endpoint.Auth.ChangePassword, data)
                .then(response => {
                    Alert.alert('Password changed successfully');
                    return response;
                });
        } catch (error: any) {
            Alert.alert('Password change failed', this.getErrorMessage(error, 'Unable to change password. Please try again.'));
        } finally {
            setLoading(false);
        }
    }
}

export default new AuthService();
