import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Button, Linking, ScrollView } from 'react-native';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';
import {URL_WP_IMG} from '../env';
import LocationIconWithAddres from '../Components/Icons/LocationIconWithAddres';

export const SinglePlaceScreen = ({route}) =>{
    const [state, dispatch] = useContext(AppContext);
    const { placeId  } = route.params;
    const [place, setPlace] = useState({});
    const [distance, setDistance] = useState(null);
    const [Image_Http_URL, setImage_Http_URL] = useState('');
     
    useEffect(()=>{
        const selectedPlace = state.places.filter(place=>place.id === placeId)[0];
        const Image_url = { uri: `${URL_WP_IMG}${selectedPlace.img}`};
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
                <Image source={Image_Http_URL}  style={styles.placeImg}/>
                {distance && <Text style={styles.KmText}>{distance}Km</Text>}
            </View>
            <View style={{padding:10}}>
                <LocationIconWithAddres addres={place.addres}/>
                <View style={{marginBottom:20}}></View>
                <Button
                    onPress={()=>onPressShowGoogleMap()}
                    title="Localisation GPS"
                    color="#773B43"
                    accessibilityLabel="Localisation GPS"
                />
                <ScrollView>
                    <Text style={styles.descriptionText}>{place.description}</Text>
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
    KmText : {
        color: '#FFF', 
        fontWeight:'bold', 
        fontSize:14, 
        padding:5, 
        position:'absolute', 
        bottom:0, 
        right:0
    },
    placeImg:{
        maxWidth:'100%', 
        height:180,  
        resizeMode: 'cover'
    },
    addresText : {
        color:'#F3E0E2', 
        fontWeight:'600', 
        fontSize:16, 
        paddingBottom:20, 
        paddingTop:10,
        textAlign: 'center'
    },
    descriptionText : {
        color:'#F3E0E2', 
        fontWeight:'400', 
        fontSize:14, 
        paddingTop:10, 
        textAlign:'justify',
        lineHeight: 20
    },
    titleAddresContainer: {
        display:'flex',
        flexDirection: 'row',
        alignItems:'center'
    }
  })
