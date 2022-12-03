import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
import tw from 'tailwind-rn'
import StackNavigator from './StackNavigator';
import {NavigationContainer} from "@react-navigation/native"
import { AuthProvider } from './hooks/useAth';

export default function App() {
  return (
    <NavigationContainer>
      {/* higher order */}
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>

  );
}



