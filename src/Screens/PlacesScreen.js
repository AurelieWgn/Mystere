import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeolocationSvc from '../Services/GeolocationSvc';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance, getPlacesBetween} from '../Utiles';
import FloatingMapIcon from '../Components/FloatingMapIcon';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { AppRegistry } from 'react-native';
import App from '../../App';
import RNLocation from 'react-native-location';
import Slider from '@react-native-community/slider';
import {PlaceItem} from '../Components/PlaceItem';

ReactNativeForegroundService.register();
AppRegistry.registerComponent('Mystere', () => App);

RNLocation.configure({
  distanceFilter: 100, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});
let locationSubscription = null;
let locationTimeout = null;


// ReactNativeForegroundService.add_task(
//   () => {
//       console.log('hey ! 2')
//     RNLocation.requestPermission({
//       ios: 'whenInUse',
//       android: {
//         detail: 'fine',
//       },
//     }).then((granted) => {
//       console.log('Location Permissions: ', granted);
//       // if has permissions try to obtain location with RN location
//       if (granted) {
//         locationSubscription && locationSubscription();
//         locationSubscription = RNLocation.subscribeToLocationUpdates(
//           ([locations]) => {
//             locationSubscription();
//             locationTimeout && clearTimeout(locationTimeout);
//             console.log(locations);
//           },
//         );
//       } else {
//         locationSubscription && locationSubscription();
//         locationTimeout && clearTimeout(locationTimeout);
//         console.log('no permissions to obtain location');
//       }
//     });
//   },
//   {
//     delay: 1000,
//     onLoop: true,
//     taskId: 'taskid',
//     onError: (e) => console.log('Error logging:', e),
//   },
// );

ReactNativeForegroundService.add_task(() => console.log('I am Being Tested'), {
  delay: 100,
  onLoop: true,
  taskId: 'taskid',
  onError: (e) => console.log(`Error logging:`, e),
});


ReactNativeForegroundService.start({
    id: 144,
    title: 'Foreground Service',
    message: 'you are online!',
});



const MainListe = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [placesBetween, setPlacesBetween] = useState([]);
    const locationSvc = new GeolocationSvc();
    const [maxDistanceValue, setMaxDistanceValue] = useState(50);

    // const getLocationPermition = async()=>{
    //     locationSvc.askForGeolocationPermission().then((resp)=> setLocationPermission(resp));
    // }

    const initLocation = async() =>{
        console.log("init ?")
        try{
            locationSvc.getCurrantLocation()
            console.log('PLACE SCREEN pos', pos)
            dispatch({type: "UPDATE_USER_LOCATION", location: pos})
        }
        catch(err){
                console.log("Place Screen get pos :", err)
        }
      
    }
    
    useEffect(()=>{
        // getLocationPermition();
         setMaxDistanceValue(50);
        createChannels();
       
    }, [])

    useEffect(()=>{
        const placesBetween = getPlacesBetween(state.userLocation, state.places, maxDistanceValue);
        setPlacesBetween(placesBetween);
    }, [])

    const createChannels = () => {
        // PushNotification.createChannel(
        //     {
        //         channelId: "mystere_app",
        //         channelName: "mystere_app"
        //     }
        // )
    }


   

       
    // useEffect(()=>{
    //     console.log("locationPermission", locationPermission)
    //     if(locationPermission)
    //         initLocation()
    // },[locationPermission])

    const onChangeSliderDistance = (newDistance) => {
        console.log('new', state.userLocation, state.places, Math.round(newDistance))
        setMaxDistanceValue(Math.round(newDistance))
        if(newDistance === 500){
            setPlacesBetween(state.places)
        }
        else{
            const placesBetween = getPlacesBetween(state.userLocation, state.places, Math.round(newDistance));
            console.log('placesBetween', placesBetween)
            setPlacesBetween(placesBetween)
        }
       

    }

    
    return (
        <View style={styles.container}>
            {
                !state.userLocation &&
                    <Text style={styles.title}>Activez vote position pour accéder aux lieux les plus proches de vous.</Text>
            }
           
            <View style={styles.sliderContainer}>
                <Slider
                    style={{width: '100%', height: 40, color:'#FFF'}}
                    minimumValue={1}
                    maximumValue={+500}
                    minimumTrackTintColor="#53e1ca"
                    maximumTrackTintColor="#FFF"
                    thumbTintColor="#53e1ca"
                    value={maxDistanceValue}
                    onValueChange={onChangeSliderDistance}
                    />
                <Text style={styles.distanceText}>Lieux à {maxDistanceValue === 500 ? "plus" : 'moins'} de {maxDistanceValue} Kms</Text>
            </View>
            {
                placesBetween.length<1 &&
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
        color: '#FFF',
        textAlign: 'center',
        padding:20
    },
    distanceText:{
         fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        // padding:10
    },
    sliderContainer:{
        marginTop: 20,
        marginBottom: 40,
    }
})

export default MainListe