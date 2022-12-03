import { useNavigation } from '@react-navigation/native';
// import { TwitterAuthProvider } from 'firebase/auth';
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground } from 'react-native'
// import { ImageBackground } from 'react-native-web';
import useAuth from '../hooks/useAth';
import tw from 'tailwind-rn';
import { TouchableOpacity } from 'react-native';

const LoginScreen = () => {
    const {signInWithGoogle, loading} = useAuth();
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    return (
        <View style={tw("flex-1")}>
            <ImageBackground
                resizeMode = "cover"
                style={tw("flex-1")}
                source={require("../login_logo.png")} //https://assets.hongkiat.com/uploads/app-icon-designs/18-app-icon-designs.jpg
            >
                <TouchableOpacity
                    style={[
                        tw("absolute bottom-40 w-52 bg-gray-200 p-4 rounded-2xl"),
                        {marginHorizontal: "25%"},
                    ]}
                    onPress={signInWithGoogle}
                >
                    <Text style={tw("font-semibold text-center")}>
                        Sign in
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
            {/* <Text>{loading? "loading..." : "Login to the app"} </Text> */}
            {/* <Button title='login' onPress={signInWithGoogle} /> */}
        </View>
    )
}

export default LoginScreen;

