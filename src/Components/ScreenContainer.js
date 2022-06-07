
import React, {  Children } from 'react';
import { View, StyleSheet } from 'react-native';

export const ScreenContainer = ({children}) =>{

    return (
         <View style={styles.container}>
             {children}
         </View>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000'
    },
  })