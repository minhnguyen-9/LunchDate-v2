import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import * as Google from "expo-google-app-auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut,} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({})

const config = {
    iosClientId: '1061893431445-ets465d01du5d1m7588ml2u3254r0f2p.apps.googleusercontent.com',
    androidClientId: '1061893431445-4kr441ovvlmths4blkh6i9ib9p7tk6ad.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissios: ["public_profile", "email", "location"]
}
export const AuthProvider = ({children}) => {
    const [error, setError] = useState(null);
    const[user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true); //help preventing delays from opening the app when user is already logged in 
    const [loading, setLoading] = useState(false); //global loading state that can be access form the sign in screen 
    useEffect(
        () => //implicitly return the unsubscibe without having to set it
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //if they are login
                setUser(user);
            } else{
                //not logged in
                setUser(null);
            }

            setLoadingInitial(false); //help preventing delays from opening the app when user is already logged in
        }),     //if there is change is userstate, this will fire off
        []
        
    );

    const signInWithGoogle = async () =>{
        setLoading(true);
        await Google.logInAsync(config).then(async (logInResult) => {
            if (logInResult.type === 'success') {
                const { idToken, accessToken} = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                // save the user to the firebase database 1:36:00
                await signInWithCredential(auth, credential);  
            }

            return Promise.reject(); //if you fail logging in

        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));

    };

    const logout = async() => {
        setLoading(true);

        signOut(auth).catch((error) => setError(error)).finally(() => setLoading(false));
    };
    
    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
        }), 
        [user,loading,error])

    return (
        <AuthContext.Provider 
            value={memoedValue}
        >
            {/* block the ui and checking for the loadingInitial state */}
            {!loadingInitial && children}    
        </AuthContext.Provider>
    );
};
export default function useAuth() {
    return useContext(AuthContext);
}


