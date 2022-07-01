import {getDistance, orderByDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';


const calculateDistance = (from, to) => {
    var dis = getDistance(from, to);
    return dis/1000;
};
  
const storePlacesData = async (value) => {
  try {
    await AsyncStorage.removeItem('stored_places');
    await AsyncStorage.setItem('stored_places', value);
  } catch (e) {
    console.log("[Utiles] --> Can't set stored_places")
  }
};

const getPlacesData = async () => {
  try {
    const value = await AsyncStorage.getItem('stored_places');
    return JSON.parse(value);
  } catch(e) {
     console.log("[Utiles] --> Can't get stored_places")
  }
}

const getNotifiedPlaces = async () => {
 try {
    const ids = await AsyncStorage.getItem('notified_places');
    const value = ids.length && ids.length>0 ? ids : [];
    return JSON.parse(value);
  } catch(e) {
     console.log("[Utiles] --> Can't get NotifiedPlaces")
     return []
  }
}

const updateNotifiedPlaces = async (value) =>{
  try {
    await AsyncStorage.setItem('notified_places', JSON.stringify(value));
  } catch (e) {
    console.log("[Utiles] --> Can't set NotifiedPlaces")
  }
}

const getRandomItem = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}

//Get places <50km form position
const getNearestPlaces = (position, places) => {
  const orderedPlaces = orderByDistance(position, places);
  orderedPlaces.slice(0, 10)
  const placesLessThen50 = orderedPlaces.filter((places)=> calculateDistance(position, places.coords) <= 50)
  return placesLessThen50;
}

const getPlacesBetween = (position, places, distance) => {
  const placesBewteen = places.filter((places)=> calculateDistance(position, places.coords) <= distance);
  return placesBewteen;
}

const loadPosts = async() => {
    try{
        const response = await fetch('https://xn--mystre-6ua.fr/wp/wp-json/places/all');                    
        const places = await response.json();
        filterList(places)
        dispatch({type: "INIT_ALL_PLACES", places: places }) 
    }
    catch(err){
        console.log("FilteredListeScreen full liste fetch : ", err)
    }           
}


export { 
  calculateDistance, 
  storePlacesData,  
  getPlacesData, 
  getNotifiedPlaces, 
  updateNotifiedPlaces, 
  getRandomItem, 
  getNearestPlaces, 
  getPlacesBetween,
  loadPosts
}