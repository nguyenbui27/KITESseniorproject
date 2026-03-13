import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import authService from '../../infrastructure/repositories/auth/auth.service';
import InputTextCommon from '../../infrastructure/common/components/input/input-text-common';
import InputPasswordCommon from '../../infrastructure/common/components/input/input-password-common';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import React from 'react';

const ResetPasswordScreen = () => {
    const [_data, _setData] = useState<any>({});
    const [validate, setValidate] = useState<any>({});
    const [submittedTime, setSubmittedTime] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    const dataProfile = _data;
    const setDataProfile = (data: any) => {
        Object.assign(dataProfile, { ...data });
        _setData({ ...dataProfile });
    };

    const isValidData = () => {
        let allRequestOK = true;
        setValidate({ ...validate });
        Object.values(validate).forEach((it: any) => {
            if (it.isError === true) allRequestOK = false;
        });
        return allRequestOK;
    };

    const onResetAsync = async () => {
        await setSubmittedTime(Date.now());
        if (isValidData()) {
            try {
                await authService.resetPassword(dataProfile.otp, dataProfile.newPassword, setLoading)
                    .then((response) => {
                        if (response) {
                            setDataProfile({ otp: "", newPassword: "" });
                            navigation.replace('LoginScreen');
                        }
                    });
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <ImageBackground source={require("../../assets/images/bgLogin.png")} style={[styles.backgroundImage, { position: "relative", height: "100%" }]}>
                    <View style={[{ width: "100%", height: "100%", position: "absolute" }]} />
                </ImageBackground>
            </View>
            <View style={styles.content}>
                <ScrollView>
                    <KeyboardAvoidingView behavior='padding'>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.form}>
                                <InputTextCommon label={"OTP Code"} attribute={"otp"} dataAttribute={dataProfile.otp} isRequired={false} setData={setDataProfile} editable={true} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <InputPasswordCommon label={"New Password"} attribute={"newPassword"} dataAttribute={dataProfile.newPassword} isRequired={false} setData={setDataProfile} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <ButtonCommon title="Reset Password" onPress={onResetAsync} />
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Text style={styles.forgotPassword}>Go Back</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
            <LoadingFullScreen loading={loading} />
        </View>
    )
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: { backgroundColor: '#F8F9FA', flexDirection: "column", justifyContent: "center", gap: 12, flex: 1 },
    logo: { flex: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    backgroundImage: { width: '100%', height: '100%' },
    content: { flex: 5, paddingHorizontal: 12, paddingVertical: 20 },
    form: { flexDirection: "column", gap: 12 },
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    forgotPassword: { fontSize: 14, color: '#FD3667', fontWeight: "bold" },
});