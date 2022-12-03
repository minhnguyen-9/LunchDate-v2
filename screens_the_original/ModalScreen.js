import {useLayoutEffect, React, useState} from 'react'
import { View, Text, Image, TextInput } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'

import tw from 'tailwind-rn'
import useAuth from '../hooks/useAth'
import { TouchableOpacity } from 'react-native'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const ModalScreen = () => {
    const {user} = useAuth();
    const navigation = useNavigation();
    const [image,setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompleteForm = !image  || !age || !job;


    const updateUserProfile = () =>{
        setDoc(doc(db,'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(()=> {
            navigation.navigate("Home")
        }).catch(error=>{   //can create a ui thing here
            alert(error.message);
        });
    };

    return (
        <View style ={tw("flex-1 items-center pt-1")}>
            <Image
                style = {tw('h-20 w-full')}
                resizeMode = 'contain'
                source={require("../homescreen_small_logo.png")}
            />

            <Text style = {tw('text-xl text-gray-500 p-2 font-bold')}>
                Welcome {user.displayName}
            </Text>


            <Text style = {tw('text-center p-4 font-bold text-red-400')}>
                    Step 1: The Profile pic
                </Text>

                <TextInput 
                    value ={image}
                    onChangeText = {text => setImage(text)}
                    style ={tw('text-center text-xl pb-2')}
                    placeholder='Enter a Profile Pic URL'

                />

            <Text style = {tw('text-center p-4 font-bold text-red-400')}>
                    Step 2: Your age
                </Text>

                <TextInput 
                    value = {age}
                    onChangeText={text =>setAge(text)}
                    style ={tw('text-center text-xl pb-2')}
                    placeholder='Enter your age'
                    keyboardType='numeric'
                    maxLength={2}

                />

            <Text style = {tw('text-center p-4 font-bold text-red-400')}>
                    Step 3: Occupation
                </Text>

                <TextInput 
                    value ={job}
                    onChangeText = {text => setJob(text)}
                    style ={tw('text-center text-xl pb-2')}
                    placeholder='Enter your occupation'
                    

                />

            <TouchableOpacity 
                disabled={incompleteForm}
                style ={[
                    tw('w-64 p-3 rounded-xl absolute bottom-10 bg-red-400'),
                    incompleteForm? tw('bg-gray-400') : tw('bg-red-400'), 
                ]} 
                onPress={updateUserProfile}>
                <Text style={tw("text-center text-white text-xl")}>
                    Update Profile
                </Text>
            </TouchableOpacity>

        </View>


    )
}

export default ModalScreen

