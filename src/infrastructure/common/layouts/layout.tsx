import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import authService from '../../repositories/auth/auth.service';

const MainLayout = ({ onGoBack, isBackButton = false, title, ...props }: any) => {
    const [dataProfile, setDataProfile] = useState<any>({});

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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {isBackButton ? (
                    <Feather name="arrow-left" size={24} color="#fff" onPress={onGoBack} />
                ) : (
                    <MaterialCommunityIcons name="view-grid" size={24} color="#fff" onPress={() => navigation.openDrawer()} />
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{dataProfile?.name || ''}</Text>
                    <Text style={styles.class}>{title}</Text>
                </View>
                {dataProfile?.role === 'child' && (
                    <TouchableOpacity onPress={() => console.log('SOS pressed')} style={styles.round}>
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
    round: {
        width: 36, height: 36, borderRadius: 22, backgroundColor: '#eee',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    textSOS: { color: 'red', fontWeight: 'bold' },
});
