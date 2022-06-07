import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';
import { useNavigation } from '@react-navigation/native';

export const PlaceItemFullWidth = ({data, name}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();

    const onPress = (id, name) => {
        navigation.navigate('SinglePlaceScreen', { name: name, placeId: id })
    }
    
    useEffect(()=>{
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, data.coords);
            setDistance(distance)
        }
            
    }, [state.userLocation])
    const Image_Http_URL ={ uri: `https://xn--mystre-6ua.fr/wp/wp-content/uploads/${data.img}`};    
    return (
        <TouchableOpacity
            onPress={()=>onPress(data.id, data.name)}
        >
            <View style={{height: 200, marginBottom:10}}> 
                <ImageBackground source={Image_Http_URL} resizeMode="cover" style={{flex:1}}>
                    <Text style={styles.distance}>{distance}Km</Text>
                    <View style={{ width:'100%', position:'absolute', bottom:0, padding:10}}>
                        <Text style={styles.name}>{data.name}</Text>
                        <Text style={styles.addres}><Image source={require('../Img/Places/red_place.png')} style={{width:24, height:24}}/>{data.addres}</Text>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    distance: {
        color: '#FFF', 
        fontWeight:'bold', 
        fontSize:18, 
        textAlign:'right', 
        padding:5
    },
    name:{
        color: '#FFF', 
        fontWeight:'bold', 
        fontSize:20
    },
    addres: {color:'#FFF', fontWeight:'800', fontSize:16}
  })

