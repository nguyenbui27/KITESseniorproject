import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../infrastructure/common/layouts/layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import authService from '../../infrastructure/repositories/auth/auth.service';
import Constants from '../../core/common/constants';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import { configImageURL } from '../../infrastructure/helper/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataProfile, setDataProfile] = useState<any>({});

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
                    {/* <TouchableOpacity
                        onPress={onShareLocationAsync}
                        style={styles.menuItem}
                    >
                        <Ionicons name="location-sharp" size={18} color="#4f3f97" />
                        <Text style={styles.menuLabel}>Chia sẻ vị trí</Text>
                    </TouchableOpacity> */}
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
