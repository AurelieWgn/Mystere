import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';


export const MenuIcon = (props) =>{
    return (
        <View style={styles.container}>
            {props.children}
            {props.focused ? <View style={styles.puce}></View> : <Text style={styles.labelTypo}>{props.name}</Text>}
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
    },
    puce: {
        width: 6,
        height: 6,
        borderRadius : 50,
        backgroundColor : "#773B43",
        marginBottom:4
    },
    labelTypo: {
        fontSize: 10,
        fontWeight:'600',
    }
})