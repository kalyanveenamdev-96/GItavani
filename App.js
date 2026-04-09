import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import { COLORS } from './src/styles/theme';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.warmWhite,
                    },
                    headerTintColor: COLORS.deepMaroon,
                    headerTitleStyle: {
                        fontWeight: '700',
                    },
                    headerShadowVisible: false,
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Quote"
                    component={QuoteScreen}
                    options={{
                        title: 'Your Gita Wisdom',
                        headerBackTitle: 'Back',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
