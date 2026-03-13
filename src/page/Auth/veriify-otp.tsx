import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import authService from '../../infrastructure/repositories/auth/auth.service';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';

const OtpVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [accessCode, setAccessCode] = useState<string>('');

    const handleVerifyOtp = async () => {
        const fullOtp = accessCode.trim();
        if (fullOtp.length !== 6) {
            return;
        }
        try {
            setLoading(true);
            await authService.loginOTP(fullOtp, setLoading).then((response) => {
                if (response) navigation.replace('DrawerMenu');
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.navigate('LoginScreen');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoid}>
            <View style={styles.container}>
                <Text style={styles.subtitle}>Enter the 6-digit access code</Text>
                <TextInput
                    style={styles.codeInput}
                    value={accessCode}
                    onChangeText={(text) => setAccessCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="6-digit access code"
                    placeholderTextColor="#999"
                />
                <ButtonCommon title="Sign In" onPress={handleVerifyOtp} />
                <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
                    <Text style={styles.backText}>← Go Back</Text>
                </TouchableOpacity>
            </View>
            <LoadingFullScreen loading={loading} />
        </KeyboardAvoidingView>
    );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
    keyboardAvoid: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 32, backgroundColor: "#FFF" },
    subtitle: { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 8 },
    codeInput: {
        borderWidth: 2,
        borderColor: '#007BFF',
        borderRadius: 10,
        height: 56,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 4,
    },
    backBtn: { marginTop: 20, alignItems: 'center' },
    backText: { fontSize: 14, color: '#007BFF', fontWeight: '500', textDecorationLine: 'underline' },
});
