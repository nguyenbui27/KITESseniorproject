import React, { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { MessageError } from '../controls/MessageError';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { validateFields } from '../../../helper/helper';
import { validateEmail, validatePhoneNumber, validateCMND } from '../../../helper/validate';

type Props = {
    label: string,
    attribute: string,
    isRequired: boolean,
    setData: Function,
    dataAttribute?: any,
    validate: any,
    setValidate: Function,
    submittedTime: any,
    editable: boolean
}

const InputTextCommon = (props: Props) => {
    const {
        label, attribute, isRequired, setData, dataAttribute,
        validate, setValidate, submittedTime, editable
    } = props;
    const [value, setValue] = useState<string>("");
    const labelLower = label?.toLowerCase();

    const onBlur = (isImplicitChange = false) => {
        let checkValidate;
        validateFields(isImplicitChange, attribute, !value, setValidate, validate, !value ? `Please enter ${labelLower}` : "");
        if (attribute.includes("email")) {
            checkValidate = validateEmail(value);
            validateFields(isImplicitChange, attribute, !checkValidate, setValidate, validate, !checkValidate ? value ? `Please enter a valid ${labelLower} format` : `Please enter ${labelLower}` : "");
        }
        if (attribute.includes("phone")) {
            checkValidate = validatePhoneNumber(value);
            validateFields(isImplicitChange, attribute, !checkValidate, setValidate, validate, !checkValidate ? value ? `Please enter a valid ${labelLower} format` : `Please enter ${labelLower}` : "");
        }
    }

    const onChange = (value: string) => {
        setValue(value || "");
        setData({ [attribute]: value || '' });
        let checkValidate;
        validateFields(false, attribute, !value, setValidate, validate, !value ? `Please enter ${labelLower}` : "");
        if (attribute.includes("email")) {
            checkValidate = validateEmail(value);
            validateFields(false, attribute, !checkValidate, setValidate, validate, !checkValidate ? value ? `Please enter a valid ${labelLower} format` : `Please enter ${labelLower}` : "");
        }
        if (attribute.includes("phone")) {
            checkValidate = validatePhoneNumber(value);
            validateFields(false, attribute, !checkValidate, setValidate, validate, !checkValidate ? value ? `Please enter a valid ${labelLower} format` : `Please enter ${labelLower}` : "");
        }
    };

    useEffect(() => { setValue(dataAttribute || ''); }, [dataAttribute]);
    useEffect(() => { if (submittedTime != null) onBlur(true); }, [submittedTime]);

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
                        editable={editable}
                        keyboardType={attribute.includes("email") ? "email-address" : "default"}
                        style={[
                            { position: "relative" },
                            styles.fontStyle,
                            styles.inputStyle,
                            validate[attribute]?.isError && styles.errorStyle,
                            !editable && styles.editableStyle,
                        ]}
                    />
                    <View style={styles.icon}>
                        {!editable ? <FontAwesome name="ban" size={20} color="#D0FD3E" /> : null}
                    </View>
                </View>
                <MessageError isError={validate[attribute]?.isError || false} message={validate[attribute]?.message || ""} />
            </View>
        </KeyboardAvoidingView>
    )
};

export default InputTextCommon;

const styles = StyleSheet.create({
    container: { marginBottom: 4 },
    fontStyle: { color: "#232323", fontFamily: "Roboto Regular", fontWeight: "900" },
    inputStyle: { borderBottomWidth: 1, borderBottomColor: "#ABABAB", marginBottom: 4 },
    errorStyle: { borderBottomColor: "#f61a1a" },
    editableStyle: { borderBottomColor: "#686b7d", color: "#686b7d" },
    icon: { padding: 8, position: "absolute", right: 0, top: 4 },
})