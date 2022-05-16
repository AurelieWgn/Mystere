import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity, Button, Linking } from 'react-native';
import {AppContext} from '../Providers/AppProvider';

const SinglePlaceScreen = ({route}) =>{
    const [state, dispatch] = useContext(AppContext);
    const { placeId  } = route.params;
    const [place, setPlace] = useState({});
  

    useEffect(()=>{
        const selectedPlace = state.places.filter(place=>place.id === placeId)[0];
        setPlace(selectedPlace);
    }, [])

    const onPressShowGoogleMap = () =>{
        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const url = scheme + `${place.coords.latitude},${place.coords.longitude}`;
        Linking.openURL(url);
    }

    return (
        <View style={styles.container}>
             <View >
               <Image source={require(`../Img/Places/Versailles.jpg`)}  style={{maxWidth:'100%', height:180,  resizeMode: 'cover' }}/>
            </View>
            <View style={{padding:10}}>
                <Text  style={{color:'#FFF', fontWeight:'800', fontSize:20, textAlign:'center', paddingTop:10}}>{place.name}</Text>
                <Text style={{color:'red', fontWeight:'800', fontSize:16, paddingBottom:20, paddingTop:10}}><Image source={require('../Img/Places/red_place.png')} style={{width:24, height:24}}/>{place.addres}</Text>
                <Button
                    onPress={()=>onPressShowGoogleMap()}
                    title="Localisation GPS"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Text style={{color:'#FFF', fontWeight:'800', fontSize:14, paddingTop:10, textAlign:'justify'}}>{place.description}</Text>
            </View>
        </View>
   
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000',
     paddingTop: 0   
    },
  })


export default SinglePlaceScreen