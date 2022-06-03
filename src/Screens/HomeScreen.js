
import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity, Switch } from 'react-native';
import GeolocationSvc from '../Services/GeolocationSvc';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from '../Providers/AppProvider';
import {calculateDistance, getRandomItem} from '../Utiles';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../Components/SearchBar';



const PlaceItem = ({data}) =>{
    const [state, dispatch] = useContext(AppContext);
    const [distance, setDistance] = useState(null);
    const navigation = useNavigation();

    const onPress = (id) => {
    //    NativeModules.BackgroundWorkManager.startBackgroundWork();
        navigation.navigate('SinglePlaceScreen', {placeId: id});
    }
    
    useEffect(()=>{
        if(state.userLocation){
            const distance = calculateDistance(state.userLocation, data.coords);
            setDistance(distance)
        }
            
    }, [state.userLocation])
    const Image_Http_URL ={ uri: `https://xn--mystre-6ua.fr/wp/wp-content/uploads/${data.img}`};    
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={()=>onPress(data.id)}
        >
            <View style={{height: 200, marginBottom:10}}> 
                <ImageBackground source={Image_Http_URL} resizeMode="cover" style={{flex:1}}>
                    <Text style={{color: '#FFF', fontWeight:'bold', fontSize:18, textAlign:'right', padding:5}}>{distance}Km</Text>
                    <View style={{ width:'100%', position:'absolute', bottom:0, padding:10}}>
                        <Text style={{color: '#FFF', fontWeight:'bold', fontSize:20}}>{data.name}</Text>
                        <Text style={{color:'#FFF', fontWeight:'800', fontSize:16}}><Image source={require('../Img/Places/red_place.png')} style={{width:24, height:24}}/>{data.addres}</Text>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    )
}

const HomeScreen = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [locationPermission, setLocationPermission] = useState(false);
    const [randomPlaces, setRandom] = useState([]);
    // const [searchPhrase, setSearchPhrase] = useState("");
    // const [fakeData, setFakeData] = useState();

    // const [clicked, setClicked] = useState(false);


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
    
            console.log("getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };
        // await locationSvc.getCurrantLocation().then(async(pos)=>{
        //     console.log("pos Liste", pos)
        //     dispatch({type: "UPDATE_USER_LOCATION", location: pos})
        // });
    }

     //ToDO Delete , use it in App at init
  useEffect(() => {
      async function loadPosts() {
          const response = await fetch('https://xn--mystre-6ua.fr/wp/wp-json/places/all');
          if(!response.ok) {
              // oups! something went wrong
              return;
          }
          const places = await response.json();
          dispatch({type: "INIT_ALL_PLACES", places: places })
      }
      loadPosts()
       
    }, [])

    useEffect(()=>{
         console.log('getLocationPermition')
        getLocationPermition();
    }, [])

  useEffect(()=>{
      const numberOfPlaces = 5;
      let finalPlaceArray = []
      if(state.places){
          console.log("if(state.places)")
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
   
    useEffect(()=>{
        if(locationPermission)
            initLocation()
    },[locationPermission])

    
    return (
        <View style={styles.container}>
            {/* <SearchBar
                searchPhrase={state.places}
                setSearchPhrase={setSearchPhrase}
                clicked={clicked}
                setClicked={setClicked}
            /> */} 
    
            <View>
            {
                !randomPlaces ? 
                    <Text  style={styles.title}>Impossible de charger les informations ...</Text>
                    :  
                    <FlatList
                     ListHeaderComponent={()=>   <Text style={styles.title}>Lieux à découvrir ou redécouvrir</Text>}
                        data={randomPlaces}
                        renderItem={({item}) => <PlaceItem data={item}/> }
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
        color: '#FFF',
        textAlign: 'center',
        padding:20
    }
  })

export default HomeScreen