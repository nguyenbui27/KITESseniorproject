import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MainLayout from '../../../infrastructure/common/layouts/layout';
import { useNavigation } from '@react-navigation/native';
import authService from '../../../infrastructure/repositories/auth/auth.service';

const ViewProfile = () => {
    const navigation = useNavigation<any>();
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await authService.profile(() => { });
            if (response) {
                setProfile(response);
            }
        };
        fetchProfile().then(() => { });
    }, []);

    const onGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.navigate('Account');
    };

    return (
        <MainLayout title={'Profile details'} isBackButton={true} onGoBack={onGoBack} noSpaceEnd={true}>
            <View style={styles.container}>
                <ScrollView>
                    <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Go Back</Text>
                    </TouchableOpacity>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{profile.name || '--'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{profile.email || '--'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{profile.phoneNumber || '--'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Role</Text>
                        <Text style={styles.value}>{profile.role || '--'}</Text>
                    </View>
                </ScrollView>
            </View>
        </MainLayout>
    );
};

export default ViewProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: '#4f3f97',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#b9b9b9',
    },
    label: {
        fontSize: 14,
        color: '#444',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#222',
    },
});
