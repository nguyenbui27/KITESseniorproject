import React, { useState } from 'react';
import { Alert, ImageBackground, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputTextCommon from '../../infrastructure/common/components/input/input-text-common';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import authService from '../../infrastructure/repositories/auth/auth.service';

const RegisterVerifyScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const email = String(route?.params?.email || '').trim();
    const [data, setData] = useState<any>({ otp: '' });
    const [validate, setValidate] = useState<any>({});
    const [submittedTime, setSubmittedTime] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const isValidData = () => {
        let allRequestOK = true;
        setValidate({ ...validate });
        Object.values(validate).forEach((it: any) => {
            if (it.isError === true) allRequestOK = false;
        });
        return allRequestOK;
    };

    const onVerifyAsync = async () => {
        setSubmittedTime(Date.now());
        if (!email) {
            Alert.alert('Verification failed', 'Missing email for verification. Please register again.');
            navigation.navigate('RegisterScreen');
            return;
        }
        if (!isValidData()) {
            return;
        }
        const response = await authService.verifySignup(email, data.otp, setLoading);
        if (response) {
            navigation.navigate('LoginScreen');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <ImageBackground
                    source={require("../../assets/images/bgLogin.png")}
                    style={[styles.backgroundImage, { position: "relative", height: "100%" }]}
                >
                    <View style={[{ width: "100%", height: "100%", position: "absolute" }]} />
                </ImageBackground>
            </View>
            <View style={styles.content}>
                <ScrollView>
                    <KeyboardAvoidingView behavior='padding'>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.form}>
                                <Text style={styles.emailText}>Verification code sent to: {email}</Text>
                                <InputTextCommon
                                    label={"6-digit Verification Code"}
                                    attribute={"otp"}
                                    dataAttribute={data.otp}
                                    isRequired={false}
                                    setData={(newData: any) => setData({ ...data, ...newData })}
                                    editable={true}
                                    validate={validate}
                                    setValidate={setValidate}
                                    submittedTime={submittedTime}
                                />
                                <ButtonCommon title="Verify & Complete Register" onPress={onVerifyAsync} />
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                                        <Text style={styles.backText}>Back to Register</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
            <LoadingFullScreen loading={loading} />
        </View>
    );
};

export default RegisterVerifyScreen;

const styles = StyleSheet.create({
    container: { backgroundColor: '#F8F9FA', flexDirection: "column", justifyContent: "center", gap: 12, flex: 1 },
    logo: { flex: 3, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    backgroundImage: { width: '100%', height: '100%' },
    content: { flex: 6, paddingHorizontal: 12, paddingVertical: 20 },
    form: { flexDirection: "column", gap: 12 },
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    backText: { fontSize: 14, color: '#FD3667', fontWeight: "bold" },
    emailText: { color: '#333', fontWeight: '600', marginBottom: 4 },
});
