import React, { useEffect, useContext, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';
import {URL_WP_IMG} from '../env';

export const PlaceItem = ({data}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();
    const Image_Http_URL ={ uri: `${URL_WP_IMG}${data.img}`};

    const onPress = (id, name) => {
        navigation.navigate('SinglePlaceScreen', { name: name, placeId: id })
    }
    
    useEffect(()=>{
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, data.coords);
            setDistance(distance);
        }  
    }, [state.userLocation])

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={()=>onPress(data.id, data.name)}
        >
            <View style={{height: 120, marginBottom:10, display:'flex', flexDirection:'row'}}> 
                    <View style={{width:'50%', position:'relative', marginBottom:10, marginRight:5 }}>
                        <View >
                            <Image source={Image_Http_URL}  style={{maxWidth:'100%', height:120,  resizeMode: 'cover' }}/>
                        </View>
                        {state.userLocation && <Text style={styles.kmText}>{distance}Km</Text>}
                    </View>
                    <View style={{width:'50%', height:100, textOverflow: 'ellipsis', padding:5 }}>
                        <Text style={{color: '#F3E0E2', fontWeight:'bold', fontSize:16, textAlign:'left'}}>{data.name}</Text>
                        <Text style={{color:'#F3E0E2', fontWeight:'600', fontSize:12, textAlign:'justify' }} numberOfLines={5}>{data.description}</Text>
                    </View>   
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000',
    },
    kmText: {
        color: '#F3E0E2', 
        fontWeight:'bold', 
        fontSize:12, 
        padding:4, 
        position:'absolute', 
        bottom:-6, 
        right:0, 
        backgroundColor:'rgba(0,0,0,0.40)', 
        borderRadius:5
    }
  })

