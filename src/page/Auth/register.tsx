import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import authService from '../../infrastructure/repositories/auth/auth.service';
import InputTextCommon from '../../infrastructure/common/components/input/input-text-common';
import InputPasswordCommon from '../../infrastructure/common/components/input/input-password-common';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import React from 'react';

const RegisterScreen = () => {
    const [_data, _setData] = useState<any>({});
    const [validate, setValidate] = useState<any>({});
    const [submittedTime, setSubmittedTime] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    const onGoBack = () => navigation.goBack();

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

    const onRegisterAsync = async () => {
        await setSubmittedTime(Date.now());
        if (isValidData()) {
            try {
                await authService.register(
                    {
                        email: dataProfile.email,
                        name: dataProfile.name,
                        password: dataProfile.password,
                        phoneNumber: dataProfile.phoneNumber,
                        confirmPassword: dataProfile.confirmPassword,
                    },
                    setLoading,
                ).then((response) => {
                    if (response) navigation.navigate('LoginScreen');
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

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
                                <InputTextCommon label={"Email"} attribute={"email"} dataAttribute={dataProfile.email} isRequired={false} setData={setDataProfile} editable={true} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <InputTextCommon label={"Full Name"} attribute={"name"} dataAttribute={dataProfile.fullName} isRequired={false} setData={setDataProfile} editable={true} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <InputTextCommon label={"Phone Number"} attribute={"phoneNumber"} dataAttribute={dataProfile.phoneNumber} isRequired={false} setData={setDataProfile} editable={true} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <InputPasswordCommon label={"Password"} attribute={"password"} dataAttribute={dataProfile.password} isRequired={false} setData={setDataProfile} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <InputPasswordCommon label={"Confirm Password"} attribute={"confirmPassword"} dataAttribute={dataProfile.confirmPassword} isRequired={false} setData={setDataProfile} validate={validate} setValidate={setValidate} submittedTime={submittedTime} />
                                <ButtonCommon title="Register" onPress={onRegisterAsync} />
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={onGoBack}>
                                        <Text style={styles.forgotPassword}>Back to Login</Text>
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

export default RegisterScreen;

const styles = StyleSheet.create({
    container: { backgroundColor: '#F8F9FA', flexDirection: "column", justifyContent: "center", gap: 12, flex: 1 },
    logo: { flex: 3, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    backgroundImage: { width: '100%', height: '100%' },
    content: { flex: 6, paddingHorizontal: 12, paddingVertical: 20 },
    form: { flexDirection: "column", gap: 12 },
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    forgotPassword: { fontSize: 14, color: '#FD3667', fontWeight: "bold" },
});