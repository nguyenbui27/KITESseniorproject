import {
    Alert,
    Image,
    PermissionsAndroid,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../../infrastructure/common/layouts/layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import authService from '../../infrastructure/repositories/auth/auth.service';
import Constants from '../../core/common/constants';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import { configImageURL } from '../../infrastructure/helper/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import userService from '../../infrastructure/repositories/user/user.service';
import DeviceInfo from 'react-native-device-info';

const ProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataProfile, setDataProfile] = useState<any>({});
    const [isRealtimeSharing, setIsRealtimeSharing] = useState<boolean>(false);
    const watchIdRef = useRef<number | null>(null);
    const lastSharedAtRef = useRef<number>(0);
    const isEmulatorRef = useRef<boolean>(false);

    const navigateEditProfile = (value: string) => {
        navigation.navigate(value);
    };

    const getTokenStoraged = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(true);
        }
    };
    useEffect(() => {
        getTokenStoraged();
    }, []);

    useEffect(() => {
        if (!token) return;

        const loadProfile = async () => {
            try {
                const response = await authService.profile(() => { });
                if (response) {
                    setDataProfile(response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadProfile();
    }, [token]);

    const onLogOutAsync = async () => {
        try {
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
                setIsRealtimeSharing(false);
            }
            await authService.logout(setLoading).then(() => {
                navigation.navigate('LoginScreen');
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onLogOut = () => {
        Alert.alert('Sign Out', 'Do you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', onPress: () => onLogOutAsync() },
        ]);
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location permission',
                    message: 'Allow location access to share your current position with parent.',
                    buttonNeutral: 'Ask me later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const sharePositionAsync = async (position: any) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        const accuracy = Number(position.coords.accuracy || 0);
        await userService.shareLocation(
            {
                latitude,
                longitude,
                accuracy,
                capturedAt: new Date().toISOString(),
            },
            () => { },
        );
        return { latitude, longitude, accuracy };
    };

    const stopRealtimeSharing = () => {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsRealtimeSharing(false);
    };

    const onToggleRealtimeLocationAsync = async () => {
        if (isRealtimeSharing) {
            stopRealtimeSharing();
            Alert.alert('Live location stopped', 'Realtime location sharing has been turned off.');
            return;
        }

        const granted = await requestLocationPermission();
        if (!granted) {
            Alert.alert('Permission denied', 'Location permission is required.');
            return;
        }

        setLoading(true);
        Geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude, accuracy } = await sharePositionAsync(position);
                    lastSharedAtRef.current = Date.now();
                    const looksLikeDefaultEmulatorPoint =
                        Math.abs(latitude - 37.4219983) < 0.01 &&
                        Math.abs(longitude - (-122.084)) < 0.01;
                    if (isEmulatorRef.current && looksLikeDefaultEmulatorPoint) {
                        Alert.alert(
                            'Emulator default location',
                            'Your emulator is using its default GPS point. Set emulator location manually to test your real place.',
                        );
                    }

                    watchIdRef.current = Geolocation.watchPosition(
                        async (nextPosition) => {
                            const now = Date.now();
                            if (now - lastSharedAtRef.current < 5000) {
                                return;
                            }
                            lastSharedAtRef.current = now;
                            try {
                                await sharePositionAsync(nextPosition);
                            } catch (error) {
                                console.error('Realtime location share failed:', error);
                            }
                        },
                        (error) => {
                            console.error('watchPosition error:', error);
                        },
                        {
                            enableHighAccuracy: true,
                            distanceFilter: 5,
                            interval: 5000,
                            fastestInterval: 3000,
                            forceRequestLocation: true,
                            showLocationDialog: true,
                        },
                    );

                    setIsRealtimeSharing(true);
                    Alert.alert(
                        'Live location started',
                        `Now sharing realtime location.\n\nLat: ${latitude.toFixed(6)}\nLng: ${longitude.toFixed(6)}\nAccuracy: ${Math.round(accuracy)}m`,
                    );
                } catch (error) {
                    Alert.alert('Error', (error as Error)?.message || 'Unable to start realtime sharing.');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setLoading(false);
                Alert.alert('Error', error.message || 'Unable to get current location.');
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
                forceRequestLocation: true,
                showLocationDialog: true,
            },
        );
    };

    useEffect(() => {
        DeviceInfo.isEmulator()
            .then((result) => {
                isEmulatorRef.current = result;
            })
            .catch(() => {
                isEmulatorRef.current = false;
            });

        return () => {
            if (watchIdRef.current !== null) {
                Geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, []);

    return (
        <MainLayout title={'Profile'}>
            <View style={styles.container}>
                {/* Avatar + Name + email */}
                <View style={styles.profileBox}>
                    <Image
                        source={
                            dataProfile?.avatarCode
                                ? { uri: `${configImageURL(dataProfile?.avatarCode)}` }
                                :
                                require('../../assets/images/avatar.png')
                        }
                        style={styles.avatar}
                    />
                    {
                        isLoading
                        &&
                        <View style={{ marginLeft: 16 }}>
                            <Text style={styles.name}>{dataProfile?.name}</Text>
                            <Text style={styles.email}>{dataProfile?.email}</Text>
                        </View>
                    }

                </View>

                {/* Menu */}
                    <View style={styles.menuList}>
                        {Constants.InfoUser.List.map((it, index) => {
                        if (it.roles.includes(dataProfile?.role || 'parent')) {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigateEditProfile(it.value)}
                                    style={styles.menuItem}
                                >
                                    <Ionicons name={it.icon} size={18} color="#4f3f97" />
                                    <Text style={styles.menuLabel}>{it.label}</Text>
                                </TouchableOpacity>
                            )
                        }
                        return null;
                    })}
                    {dataProfile?.role === 'child' && (
                        <TouchableOpacity onPress={onToggleRealtimeLocationAsync} style={styles.menuItem}>
                            <Ionicons name="location-sharp" size={18} color="#4f3f97" />
                            <Text style={styles.menuLabel}>
                                {isRealtimeSharing ? 'Stop Live Location Sharing' : 'Share Live Location'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {/* Sign Out */}
                    <TouchableOpacity onPress={onLogOut} style={[styles.menuItem, styles.logoutItem]}>
                        <Ionicons name="log-out-outline" size={18} color="#FF4D4D" />
                        <Text style={[styles.menuLabel, { color: '#FF4D4D' }]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <LoadingFullScreen loading={loading} />
        </MainLayout >
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#4f3f97',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#121212',
    },
    email: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    menuList: {
        marginTop: 16,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#ececec',
    },
    menuLabel: {
        marginLeft: 14,
        fontSize: 15,
        color: '#4f3f97',
        fontWeight: '600',
    },
    logoutItem: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 24,
    },
});
