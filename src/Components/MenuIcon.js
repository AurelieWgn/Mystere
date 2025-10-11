import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';


export const MenuIcon = (props) =>{
    return (
        <View style={styles.container}>
            {props.children}
            {props.focused ? <View style={styles.puce}></View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        paddingTop: 10,
    },
    puce: {
        width: 6,
        height: 6,
        borderRadius : 50,
        backgroundColor : "#773B43",
        marginTop: 4,
        marginBottom:4
    },
    
})