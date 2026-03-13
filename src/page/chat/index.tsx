import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../infrastructure/common/layouts/layout';
import conversationService from '../../infrastructure/repositories/conversation/conversation.service';
import userService from '../../infrastructure/repositories/user/user.service';
import authService from '../../infrastructure/repositories/auth/auth.service';
import { convertTimeOnly } from '../../infrastructure/helper/helper';
import { useIsFocused } from '@react-navigation/native';

const ChatListScreen = ({ navigation }: any) => {
    const [, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<number>(1);
    const [myConversation, setMyConversation] = useState<any[]>([]);
    const [myChildren, setMyChildren] = useState<any[]>([]);
    const [parent, setParent] = useState<any>({});
    const [myChildrenNew, setMyChildrenNew] = useState<any[]>([]);
    const [role, setRole] = useState<string>('parent');
    const isFocused = useIsFocused();

    const getMyConversationAsync = async () => {
        try {
            const response = await conversationService.getMyConversation(setLoading);
            if (response) {
                setMyConversation(response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getMyChildrenAsync = async () => {
        try {
            const profile = await authService.profile(() => { });
            const currentRole = profile?.role || 'parent';
            setRole(currentRole);

            if (currentRole === 'parent') {
                const response = await userService.getChild({ size: 1000 }, setLoading);
                if (response) {
                    setMyChildren(response);
                }
            } else {
                const response = await userService.getParent(setLoading);
                if (response) {
                    setParent(response);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMyChildrenAsync().then(() => { });
        getMyConversationAsync().then(() => { });
    }, []);

    useEffect(() => {
        if (isFocused) {
            getMyChildrenAsync().then(() => { });
            getMyConversationAsync().then(() => { });
        }
    }, [isFocused]);

    useEffect(() => {
        const timer = setInterval(() => {
            getMyConversationAsync().then(() => { });
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (role === 'parent') {
            setMyChildrenNew(myChildren);
        } else {
            setMyChildrenNew(parent?.id ? [parent] : []);
        }
    }, [myChildren, myConversation, role, parent]);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
                navigation.navigate('ChatSlugScreen', {
                    chatId: item.id,
                    receiverId: item.wantToSendUser.id,
                    name: item.wantToSendUser.name,
                });
            }}
        >
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.wantToSendUser?.name?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.wantToSendUser?.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            <Text style={styles.time}>{item.lastMessageTime ? convertTimeOnly(item.lastMessageTime) : ''}</Text>
        </TouchableOpacity>
    );

    const renderItemUser = ({ item }: any) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
                navigation.navigate('ChatSlugScreen', {
                    childrenId: item.id,
                    receiverId: item.id,
                    name: item.name,
                });
            }}
        >
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.name?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <MainLayout title={'Chat'}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setTab(1)}>
                        <Text style={[styles.headerText, tab === 1 && styles.active]}>Chats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTab(2)}>
                        <Text style={[styles.headerText, tab === 2 && styles.active]}>Contacts</Text>
                    </TouchableOpacity>
                </View>

                {tab === 1 ? (
                    <FlatList
                        data={myConversation}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <FlatList
                        data={myChildrenNew}
                        renderItem={renderItemUser}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </MainLayout>
    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        gap: 12,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4f3f97',
        padding: 6,
    },
    active: {
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#4f3f97',
    },
    listContainer: {},
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingVertical: 12,
        borderColor: '#eee',
    },
    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#4f3f97',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});
