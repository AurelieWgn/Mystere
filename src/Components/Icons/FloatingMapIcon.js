import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FloatingMapIcon = () =>{
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{width:80, height:80, borderColor:'#F3E0E2', borderWidth:2, borderRadius:100, padding: 10,  justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(255,255,255,0.6)'}} onPress={()=>navigation.navigate('mapScreen')} >
            <Image source={require(`../../Img/MapIcon.png`)}  style={{maxWidth:'100%', height:100,  resizeMode: 'contain' }}/>
        </TouchableOpacity>
    )
}
export default FloatingMapIcon