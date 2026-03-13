import React from 'react'
import { StyleSheet } from 'react-native'
import { ActivityIndicator, View } from 'react-native'

type Props = {
    loading: boolean
}

const LoadingFullScreen = ({ loading }: Props) => {
    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator color={"#ffffff"} size={24} />
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000081",
        zIndex: 99999,
    }
});

export default LoadingFullScreen