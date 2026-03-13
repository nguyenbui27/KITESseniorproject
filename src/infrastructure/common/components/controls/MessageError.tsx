import React from 'react';
import { Text } from 'react-native';

type Props = {
    isError: boolean,
    message: string
}

export const MessageError = (props: Props) => {
    const { isError = false, message } = props
    return (
        <>
            {
                isError === true && message && message.length ?
                    <Text
                        style={{
                            fontWeight: "600",
                            textAlign: "left",
                            color: "#f61a1a"
                        }}
                    >{message}</Text>
                    :
                    null
            }
        </>
    );
};