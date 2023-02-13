
import React, { useEffect, useContext, useState } from 'react';
import {Text, View,  StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import GeolocationSvc from '../Services/GeolocationSvc';
import {AppContext} from '../Providers/AppProvider';
import Geolocation from 'react-native-geolocation-service';
import {PlaceItem} from '../Components/PlaceItem';
import {API_URL_ALL_PLACES} from '../env';

export const FilteredListeScreen = ({route}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const locationSvc = new GeolocationSvc();
    const { regionId  } = route.params;

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
    
            console.log("FilteredListeScreen getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };
        // await locationSvc.getCurrantLocation().then(async(pos)=>{
        //     dispatch({type: "UPDATE_USER_LOCATION", location: pos})
        // });
    }

    const filterList = (liste) =>{
        if(liste){
            const filteredPlacesByRegion = liste.filter(place=>place.region === `${regionId}`);
            dispatch({type: "INIT_FILTERED_PLACES", filteredPlaces: filteredPlacesByRegion});
        }
    }

    useEffect(() => {
        dispatch({type: "INIT_FILTERED_PLACES", filteredPlaces: []});
        if(state.places.lenght > 0){
            filterList(state.places)
        }
        else{
            async function loadPosts() {
                try{
                    const response = await fetch(API_URL_ALL_PLACES);                    
                    const places = await response.json();
                    filterList(places)
                    dispatch({type: "INIT_ALL_PLACES", places: places }) 
                }
                catch(err){
                    console.log("FilteredListeScreen full liste fetch : ", err)
                }
               
            }
            loadPosts().then(()=>{
                setIsLoading(false);
            })
        }
    }, [])

    useEffect(()=>{
        if(!locationPermission){
            getLocationPermition();
        }
        if(!state.userLocation){
            initLocation();
        }
    })

    return (
        <View style={styles.container}>
            {
                isLoading ? <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#FFF"/></View>: 
                state.filteredPlaces.length > 0  ?
                    <FlatList
                        data={state.filteredPlaces}
                        renderItem={({item}) => <PlaceItem data={item}/> }
                        keyExtractor={(item, id) => id}
                    /> 
                : <Text style={{color:"#FFF", fontSize:16, textAlign:'center', padding:20}}>Il n'y à pas encore de lieux dans cette région ...</Text>
            
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000',
    },
    loaderContainer:{
        height:'100%',
        paddingTop:50,
    }
  })

