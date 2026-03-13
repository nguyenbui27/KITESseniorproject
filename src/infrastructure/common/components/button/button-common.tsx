import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

type Props = {
    title: string,
    onPress: () => void,
}

const ButtonCommon = (props: Props) => {
    const { title, onPress } = props;
    return (
        <TouchableOpacity
            style={[styles.btnStyle]}
            onPress={onPress}
        >
            <Text style={styles.fontStyle}>{title}</Text>
        </TouchableOpacity>
    )
}

export default ButtonCommon

const styles = StyleSheet.create({
    btnStyle: {
        backgroundColor: "#FD3667",
        paddingVertical: 16,
        borderRadius: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    fontStyle: {
        color: "#FFF",
        fontFamily: "Roboto Regular",
        fontWeight: "bold",
    },
})