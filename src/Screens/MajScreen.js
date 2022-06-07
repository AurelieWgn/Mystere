import React from 'react';
import { ScreenContainer } from "../Components/ScreenContainer"
import { Text } from 'react-native';

export const MajScreen = () =>{
    return (
        <ScreenContainer>
            <Text style={{color: '#FFF', textAlign:'center', fontSize:20, marginTop:30}}>Aucune mise à jour disponible pour le moment</Text>
        </ScreenContainer>
    )
}

