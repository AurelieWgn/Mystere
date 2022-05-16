import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeolocationSvc from '../Services/GeolocationSvc';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance} from '../Utiles';
import FloatingMapIcon from '../Components/FloatingMapIcon';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { AppRegistry } from 'react-native';
import App from '../../App';
import RNLocation from 'react-native-location';
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

console.log('start')


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


const PlaceItem = ({data}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();

    const onPress = (id) => {
        navigation.navigate('SinglePlaceScreen', {placeId: id});
    }
    
    useEffect(()=>{
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, data.coords);
            setDistance(distance);
        }  
    }, [state.userLocation])

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={()=>onPress(data.id)}
        >
            <View style={{height: 120, marginBottom:10, display:'flex', flexDirection:'row'}}> 
                    <View style={{width:'50%', position:'relative', marginBottom:10, marginRight:5 }}>
                        <View >
                            <Image source={require(`../Img/Places/Versailles.jpg`)}  style={{maxWidth:'100%', height:120,  resizeMode: 'cover' }}/>
                        </View>
                        <Text style={{color: '#FFF', fontWeight:'bold', fontSize:12, padding:5, position:'absolute', bottom:0, right:0}}>{distance}Km</Text>
                    </View>
            
                    <View style={{width:'50%', height:100, textOverflow: 'ellipsis', padding:5 }}>
                        <Text style={{color: '#FFF', fontWeight:'bold', fontSize:16, textAlign:'center'}}>{data.name}</Text>
                        <Text style={{color:'#FFF', fontWeight:'600', fontSize:12 }}>{data.description}</Text>
                    </View>   
            </View>
        </TouchableOpacity>
    )
}

const MainListe = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const locationSvc = new GeolocationSvc();

    const getLocationPermition = async()=>{
        locationSvc.askForGeolocationPermission().then((resp)=> setLocationPermission(resp));
    }

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

    const createChannels = () => {
        PushNotification.createChannel(
            {
                channelId: "mystere_app",
                channelName: "mystere_app"
            }
        )
    }


    useEffect(()=>{
        getLocationPermition();
        createChannels();

    }, [])

       
    useEffect(()=>{
        console.log("locationPermission", locationPermission)
        if(locationPermission)
            initLocation()
    },[locationPermission])

    
    return (
        <View style={styles.container}>
            <FlatList
                data={state.places}
                renderItem={({item}) => <PlaceItem data={item}/> }
                keyExtractor={(item, id) => id}
            />
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
})

export default MainListe