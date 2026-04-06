import React, { useEffect, useState } from 'react';
import {
    Image,
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

const MainLayout = ({ onGoBack, isBackButton = false, title, ...props }: any) => {
    const [dataProfile, setDataProfile] = useState<any>({});
    const isFocused = useIsFocused();

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
                        onPress={() => { }}
                        onLongPress={() => console.log('SOS pressed')}
                        delayLongPress={800}
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
