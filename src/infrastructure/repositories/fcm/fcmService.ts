import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FCMService {
    async requestUserPermission() {
        console.log('FCM: Firebase not configured yet, skipping permissions');
        return false;
    }

    async getFCMToken() {
        console.log('FCM: Firebase not configured yet, skipping token');
        return null;
    }

    async registerTokenWithServer(token: any) {
        console.log('FCM: Firebase not configured yet, skipping registration');
        return null;
    }

    async registerTokenWithEmail(token: any, email: string) {
        console.log('FCM: Firebase not configured yet, skipping registration');
        return null;
    }

    setupMessageListeners(onNotificationReceived: any) {
        console.log('FCM: Firebase not configured yet, skipping listeners');
        return () => {};
    }

    setupTokenRefresh() {
        console.log('FCM: Firebase not configured yet, skipping refresh');
        return () => {};
    }

    async deleteToken() {
        await AsyncStorage.removeItem('fcmToken');
        await AsyncStorage.removeItem('pendingFcmToken');
        console.log('FCM: Token cleared (Firebase not configured)');
        return true;
    }
}

export default new FCMService();