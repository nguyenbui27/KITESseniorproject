import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainLayout from '../../infrastructure/common/layouts/layout';
import InputTextCommon from '../../infrastructure/common/components/input/input-text-common';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import userService from '../../infrastructure/repositories/user/user.service';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import { useIsFocused } from '@react-navigation/native';

type Child = {
    id: string;
    name: string;
    phoneNumber: string;
    accessCode?: string;
    batteryLevel?: number;
};

const ChildrenScreen = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [_data, _setData] = useState<any>({});
    const [validate, setValidate] = useState<Record<string, any>>({});
    const [submittedTime, setSubmittedTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [showForm, setShowForm] = useState(false);
    const isFocused = useIsFocused();

    const dataRequest = _data;
    const setDataRequest = (data: any) => {
        Object.assign(_data, { ...data });
        _setData({ ..._data });
    };

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

    const fetchChildren = async () => {
        try {
            const response = await userService.getChild({ size: 1000 }, setLoading);
            if (response) {
                setChildrenList(response);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to load children list');
            console.error('Fetch children error:', error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchChildren();
        }
    }, [isFocused]);

    const openCreate = () => {
        setEditingId(null);
        setDataRequest({ name: '', phoneNumber: '' });
        setShowForm(true);
    };

    const openEdit = (child: Child) => {
        setEditingId(child.id);
        setDataRequest({
            name: child.name,
            phoneNumber: child.phoneNumber,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setDataRequest({ name: '', phoneNumber: '' });
    };

    const handleAddOrUpdateChild = async () => {
        setSubmittedTime(Date.now());
        if (!isValidData()) return;

        try {
            const childData = {
                name: dataRequest.name,
                phoneNumber: dataRequest.phoneNumber,
            };

            const response = editingId
                ? await userService.updateUser(editingId, childData, setLoading)
                : await userService.createUser(childData, setLoading);

            if (response) {
                await fetchChildren();
                closeForm();
            }
        } catch (error) {
            Alert.alert('Error', editingId ? 'Failed to update child' : 'Failed to create child');
            console.error('Child operation error:', error);
        }
    };

    const handleDeleteChild = (id: string) => {
        Alert.alert('Confirm', 'Are you sure you want to delete this child?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        const response = await userService.deleteUser(id, setLoading);
                        if (response) {
                            await fetchChildren();
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete child');
                        console.error('Delete child error:', error);
                    }
                },
            },
        ]);
    };

    const renderChildItem = ({ item }: { item: Child }) => (
        <View style={styles.childItem}>
            <View style={styles.childInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>
                    Access code: {item.accessCode || '--'} | Phone: {item.phoneNumber || '--'}
                </Text>
                <Text style={styles.details}>Battery: {item.batteryLevel ?? 0}%</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionButton}>
                    <Icon name="pencil" size={20} color="#4f3f97" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteChild(item.id)} style={styles.actionButton}>
                    <Icon name="delete" size={20} color="#ff4d4f" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <MainLayout title={'Children'}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Children list</Text>
                    <TouchableOpacity onPress={openCreate}>
                        <Icon name="plus-circle" size={24} color="#4f3f97" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={childrenList}
                    renderItem={renderChildItem}
                    keyExtractor={item => item.id}
                />
            </View>

            <Modal
                visible={showForm}
                transparent
                animationType="slide"
                onRequestClose={closeForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.sheetTitle}>{editingId ? 'Update child' : 'Add new child'}</Text>
                        <InputTextCommon
                            label="Full name"
                            attribute="name"
                            dataAttribute={dataRequest.name}
                            setData={setDataRequest}
                            isRequired
                            editable
                            validate={validate}
                            setValidate={setValidate}
                            submittedTime={submittedTime}
                        />
                        <InputTextCommon
                            label="Phone number"
                            attribute="phoneNumber"
                            dataAttribute={dataRequest.phoneNumber}
                            setData={setDataRequest}
                            isRequired
                            editable
                            validate={validate}
                            setValidate={setValidate}
                            submittedTime={submittedTime}
                        />
                        <ButtonCommon
                            title={editingId ? 'Update' : 'Add'}
                            onPress={handleAddOrUpdateChild}
                        />
                        <ButtonCommon title="Close" onPress={closeForm} />
                    </View>
                </View>
            </Modal>
            <LoadingFullScreen loading={loading} />
        </MainLayout>
    );
};

export default ChildrenScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4f3f97',
    },
    childItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    childInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        gap: 12,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4f3f97',
    },
});
