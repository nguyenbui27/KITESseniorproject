import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import MainLayout from '../../infrastructure/common/layouts/layout';
import LoadingFullScreen from '../../infrastructure/common/components/controls/loading';
import userService from '../../infrastructure/repositories/user/user.service';

type ChildPin = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

const MAP_REFRESH_INTERVAL_MS = 10000;

export default function MapScreen() {
    const [childPins, setChildPins] = useState<ChildPin[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const isFocused = useIsFocused();

    const loadChildPinsAsync = async (showLoading: boolean) => {
        const setScreenLoading = showLoading ? setLoading : () => { };
        try {
            const children = await userService.getChild({ size: 1000 }, setScreenLoading);
            if (!Array.isArray(children)) {
                setChildPins([]);
                return;
            }

            const pins = children
                .map((child: any) => {
                    const lat = Number(child?.latestLocation?.latitude);
                    const lon = Number(child?.latestLocation?.longitude);
                    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                        return null;
                    }
                    return {
                        id: String(child?.id || `${child?.name}-${lat}-${lon}`),
                        name: String(child?.name || 'Child'),
                        latitude: lat,
                        longitude: lon,
                    };
                })
                .filter((pin: ChildPin | null): pin is ChildPin => pin !== null);

            setChildPins(pins);
        } catch (error) {
            console.error('Failed to load location list:', error);
        }
    };

    useEffect(() => {
        loadChildPinsAsync(true).then(() => { });
    }, []);

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        loadChildPinsAsync(false).then(() => { });
        const interval = setInterval(() => {
            loadChildPinsAsync(false).then(() => { });
        }, MAP_REFRESH_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isFocused]);

    const focusPin = childPins[0];
    const defaultRegion = focusPin ? {
        latitude: focusPin.latitude,
        longitude: focusPin.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    } : {
        latitude: 39.8283,
        longitude: -98.5795,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <MainLayout title="Map">
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={defaultRegion}
                    mapType="standard"
                >
                    {childPins.map((pin) => (
                        <Marker
                            key={pin.id}
                            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                            title={pin.name}
                            description={`${pin.latitude.toFixed(6)}, ${pin.longitude.toFixed(6)}`}
                        />
                    ))}
                </MapView>
            </View>
            <LoadingFullScreen loading={loading} />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
