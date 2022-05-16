import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const FloatingMapIcon = () =>{
    return (
        <TouchableOpacity style={{width:100, height:100, borderColor:'#FFF', borderWidth:4, borderRadius:100, padding: 10,  justifyContent: 'center',
        alignItems: 'center', backgroundColor:'rgba(255,255,255,0.7)'}} onPress={()=>console.log("coucou")} >
            <Image source={require(`../Img/MapIcon.png`)}  style={{maxWidth:'100%', height:100,  resizeMode: 'contain' }}/>
        </TouchableOpacity>
    )
}
export default FloatingMapIcon