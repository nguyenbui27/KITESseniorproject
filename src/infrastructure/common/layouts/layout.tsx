import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    PermissionsAndroid,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { DrawerActions, useIsFocused, useNavigation } from '@react-navigation/native';
import authService from '../../repositories/auth/auth.service';
import inspectorService from '../../repositories/inspector/inspector.service';
import userService from '../../repositories/user/user.service';

const SOS_POLL_INTERVAL_MS = 6000;

const MainLayout = ({ onGoBack, isBackButton = false, title, ...props }: any) => {
    const [dataProfile, setDataProfile] = useState<any>({});
    const [sendingSOS, setSendingSOS] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const latestSeenNotificationIdRef = useRef<string | null>(null);
    const initializedParentNotificationsRef = useRef<boolean>(false);

    const navigation = useNavigation<any>();

    const getProfileUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                return;
            }
            const response = await authService.profile(() => {});
            if (response) {
                setDataProfile(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProfileUser();
    }, []);

    useEffect(() => {
        if (isFocused) {
            getProfileUser();
        }
    }, [isFocused]);

    const onToggleDrawer = () => {
        const appDrawer = navigation.getParent?.('app-drawer');
        if (appDrawer) {
            appDrawer.dispatch(DrawerActions.toggleDrawer());
            return;
        }
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    const sanitizePhoneNumber = (value: string) => String(value || '').trim();

    const getFirstGuardianPhoneAsync = async () => {
        const guardians = await inspectorService.getInspector({ size: 1000 }, () => { });
        if (!Array.isArray(guardians) || guardians.length === 0) {
            return null;
        }

        const currentChildId = String(dataProfile?.id || '').trim();
        const withPhone = guardians.filter((guardian: any) => sanitizePhoneNumber(guardian?.phoneNumber));
        if (withPhone.length === 0) {
            return null;
        }

        const matchedGuardian = withPhone.find((guardian: any) =>
            Array.isArray(guardian?.children) &&
            guardian.children.some((child: any) => String(child?.id || '').trim() === currentChildId),
        );

        return sanitizePhoneNumber((matchedGuardian || withPhone[0])?.phoneNumber);
    };

    const requestCallPermissionIfNeededAsync = async () => {
        if (Platform.OS !== 'android') {
            return true;
        }

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
                title: 'Phone call permission',
                message: 'Allow call permission so SOS can immediately call your guardian.',
                buttonPositive: 'Allow',
                buttonNegative: 'Deny',
                buttonNeutral: 'Later',
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const callFirstGuardianAsync = async () => {
        const phoneNumber = await getFirstGuardianPhoneAsync();
        if (!phoneNumber) {
            return { called: false, message: 'SOS sent, but no guardian phone number is available.' };
        }

        const hasPermission = await requestCallPermissionIfNeededAsync();
        if (!hasPermission) {
            return { called: false, message: 'SOS sent, but call permission was denied.' };
        }

        await Linking.openURL(`tel:${phoneNumber}`);
        return { called: true, message: `Calling first guardian: ${phoneNumber}` };
    };

    const onSendSOSAsync = async () => {
        if (sendingSOS) {
            return;
        }
        setSendingSOS(true);
        try {
            const response = await userService.notificationSOS(() => { });
            const callResult = await callFirstGuardianAsync();
            Alert.alert(
                'SOS sent',
                `Your parent has been notified.\n\nChild: ${response?.childName || dataProfile?.name || 'Child'}\nLocation: ${response?.address || 'Address unavailable'}\n${callResult.message}`,
            );
        } catch (error) {
            Alert.alert('Unable to send SOS', (error as Error)?.message || 'Please try again.');
        } finally {
            setSendingSOS(false);
        }
    };

    const onPressSOS = () => {
        Alert.alert(
            'Send SOS',
            'Send an emergency alert to your parent now?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send SOS', style: 'destructive', onPress: onSendSOSAsync },
            ],
        );
    };

    const checkParentSOSNotificationsAsync = useCallback(async () => {
        if (dataProfile?.role !== 'parent') {
            initializedParentNotificationsRef.current = false;
            latestSeenNotificationIdRef.current = null;
            return;
        }

        try {
            const response = await userService.getMyNotifications({ unreadOnly: true }, () => { });
            const notifications = Array.isArray(response?.notifications) ? response.notifications : [];
            const newest = notifications[0];
            const newestId = String(newest?.id || '').trim();

            if (!newestId) {
                initializedParentNotificationsRef.current = true;
                return;
            }

            if (!initializedParentNotificationsRef.current) {
                latestSeenNotificationIdRef.current = newestId;
                initializedParentNotificationsRef.current = true;
                return;
            }

            if (latestSeenNotificationIdRef.current === newestId) {
                return;
            }

            latestSeenNotificationIdRef.current = newestId;
            Alert.alert(
                'SOS Alert',
                String(newest?.message || `SOS alert from ${newest?.childName || 'Child'}. Last known location: ${newest?.address || 'Address unavailable'}.`),
            );
            await userService.markNotificationRead(newestId, () => { });
        } catch (error) {
            console.error('Failed to poll parent SOS notifications:', error);
        }
    }, [dataProfile?.role]);

    useEffect(() => {
        if (!isFocused || dataProfile?.role !== 'parent') {
            return;
        }

        checkParentSOSNotificationsAsync().then(() => { });
        const intervalId = setInterval(() => {
            checkParentSOSNotificationsAsync().then(() => { });
        }, SOS_POLL_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
        };
    }, [isFocused, dataProfile?.role, checkParentSOSNotificationsAsync]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {isBackButton ? (
                    <Feather name="arrow-left" size={24} color="#fff" onPress={onGoBack} />
                ) : (
                    <Pressable
                        onPress={onToggleDrawer}
                        hitSlop={14}
                        pressRetentionOffset={14}
                        style={({ pressed }) => [
                            styles.leftHeaderActions,
                            pressed && styles.leftHeaderActionsPressed,
                        ]}
                    >
                        <View style={styles.drawerIconWrap}>
                            <Image source={require('../../../assets/images/drawer-icon.jpg')} style={styles.drawerIconImage} />
                        </View>
                        <Text style={styles.menuText}>Menu</Text>
                    </Pressable>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.class}>{title}</Text>
                </View>
                {dataProfile?.role === 'child' && (
                    <TouchableOpacity
                        onPress={onPressSOS}
                        activeOpacity={0.9}
                        style={styles.sosButton}
                    >
                        <Text style={styles.textSOS}>SOS</Text>
                    </TouchableOpacity>
                )}
            </View>
            {props.children}
        </View>
    );
};

export default MainLayout;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerContainer: {
        backgroundColor: '#4f3f97',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    textContainer: { flex: 1, marginLeft: 12 },
    name: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
    class: { fontSize: 12, color: '#ddd', marginTop: 2 },
    leftHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 92,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 16,
    },
    leftHeaderActionsPressed: {
        opacity: 0.75,
    },
    drawerIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        overflow: 'hidden',
    },
    drawerIconImage: {
        width: '100%',
        height: '100%',
    },
    menuText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    sosButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#d62828',
        borderWidth: 2,
        borderColor: '#9d0208',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
        marginTop: 2,
    },
    textSOS: {
        color: '#ffd60a',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 0.4,
    },
});
