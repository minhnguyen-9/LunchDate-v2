import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import useAuth from './hooks/useAth';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ModalScreen from './screens/ModalScreen';

const Stack = createNativeStackNavigator();



const StackNavigator = () => {
    const {user} = useAuth() ;
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {(user) ? (
                <>
                <Stack.Group>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                </Stack.Group>
                <Stack.Group screenOptions={{presentation: 'modal'}} >
                    <Stack.Screen name = "Modal" component={ModalScreen} />
                </Stack.Group>
                    
                </>
            ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
            )}
            
            

        </Stack.Navigator>
    );
  };

export default StackNavigator;
