import { Platform } from 'react-native';
import { API_URL as ENV_API_URL } from '@env';

const DEFAULT_ANDROID_API_URL = 'http://10.0.2.2:5004/api';
const DEFAULT_IOS_API_URL = 'http://127.0.0.1:5004/api';

const normalizeAndroidLoopback = (url: string) => {
    if (Platform.OS !== 'android') {
        return url;
    }

    return url
        .replace('://localhost', '://10.0.2.2')
        .replace('://127.0.0.1', '://10.0.2.2');
};

const fallbackApiUrl = Platform.OS === 'android'
    ? DEFAULT_ANDROID_API_URL
    : DEFAULT_IOS_API_URL;

const configuredApiUrl = (ENV_API_URL || '').trim();

export const API_BASE_URL = normalizeAndroidLoopback(configuredApiUrl || fallbackApiUrl);

