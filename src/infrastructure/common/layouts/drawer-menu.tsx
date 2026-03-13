import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { bottomNavigator } from '../../../core/common/navigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import authService from '../../repositories/auth/auth.service';
import { configImageURL } from '../../helper/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const width = Dimensions.get('window').width;
const CustomDrawerContent = ({ navigation }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataProfile, setDataProfile] = useState<any>({});

    const getTokenStoraged = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                const response = await authService.profile(() => {});
                if (response) {
                    setDataProfile(response);
                }
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
        <View style={styles.drawerContainer}>
            {/* Header */}
            <View style={styles.profileContainer}>
                <Image
                    source={
                        dataProfile?.avatarCode
                            ? { uri: `${configImageURL(dataProfile?.avatarCode)}` }
                            :
                            require('../../../assets/images/avatar.png')
                    }
                    style={styles.avatar}
                />
                {
                    isLoading
                    &&
                    <View style={{ marginLeft: 10, flexDirection: "column", gap: 8 }}>
                        <Text style={styles.name}>{dataProfile.name}</Text>
                        <Text numberOfLines={1} style={styles.class}>{dataProfile.email}</Text>
                    </View>
                }
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Menu items */}
            {
                bottomNavigator.map((it, index) => {
                    if (it.role.includes(dataProfile?.role || 'parent')) {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => navigation.navigate(it.name)}
                            >
                                <Icon name={it.icon || 'dots-grid'} size={22} color="#fff" style={{ marginRight: 16 }} />
                                <Text style={styles.menuText}>{it.name || it.name}</Text>
                            </TouchableOpacity>
                        )
                    }
                    return null;
                })
            }

            {/* Logout button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogOut}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const DrawerMenu = () => {
    const defaultRoute = bottomNavigator[0]?.name || 'Account';

    return (
        <Drawer.Navigator
            initialRouteName={defaultRoute}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#4f3f97',
                    width: 260,
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            {
                bottomNavigator.map((it, index) => (
                    <Drawer.Screen
                        key={index}
                        name={it.name}
                        component={it.component}
                    />
                ))
            }
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#4f3f97',
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50, height: 50, borderRadius: 25,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    class: {
        color: '#ddd',
        fontSize: 12,
        overflow: "hidden",
        width: 150
    },
    divider: {
        height: 1,
        backgroundColor: '#6a5acd',
        marginVertical: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuText: {
        color: '#fff',
        fontSize: 15,
    },
    logoutBtn: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        color: '#FF6B6B',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default DrawerMenu;
