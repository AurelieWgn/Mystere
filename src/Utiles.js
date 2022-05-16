import {getDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';

// from / to : {"longitude": 0.674445, "latitude": 46.338843}

const calculateDistance = (from, to) => {
    var dis = getDistance(from, to);
    return dis/1000
    // alert(
    //   `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
    // );
  };
  
const storePlacesData = async (value) => {
  try {
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
    console.log("value", value)
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


export {calculateDistance, storePlacesData,  getPlacesData, getNotifiedPlaces, updateNotifiedPlaces}