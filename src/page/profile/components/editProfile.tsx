import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MainLayout from '../../../infrastructure/common/layouts/layout';
import { useNavigation } from '@react-navigation/native';
import InputTextCommon from '../../../infrastructure/common/components/input/input-text-common';
import ButtonCommon from '../../../infrastructure/common/components/button/button-common';
import authService from '../../../infrastructure/repositories/auth/auth.service';
import LoadingFullScreen from '../../../infrastructure/common/components/controls/loading';

const EditProfile = () => {
    const navigation = useNavigation<any>();
    const [_data, _setData] = useState<any>({});
    const [validate, setValidate] = useState<any>({});
    const [submittedTime, setSubmittedTime] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const dataProfile = _data;
    const setDataProfile = (data: any) => {
        Object.assign(dataProfile, { ...data });
        _setData({ ...dataProfile });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await authService.profile(() => { });
            if (response) {
                _setData({
                    name: response.name || '',
                    phoneNumber: response.phoneNumber || '',
                });
            }
        };
        fetchProfile().then(() => { });
    }, []);

    const isValidData = () => {
        let allRequestOK = true;
        setValidate({ ...validate });
        Object.values(validate).forEach((it: any) => {
            if (it.isError === true) {
                allRequestOK = false;
            }
        });
        return allRequestOK;
    };

    const onUpdateProfile = async () => {
        setSubmittedTime(Date.now());
        if (!isValidData()) return;

        const response = await authService.updateProfile({
            name: dataProfile.name,
            phoneNumber: dataProfile.phoneNumber,
        }, setLoading);

        if (response) {
            navigation.goBack();
        }
    };

    return (
        <MainLayout title={'Edit profile'} isBackButton={true} onGoBack={() => navigation.goBack()} noSpaceEnd={true}>
            <View style={styles.container}>
                <InputTextCommon
                    label={"Name"}
                    attribute={"name"}
                    dataAttribute={dataProfile.name}
                    isRequired={true}
                    setData={setDataProfile}
                    editable={true}
                    validate={validate}
                    setValidate={setValidate}
                    submittedTime={submittedTime}
                />
                <InputTextCommon
                    label={"Phone number"}
                    attribute={"phoneNumber"}
                    dataAttribute={dataProfile.phoneNumber}
                    isRequired={true}
                    setData={setDataProfile}
                    editable={true}
                    validate={validate}
                    setValidate={setValidate}
                    submittedTime={submittedTime}
                />
                <ButtonCommon title="Update" onPress={onUpdateProfile} />
            </View>
            <LoadingFullScreen loading={loading} />
        </MainLayout>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 12,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
});
