import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FloatingMapIcon = () =>{
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{width:100, height:100, borderColor:'#FFF', borderWidth:4, borderRadius:100, padding: 10,  justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(255,255,255,0.7)'}} onPress={()=>navigation.navigate('mapScreen')} >
            <Image source={require(`../Img/MapIcon.png`)}  style={{maxWidth:'100%', height:100,  resizeMode: 'contain' }}/>
        </TouchableOpacity>
    )
}
export default FloatingMapIcon