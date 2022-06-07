import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Button, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';

export const SinglePlaceScreen = ({route}) =>{
    const [state, dispatch] = useContext(AppContext);
    const { placeId  } = route.params;
    const [place, setPlace] = useState({});
    const [distance, setDistance] = useState(null);
    const [Image_Http_URL, setImage_Http_URL] = useState('');
     
    useEffect(()=>{
        const selectedPlace = state.places.filter(place=>place.id === placeId)[0];
        const Image_url = { uri: `https://xn--mystre-6ua.fr/wp/wp-content/uploads/${selectedPlace.img}`};
        setImage_Http_URL(Image_url)
        setPlace(selectedPlace);
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, selectedPlace.coords);
            setDistance(distance);
        }  
    }, [])

    const onPressShowGoogleMap = () =>{
        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const url = scheme + `${place.coords.latitude},${place.coords.longitude}`;
        Linking.openURL(url);
    }

    return (
        <View style={styles.container}>
             <View >
                <Image source={Image_Http_URL}  style={{maxWidth:'100%', height:180,  resizeMode: 'cover' }}/>
                <Text style={{color: '#FFF', fontWeight:'bold', fontSize:12, padding:5, position:'absolute', bottom:0, right:0}}>{distance}Km</Text>
            </View>
            <View style={{padding:10}}>
                <Text style={{color:'#FFF', fontWeight:'800', fontSize:20, textAlign:'center', paddingTop:10}}>{place.name}</Text>
                <Text style={{color:'red', fontWeight:'800', fontSize:16, paddingBottom:20, paddingTop:10}}><Image source={require('../Img/Places/red_place.png')} style={{width:24, height:24}}/>{place.addres}</Text>
                <Button
                    onPress={()=>onPressShowGoogleMap()}
                    title="Localisation GPS"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <ScrollView>
                    <Text style={{color:'#FFF', fontWeight:'800', fontSize:14, paddingTop:10, textAlign:'justify'}}>{place.description}</Text>
                </ScrollView>
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
