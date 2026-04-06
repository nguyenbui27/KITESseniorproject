import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Linking,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainLayout from '../../infrastructure/common/layouts/layout';
import ButtonCommon from '../../infrastructure/common/components/button/button-common';
import InputTextCommon from '../../infrastructure/common/components/input/input-text-common';
import inspectorService from '../../infrastructure/repositories/inspector/inspector.service';
import userService from '../../infrastructure/repositories/user/user.service';
import authService from '../../infrastructure/repositories/auth/auth.service';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import { useIsFocused } from '@react-navigation/native';

type Inspector = {
    id: string;
    name: string;
    phoneNumber: string;
    children?: Array<{ id: string; name: string }>;
};

type Child = {
    id: string;
    name: string;
};

const InspectorScreen = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [_data, _setData] = useState<any>({});
    const [validate, setValidate] = useState<Record<string, any>>({});
    const [submittedTime, setSubmittedTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [listInspector, setListInspector] = useState<Inspector[]>([]);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [role, setRole] = useState<string>('parent');
    const [showForm, setShowForm] = useState(false);
    const isFocused = useIsFocused();

    const dataRequest = _data;
    const setDataRequest = useCallback((data: any) => {
        _setData((prev: any) => ({ ...prev, ...data }));
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

    const fetchInspectors = async () => {
        try {
            const response = await inspectorService.getInspector({ size: 1000 }, setLoading);
            if (response) {
                setListInspector(response);
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to load guardians list');
            console.error('Fetch guardians error:', error);
        }
    };

    const fetchChildrenAndRole = useCallback(async () => {
        try {
            const profile = await authService.profile(() => { });
            if (profile?.role) {
                setRole(profile.role);
            }
            const children = await userService.getChild({ size: 1000 }, () => { });
            if (children) {
                setChildrenList(children);
                if (children.length > 0) {
                    _setData((prev: any) => (prev.childrenIds ? prev : { ...prev, childrenIds: children[0].id }));
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchInspectors();
        fetchChildrenAndRole();
    }, [fetchChildrenAndRole]);

    useEffect(() => {
        if (isFocused) {
            fetchInspectors();
        }
    }, [isFocused]);

    const openCreate = () => {
        setEditingId(null);
        setDataRequest({ name: '', phoneNumber: '', childrenIds: childrenList[0]?.id || '' });
        setShowForm(true);
    };

    const openEdit = (inspector: Inspector) => {
        setEditingId(inspector.id);
        setDataRequest({
            name: inspector.name,
            phoneNumber: inspector.phoneNumber,
            childrenIds: inspector.children?.[0]?.id || childrenList[0]?.id || '',
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setEditingId(null);
        setShowForm(false);
        setDataRequest({ name: '', phoneNumber: '', childrenIds: childrenList[0]?.id || '' });
    };

    const handleAddOrUpdateInspector = async () => {
        setSubmittedTime(Date.now());
        if (!isValidData()) return;

        try {
            const inspectorData = {
                name: dataRequest.name,
                phoneNumber: dataRequest.phoneNumber,
                childrenIds: dataRequest.childrenIds ? [dataRequest.childrenIds] : [],
            };

            const response = editingId
                ? await inspectorService.updateInspector(editingId, inspectorData, setLoading)
                : await inspectorService.createInspector(inspectorData, setLoading);

            if (response) {
                await fetchInspectors();
                closeForm();
            }
        } catch (error) {
            Alert.alert('Error', (error as Error)?.message || (editingId ? 'Failed to update guardian' : 'Failed to create guardian'));
            console.error('Guardian operation error:', error);
        }
    };

    const handleDeleteInspector = (id: string) => {
        Alert.alert('Confirm', 'Are you sure you want to delete this guardian?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        const response = await inspectorService.deleteInspector(id, setLoading);
                        if (response) {
                            await fetchInspectors();
                        }
                    } catch (error) {
                        Alert.alert('Error', (error as Error)?.message || 'Failed to delete guardian');
                        console.error('Delete guardian error:', error);
                    }
                },
            },
        ]);
    };

    const handleCallPhone = (phone: string) => {
        Alert.alert(
            'Call',
            `Do you want to call ${phone}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) },
            ],
            { cancelable: true },
        );
    };

    const renderInspectorItem = ({ item }: { item: Inspector }) => (
        <View style={styles.guardianItem}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleCallPhone(item.phoneNumber)}>
                    <Text style={styles.details}>
                        Phone: <Text style={styles.phoneLink}>{item.phoneNumber}</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            {role === 'parent' && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionButton}>
                        <Icon name="pencil" size={20} color="#4f3f97" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteInspector(item.id)} style={styles.actionButton}>
                        <Icon name="delete" size={20} color="#ff4d4f" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <MainLayout title={'Guardians'}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Guardian list</Text>
                    {role === 'parent' && (
                        <TouchableOpacity onPress={openCreate}>
                            <Icon name={'plus-circle'} size={22} color="#4f3f97" />
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={listInspector}
                    renderItem={renderInspectorItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
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
                        <Text style={styles.sheetTitle}>
                            {editingId ? 'Update guardian' : 'Add new guardian'}
                        </Text>

                        <InputTextCommon
                            label={"Name"}
                            attribute={"name"}
                            dataAttribute={dataRequest.name}
                            isRequired={true}
                            setData={setDataRequest}
                            editable={true}
                            validate={validate}
                            setValidate={setValidate}
                            submittedTime={submittedTime}
                        />
                        <InputTextCommon
                            label={"Phone number"}
                            attribute={"phoneNumber"}
                            dataAttribute={dataRequest.phoneNumber}
                            isRequired={true}
                            setData={setDataRequest}
                            editable={true}
                            validate={validate}
                            setValidate={setValidate}
                            submittedTime={submittedTime}
                        />
                        <Text style={styles.childLabel}>Assign child</Text>
                        <View style={styles.childChips}>
                            {childrenList.map((child) => {
                                const active = dataRequest.childrenIds === child.id;
                                return (
                                    <TouchableOpacity
                                        key={child.id}
                                        style={[styles.chip, active && styles.chipActive]}
                                        onPress={() => setDataRequest({ childrenIds: child.id })}
                                    >
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{child.name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <ButtonCommon
                            title={editingId ? 'Update' : 'Add'}
                            onPress={handleAddOrUpdateInspector}
                        />

                        <ButtonCommon title={'Close'} onPress={closeForm} />
                    </View>
                </View>
            </Modal>
            <LoadingFullScreen loading={loading} />
        </MainLayout>
    );
};

export default InspectorScreen;

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
    listContainer: {},
    guardianItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    info: { flex: 1 },
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
    phoneLink: {
        color: '#4f3f97',
        textDecorationLine: 'underline',
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
    childLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4f3f97',
    },
    childChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: '#4f3f97',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    chipActive: {
        backgroundColor: '#4f3f97',
    },
    chipText: {
        color: '#4f3f97',
        fontSize: 12,
    },
    chipTextActive: {
        color: '#fff',
    },
});
