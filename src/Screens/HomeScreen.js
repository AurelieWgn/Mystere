
import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GeolocationSvc from '../Services/GeolocationSvc';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from '../Providers/AppProvider';
import { deleteStockedNotificationForLater, getRandomItem, getStockedNotificationForLater} from '../Utiles';
import {PlaceItemFullWidth} from '../Components/PlaceItemFullWidth'

export const HomeScreen = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [randomPlaces, setRandom] = useState([]);
    const [hasSeenAlertMessage, sethasSeenAlertMessage] = useState(true);
    const locationSvc = new GeolocationSvc();
    const navigation = useNavigation();

    const getLocationPermition = async()=>{
        locationSvc.askForGeolocationPermission().then((resp)=> {
            setLocationPermission(resp)
        });
    }
 
    const initLocation = async() =>{
        try {
      
            Geolocation.getCurrentPosition(
              (data) => {
                pos = {longitude: data.coords.longitude, latitude: data.coords.latitude};
                // return { status: true, pos};
                dispatch({type: "UPDATE_USER_LOCATION", location: pos})
         
              },
              (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true}
            )   
          
          } catch (error) {
    
            console.log("HomeScreen getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };
    }

    // useEffect(()=>{
    //     if(!hasSeenAlertMessage && !locationPermission && !state.userLocation){
    //          Alert.alert(
    //         'Collecte des données de localisation',
    //         "L’application Mystère collecte des données de localisation en arrière-plan pour la localisation approximative, la recherche d’itinéraires et les notifications même lorsque l'application est fermée ou non utilisée.",
    //             [
    //                 {
    //                     text: "j\'ai compris",
    //                     onPress: () => sethasSeenAlertMessage(true),
                
    //                 },
    //             ],
        
    //         );
    //     }
    // },[])

    useEffect(()=>{
        if(!locationPermission && hasSeenAlertMessage){
            getLocationPermition();
        }
        if(!state.userLocation && locationPermission && hasSeenAlertMessage){
            initLocation()
        }
    }, [locationPermission, hasSeenAlertMessage])
    
    useEffect(()=>{
        const numberOfPlaces = 5;
        let finalPlaceArray = []
        if(state.places){
            for(let i = 0; i < numberOfPlaces; i++){
                let item = getRandomItem(state.places);
                finalPlaceArray.push(item);
            }
            setRandom([...new Set(finalPlaceArray)])
        } 
        else{
            console.log('pas de lieux ! ')
        } 
    },[state.places])

    useEffect(
        () =>
        navigation.addListener('beforeRemove', (e) => {
        
            // Prevent default behavior of leaving the screen
            e.preventDefault();

        }),
        [navigation]
    );

    useEffect(()=>{
        // used when the application is killed and user open the notification
        getStockedNotificationForLater().then((stockedNotification)=>{
            if(stockedNotification){
                navigation.navigate('SinglePlaceScreen', { name: stockedNotification.name, placeId: stockedNotification.id })
            }
        })
    })

    renderItem = ({item}) =>{
        return <PlaceItemFullWidth data={item}/> 
    }
    
    return (
        <View style={styles.container}>
            <View>
            {
                !randomPlaces ? 
                    <Text  style={styles.title}>Impossible de charger les informations ...</Text>
                    :  
                    <FlatList
                     ListHeaderComponent={()=>   <Text style={styles.title}>Lieux à découvrir ou redécouvrir</Text>}
                        data={randomPlaces}
                        renderItem={renderItem}
                        keyExtractor={(item, id) => id}
                    />
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000'
    },
    title:{
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        color: '#F3E0E2',
        textAlign: 'center',
        padding:20
    }
  })

