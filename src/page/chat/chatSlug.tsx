import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../../infrastructure/common/layouts/layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import conversationService from '../../infrastructure/repositories/conversation/conversation.service';

const ChatSlugScreen = () => {
    const [inputText, setInputText] = useState('');
    const [chatLog, setChatLog] = useState<any[]>([]);
    const [, setLoading] = useState<boolean>(false);

    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { childrenId, chatId, receiverId, name } = route.params || {};
    const flatListRef = useRef<FlatList>(null);

    const getMyChatLogAsync = useCallback(async () => {
        try {
            if (childrenId) {
                const response = await conversationService.getConversationByReceiverId(String(childrenId), setLoading);
                if (response) {
                    setChatLog(response);
                }
                return;
            }

            if (chatId) {
                const response = await conversationService.getChatLogById(String(chatId), setLoading);
                if (response) {
                    setChatLog(response);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, [chatId, childrenId, setLoading]);

    useEffect(() => {
        getMyChatLogAsync();
    }, [getMyChatLogAsync]);

    useEffect(() => {
        const timer = setInterval(() => {
            getMyChatLogAsync();
        }, 3000);
        return () => clearInterval(timer);
    }, [getMyChatLogAsync]);

    const onGoBack = () => {
        navigation.goBack();
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        try {
            await conversationService.sendMessage(
                {
                    receiverId,
                    message: inputText.trim(),
                },
                setLoading,
            );
            setInputText('');
            await getMyChatLogAsync();
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: any) => {
        const isSender = !!item.sender;
        return (
            <View style={[styles.messageContainer, isSender ? styles.userMessage : styles.botMessage]}>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        );
    };

    return (
        <MainLayout title={name || 'Chat'} isBackButton={true} onGoBack={onGoBack} noSpaceEnd={true}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={chatLog}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    contentContainerStyle={styles.chatContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                <KeyboardAvoidingView behavior="padding">
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                            <Text style={styles.sendText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </MainLayout>
    );
};

export default ChatSlugScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4f3f97',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#7059d2',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#4f3f97',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4f3f97',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
    },
});
