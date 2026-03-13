import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Constants from './src/core/common/constants';
import { RecoilRoot } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/page/Auth';
import DrawerMenu from './src/infrastructure/common/layouts/drawer-menu';
import ForgotPasswordScreen from './src/page/Auth/forgotPassword';
import ResetPasswordScreen from './src/page/Auth/resetPassword';
import ChatSlugScreen from './src/page/chat/chatSlug';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RegisterScreen from './src/page/Auth/register';
import OtpVerificationScreen from './src/page/Auth/veriify-otp';
import ChangePasswordScreen from './src/page/Auth/changePassword';
import EditProfile from './src/page/profile/components/editProfile';
import ViewProfile from './src/page/profile/components/view';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                setInitialRoute('DrawerMenu');
            } else {
                setInitialRoute('LoginScreen');
            }
        } catch (error) {
            setInitialRoute('LoginScreen');
        }
    };

    useEffect(() => { checkToken(); }, []);

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#4f3f97" />
            </View>
        );
    }

    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"DrawerMenu"} component={DrawerMenu} options={{ headerShown: false }} />
            <Stack.Screen name={Constants.Navigator.Auth.LoginScreen.value} component={LoginScreen} />
            <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} />
            <Stack.Screen name={"OtpVerificationScreen"} component={OtpVerificationScreen} />
            <Stack.Screen name={"ForgotPasswordScreen"} component={ForgotPasswordScreen} />
            <Stack.Screen name={"ResetPasswordScreen"} component={ResetPasswordScreen} />
            <Stack.Screen name={"ChangePasswordScreen"} component={ChangePasswordScreen} />
            <Stack.Screen name={"ChatSlugScreen"} component={ChatSlugScreen} />
            <Stack.Screen name={"EditProfile"} component={EditProfile} />
            <Stack.Screen name={"ViewProfile"} component={ViewProfile} />
        </Stack.Navigator>
    );
};

function App(): React.JSX.Element {
    const navigationRef = React.useRef(null);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RecoilRoot>
                <NavigationContainer ref={navigationRef}>
                    <StackNavigator />
                </NavigationContainer>
            </RecoilRoot>
        </GestureHandlerRootView>
    );
}

export default App;
