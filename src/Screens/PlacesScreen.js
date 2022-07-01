import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity, Button, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeolocationSvc from '../Services/GeolocationSvc';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance, getPlacesBetween} from '../Utiles';
import FloatingMapIcon from '../Components/Icons/FloatingMapIcon';
import Slider from '@react-native-community/slider';
import {PlaceItem} from '../Components/PlaceItem';
import Geolocation from 'react-native-geolocation-service';


export const PlacesScreen = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [placesBetween, setPlacesBetween] = useState([]);
    const locationSvc = new GeolocationSvc();
    const [maxDistanceValue, setMaxDistanceValue] = useState(50);


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
                dispatch({type: "UPDATE_USER_LOCATION", location: pos})
         
              },
              (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true}
            )   
          
          } catch (error) {
    
            console.log("PlaceScreen getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };
    }

    useEffect(()=>{
        // getLocationPermition();
        if(state.userLocation){
            setMaxDistanceValue(50);
            createChannels();
            const placesBetween = getPlacesBetween(state.userLocation, state.places, maxDistanceValue);
            setPlacesBetween(placesBetween);
        }
    }, [state.userLocation])

    useEffect(()=>{
        if(!locationPermission){
            getLocationPermition();
        }
        if(!state.userLocation){
               initLocation();
        }
    }, [])

 
    const createChannels = () => {
        // PushNotification.createChannel(
        //     {
        //         channelId: "mystere_app",
        //         channelName: "mystere_app"
        //     }
        // )
    }


    const onChangeSliderDistance = (newDistance) => {
        setMaxDistanceValue(Math.round(newDistance))
        if(newDistance === 500){
            setPlacesBetween(state.places)
        }
        else{
            const placesBetween = getPlacesBetween(state.userLocation, state.places, Math.round(newDistance));
            setPlacesBetween(placesBetween)
        }

    }

    const activateLocation = async () =>{
        initLocation()
    }

    
    return (
        <View style={styles.container}>
            {
                !state.userLocation && locationPermission &&
                <View style={styles.sliderContainer}>
                    <Text style={styles.title}>Activez vote position pour accéder aux lieux les plus proches de vous.</Text>
                    <Button onPress={() => activateLocation()} title="Activer ma localisation"/>
                </View>
            }
            {
                !locationPermission && 
                <View style={styles.sliderContainer}>
                    <Text style={styles.title}>Autorisez l'accès à votre position pour accéder aux lieux les plus proches de vous.</Text>
                    <Button onPress={()=>getLocationPermition()} title="Autoriser l'accès à ma position"/>
                </View>
            }
           {
                state.userLocation &&
                <View style={styles.sliderContainer}>
                    <Slider
                        style={{width: '100%', height: 40, color:'#FFF'}}
                        minimumValue={50}
                        maximumValue={+500}
                        minimumTrackTintColor="#53e1ca"
                        maximumTrackTintColor="#FFF"
                        thumbTintColor="#53e1ca"
                        value={maxDistanceValue}
                        onValueChange={onChangeSliderDistance}
                        />
                    <Text style={styles.distanceText}>Lieux à {maxDistanceValue === 500 ? "plus" : 'moins'} de {maxDistanceValue} Kms</Text>
                </View>
            }
           
            {
                placesBetween.length<1 && state.userLocation &&
                    <Text style={styles.title}>Il n'y à pas de lieux à moins de {maxDistanceValue}km.</Text>
            }
            {
                placesBetween.length>0 &&
                <>
                    
                    <FlatList
                        data={placesBetween}
                        renderItem={({item}) => <PlaceItem data={item}/> }
                        keyExtractor={(item, id) => id}
                        // ListHeaderComponent={()=>   }
                    />
                </>        
            }
            <View style={{position:'absolute', bottom:20, right:20}}>
                <FloatingMapIcon/>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000',
     padding:5
    },
     title:{
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        color: '#F3E0E2',
        textAlign: 'center',
        padding:20
    },
    distanceText:{
         fontSize: 16,
        fontWeight: '800',
        color: '#F3E0E2',
        textAlign: 'center',
        // padding:10
    },
    sliderContainer:{
        marginTop: 20,
        marginBottom: 40,
    }
})
