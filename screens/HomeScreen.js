import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Button,Image, SafeAreaView, Touchable } from 'react-native'
import { TouchableOpacity } from 'react-native';
import useAuth from '../hooks/useAth';
import tw from 'tailwind-rn'
import Swiper from 'react-native-deck-swiper';  //2:23:00

import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons"
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = () => {

    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles,setProfiles] = useState([]);
    const swipeRef = useRef(null);  //2:45:11

    console.log(user);

    useLayoutEffect(()=> {
        navigation.setOptions({
            headerShown:false,
        });
        
    }, []);

    useLayoutEffect(
        ()=> onSnapshot(doc(db,'users', user.uid), snapShot => {
            if(!snapShot.exists()){
                navigation.navigate('Modal');
            }
        }),
        []
    );

    useEffect(() => {
       let unsub;
       const fetchCards = async() =>{
            const passes = await getDocs(collection(db,'users', user.uid, 'passes')).then
            ((snapshot) =>snapshot.docs.map((doc) =>doc.id)
            );

            const swipes = await getDocs(collection(db,'users', user.uid, 'swipes')).then
            ((snapshot) =>snapshot.docs.map((doc) =>doc.id)
            );

            const passedUserIds = passes.length > 0? passes: ['test'];
            const swipedUserIds = swipes.length > 0? passes: ['test'];

            unsub = onSnapshot(
                query(
                    collection(db, 'users'),
                    where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), //to make sure that you will never see duplicated
            (snapshot) =>{
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== user.uid).map(doc=>({
                        id : doc.id,
                        ...doc.data(),
                    }))
                    );
            });
       };
       fetchCards(); //if you ever want to have a asyncronous call inside of a use effect, you have to wrap it in a asyncronous function
       return unsub;
    }, [db]);

    const DUMMY_DATA = [
        {
            firstName: "Megan",
            lastName: "Fox",
            occupation: "Beauty God",
            photoURL: "https://media.gettyimages.com/photos/megan-fox-attends-the-pubg-mobiles-fight4theamazon-event-at-avalon-picture-id1193008098?s=2048x2048",
            age: 29,
            id: 123,
        },
        {
            firstName: "Pete",
            lastName: "Davidson",
            occupation: "Cool stoner",
            photoURL: "https://media.gettyimages.com/photos/episode-740-pictured-comedian-pete-davidson-on-september-27-2018-picture-id1042108366?s=2048x2048",
            age: 29,
            id:456,
    
        },
        {
            firstName: "Nick",
            lastName: "Miller",
            occupation: "Bartender",
            photoURL: "https://media.gettyimages.com/photos/actor-benedict-cumberbatch-is-seen-on-the-set-of-doctor-strange-on-2-picture-id518892994?s=2048x2048",
            age: 31,
            id:789,
        },
    ];



    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log('You swiped Pass on '+ userSwiped.displayName);
        setDoc(doc(db,'users', user.uid, 'passes', userSwiped.id), userSwiped);

    };
    const swipeRight = async (cardIndex) =>{
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log('You swipe on ' + userSwiped.displayName + ' ' + userSwiped.job)
        setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id), 
            userSwiped
        ); //3:47:00 sth abt the limit of users, could be potentially use to fix bug

    };

    return (
        <SafeAreaView style={tw("flex-1")}>
            
            {/* Header  */}
            <View style={tw("flex-row items-center relative justify-between px-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image 
                        style={tw("h-10 w-10 rounded-full")} 
                        source={{uri: user.photoURL}}
                    /> 
                </TouchableOpacity>
       

                <TouchableOpacity onPress={()=> navigation.navigate('Modal')}>
                    <Image style ={tw("h-16 w-16")} source={require("../homescreen_small_logo.png")}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name='chatbubbles-sharp' size={30} color="#d6335c" />
                </TouchableOpacity>
            </View>
            {/* end header  */}

            {/* Cards */}
            <View style={tw('flex-1 -mt-6')}>
                <Swiper 
                ref = {swipeRef}
                containerStyle={{ backgroundColor: 'transparent' }}
                cards={profiles} //cards={DUMMY_DATA}
                stackSize={5}
                cardIndex={0}
                animateCardOpacity
                verticalSwipe={false}
                onSwipedLeft={ (cardIndex)=>{
                    console.log("Swipe PASS");
                    swipeLeft(cardIndex);
                }}
                onSwipedRight={ (cardIndex)=> {
                    console.log('Swipe MATCH');
                    swipeRight(cardIndex);

                }}
                overlayLabels={{
                    left:{
                        title: "not yet",
                        style:{
                            label: {
                                textAlign: "right",
                                color: "white",
                            },
                        },
                    },
                    right:{
                        title: "Lunch?",
                        style:{
                            label: {
                                textAlign: "left",
                                color: "white",
                            },
                        },
                    },
                }}
                renderCard={(card) => card? (

                    <View key={card.id} style={tw("relative bg-white h-3/4 rounded-xl")}>
                        <Image 
                        style={tw("absolute top-0 h-full w-full rounded-xl")}
                        source={{uri: card.photoURL}}
                        />

                        <View style = {[
                            tw("absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2"),
                            styles.cardShadow]}
                        >
                            <View>
                                <Text style ={tw("text-xl font-bold")}>{card.displayName}</Text>
                                <Text>{card.occupation}</Text>

                            </View>
                            <Text style = {tw("text-2xl font-bold")}> {card.age}</Text>
                        </View>
                    </View>

                ) : (
                    <View 
                    style = {[
                        tw('relative bg-white h-3/4 rounded-xl justify-center items-center'),
                        styles.cardShadow,

                    ]}
                    >
                        <Text style={tw('font-bold pb-5')}> No more profiles</Text>
                        <Image
                            style={tw('h-20 w-full')}
                            height={100}
                            width={100}
                            source={{uri: "https://links.papareact.com/6gb"}}
                        />
                    </View>
                    )}
                />
            </View>
            {/* end cards */}

            {/* button */}
            <View style = {tw('flex flex-row justify-evenly')}>
                <TouchableOpacity 
                onPress={() => swipeRef.current.swipeLeft()}
                style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-100')}>
                    <Entypo name = "cross" size={24} color="red"/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => swipeRef.current.swipeRight()}
                style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200')}>
                    <AntDesign name = "heart" size={24} color="green" />
                </TouchableOpacity>
            </View>

            {/* end button */}

         

            {/* <Text>I am HomeScreen</Text>
            <Button title="Go to chat" onPress={() => navigation.navigate('Chat')} />
            <Button title= "logout" onPress={logout}/> */}
        </SafeAreaView>
    );
};



export default HomeScreen

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width:0,
            height:1,
        },
    
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation:2,
    },
});