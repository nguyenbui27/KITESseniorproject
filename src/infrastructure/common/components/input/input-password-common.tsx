import React, { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';
import { MessageError } from '../controls/MessageError';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateFields } from '../../../helper/helper';

type Props = {
    label: string,
    attribute: string,
    isRequired: boolean,
    setData: Function,
    dataAttribute?: any,
    validate: any,
    setValidate: Function,
    submittedTime?: any,
    onSubmitEditing?: () => void,
}

const InputPasswordCommon = (props: Props) => {
    const {
        label, attribute, isRequired, setData, dataAttribute,
        validate, setValidate, submittedTime, onSubmitEditing,
    } = props;
    const [value, setValue] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const labelLower = label?.toLowerCase();

    const onBlur = (isImplicitChange: boolean = false) => {
        validateFields(isImplicitChange, attribute, !value, setValidate, validate, !value ? `Please enter ${labelLower}` : "");
    }

    const onChange = (value: string) => {
        setValue(value || "");
        setData({ [attribute]: value || '' });
        validateFields(false, attribute, !value, setValidate, validate, !value ? `Please enter ${labelLower}` : "");
    };

    useEffect(() => { setValue(dataAttribute || ''); }, [dataAttribute]);
    useEffect(() => { if (submittedTime != null) onBlur(true); }, [submittedTime]);

    const toggleShowPassword = () => { setShowPassword(!showPassword); };

    return (
        <KeyboardAvoidingView>
            <View style={styles.container}>
                <View>
                    <TextInput
                        placeholder={`Enter ${labelLower}`}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => onBlur(false)}
                        placeholderTextColor={"#ABABAB"}
                        secureTextEntry={showPassword}
                        returnKeyType='go'
                        onSubmitEditing={onSubmitEditing}
                        style={[
                            { position: "relative" },
                            styles.fontStyle,
                            styles.inputStyle,
                            validate[attribute]?.isError && styles.errorStyle
                        ]}
                    />
                    <Pressable onPress={toggleShowPassword} style={styles.icon}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={16}
                            color={"#ABABAB"}
                        />
                    </Pressable>
                </View>
                <MessageError isError={validate[attribute]?.isError || false} message={validate[attribute]?.message || ""} />
            </View>
        </KeyboardAvoidingView>
    )
};

export default InputPasswordCommon;

const styles = StyleSheet.create({
    container: { marginBottom: 4 },
    fontStyle: { color: "#232323", fontFamily: "Roboto Regular", fontWeight: "900" },
    inputStyle: { borderBottomWidth: 1, borderBottomColor: "#ABABAB", marginBottom: 12 },
    icon: { padding: 8, position: "absolute", right: 0, top: 4 },
    errorStyle: { borderBottomColor: "#f61a1a" },
})