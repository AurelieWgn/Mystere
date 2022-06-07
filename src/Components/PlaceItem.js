import React, { useEffect, useContext, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';


export const PlaceItem = ({data}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();
    const Image_Http_URL ={ uri: `https://xn--mystre-6ua.fr/wp/wp-content/uploads/${data.img}`};

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
                        <Text style={{color: '#FFF', fontWeight:'bold', fontSize:12, padding:5, position:'absolute', bottom:0, right:0}}>{distance}Km</Text>
                    </View>
            
                    <View style={{width:'50%', height:100, textOverflow: 'ellipsis', padding:5 }}>
                        <Text style={{color: '#FFF', fontWeight:'bold', fontSize:16, textAlign:'center'}}>{data.name}</Text>
                        <Text style={{color:'#FFF', fontWeight:'600', fontSize:12 }} numberOfLines={5}>{data.description}</Text>
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
  })

