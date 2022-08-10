import React from 'react';
import { Text, View, StyleSheet, Image, Switch } from 'react-native';
import {ScreenContainer } from '../Components/ScreenContainer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {stopStask, startStask, backgroundTaskIsRunning} from '../Utiles';

export const MenuScreen = () =>{
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = React.useState(true);
    const toggleSwitch = async () => {
        setIsEnabled(!isEnabled)
        await AsyncStorage.setItem('notifications_status', `${!isEnabled}`)
        if(!isEnabled === false)
            await stopStask();
        else
           backgroundTaskIsRunning() ? null : await startStask();
    };

    React.useEffect(()=>{
        const initToggle = async () =>{     
            try {
                const notifiactionsStatus = await AsyncStorage.getItem('notifications_status');
                if(notifiactionsStatus){
                    setIsEnabled(JSON.parse(notifiactionsStatus))
                }
            } catch (e) {
                console.log("[Menu] --> Can't update notifications_status by menu toggle")
            }
        };
        initToggle();
    }, [])

    return (
        <ScreenContainer>
            <View style={styles.itemsContainer}>
                <Image source={require('../Img/Mystere_logo.png')} style={styles.logo} />
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('mapScreen')}>Carte de France</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('contactScreen')}>Contact</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('mentionsScreen')}>Mentions légales</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('majScreen')}>Mise à jour</Text>
                <Text  style={styles.menuItem} onPress={()=>navigation.navigate('helpScreen')}>Besoin d'aide</Text>
                <View style={styles.toggleContainer}>
                    <Text style={styles.notifItemText}>Notifications actives</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#767577" }}
                        thumbColor={isEnabled ? "black" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <Text style={styles.notifItemSubText}>Activez les notifications pour recevoir des alertes lorsque vous passez à proximité d'un lieu intéressent.</Text>
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
        height: '95%',
        borderRadius: 5,
        padding: 10,
    },
    logo: {
        maxWidth: '90%',
        height: '28%', 
        resizeMode: 'contain',
        alignSelf:'center',
    },
    toggleContainer: {
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifItemText:{
        marginRight: 5,
    },
    notifItemSubText:{
        textAlign:'center',
        fontSize:12
    }
  })
