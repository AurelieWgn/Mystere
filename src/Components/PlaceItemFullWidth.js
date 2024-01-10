import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';
import { useNavigation } from '@react-navigation/native';
import {URL_WP_IMG} from '../env';
import LocationIconWithAddres from './Icons/LocationIconWithAddres';

export const PlaceItemFullWidth = React.memo(({data, name}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();

    if(!data){
        return null
    }
 
    const onPress = (id, name) => {
        navigation.navigate('SinglePlaceScreen', { name: name, placeId: id })
    }
    
    useEffect(()=>{
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, data.coords);
            setDistance(distance)
        }
            
    }, [state.userLocation])

   

    const Image_Http_URL = data && data.img ? { uri: `${URL_WP_IMG}${data.img}`} : null;    
    return (
        <TouchableOpacity
            onPress={()=>onPress(data.id, data.name)}
        >
            <View style={{height: 200, marginBottom:10}}> 
                <ImageBackground source={Image_Http_URL} resizeMode="cover" style={{flex:1}}>
                    {
                        state.userLocation && <Text style={styles.distance}>{distance}Km</Text>
                    }
                    <View style={{ width:'100%', position:'absolute', bottom:0, padding:10, backgroundColor:'rgba(0,0,0,0.40)'}}>
                        <Text style={styles.name}>{data.name}</Text>
                        <LocationIconWithAddres addres={data.addres}/>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    distance: {
        color: '#F3E0E2', 
        fontWeight:'bold', 
        fontSize:18, 
        textAlign:'right', 
        padding:5,
        backgroundColor:'rgba(0,0,0,0.40)', 
        borderRadius:5,
        position:'absolute',
        top:0,
        right:0,
    },
    name:{
        color: '#F3E0E2', 
        fontWeight:'600', 
        fontSize:16,
    }
  })

