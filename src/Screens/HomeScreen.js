
import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, FlatList} from 'react-native';
import GeolocationSvc from '../Services/GeolocationSvc';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from '../Providers/AppProvider';
import { getRandomItem} from '../Utiles';
import {PlaceItemFullWidth} from '../Components/PlaceItemFullWidth'

export const HomeScreen = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [randomPlaces, setRandom] = useState([]);
    const locationSvc = new GeolocationSvc();

    const getLocationPermition = async()=>{
        locationSvc.askForGeolocationPermission().then((resp)=> {
            setLocationPermission(resp)
        });
    }
 
    const initLocation = async() =>{
        try {
      
            Geolocation.getCurrentPosition(
              (data) => {
                console.log('data', data)
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


    useEffect(()=>{
        if(!locationPermission){
            getLocationPermition();
        }
        if(!state.userLocation && locationPermission){
            initLocation()
        }
    }, [locationPermission])
    


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
                        renderItem={({item}) => <PlaceItemFullWidth data={item}/> }
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

