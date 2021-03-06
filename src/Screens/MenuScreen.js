import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {ScreenContainer } from '../Components/ScreenContainer';
import { useNavigation } from '@react-navigation/native';

export const MenuScreen = () =>{
    const navigation = useNavigation();

    return (
        <ScreenContainer>
            <View style={styles.itemsContainer}>
                <Image source={require('../Img/Mystere_logo.png')} style={styles.logo} />
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('mapScreen')}>Carte de France</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('contactScreen')}>Contact</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('mentionsScreen')}>Metions légales</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('majScreen')}>Mise à jour</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('helpScreen')}>Besoin d'aide</Text>
            </View>
        </ScreenContainer>
   
    )

}

const styles = StyleSheet.create({
    menuItem: {
        color: '#000',
        textTransform: "uppercase",
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        padding : 4,
    },
    itemsContainer: {
        width: '90%',
        backgroundColor: '#F4F4F4',
        alignSelf: 'center',
        direction:'column',
        justifyContent: 'space-evenly',
        margin: 20,
        height: '90%',
        borderRadius: 5,
        padding: 10,
    },
      logo: {
        maxWidth: '94%',
        height: '40%', 
        resizeMode: 'contain',
        alignSelf:'center',
  },
  })

