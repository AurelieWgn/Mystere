import {getDistance, orderByDistance} from 'geolib';
import {API_URL_ALL_PLACES} from './env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import BackgroundService from 'react-native-background-actions';
import  {locationAndNotificationTask} from '../src/tasks/CheckLocation';

const calculateDistance = (from, to) => {
    var dis = getDistance(from, to);
    return (dis/1000).toFixed(2);
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
     console.log("[Utiles] --> Can't get stored_places", e)
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

// value : number[]
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
        const response = await fetch(API_URL_ALL_PLACES);                    
        const places = await response.json();
        filterList(places)
        dispatch({type: "INIT_ALL_PLACES", places: places }) 
    }
    catch(err){
        console.log("FilteredListeScreen full liste fetch : ", err)
    }           
}

const emptyNotifiedPlacesFormAsyncStorage = async()=>{
    try {
      const lastDelete = await AsyncStorage.getItem('lastStorageDelete');
      if(!lastDelete){
        await AsyncStorage.setItem('lastStorageDelete', moment().toString());
        await AsyncStorage.removeItem('notified_places');
      }
      else{
        const twoDaysAgo = moment().subtract(2, 'days');
        if(moment(lastDelete).isBefore(twoDaysAgo)){
           await AsyncStorage.removeItem('notified_places');
           await AsyncStorage.setItem('lastStorageDelete', moment().toString());
        }
        else{
          console.log('do not save again')
        }
      }
      
    } catch (e) {
      console.log("[Utiles] --> emptyNotifiedPlacesFormAsyncStorage", e)
    }
  }


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const notificationsTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            locationAndNotificationTask();
            await sleep(delay);
        }
    });
};

const options = {
    taskName: 'Notifications',
    taskTitle: 'Mystère Information',
    taskDesc: 'Les notifications sont actives',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'mystery://',
    parameters: {
        delay: 900000, // 15min
    },
};

const startStask = async () =>{
  await BackgroundService.start(notificationsTask, options); 
}

const stopStask = async () =>{
  await BackgroundService.stop();
}

const backgroundTaskIsRunning = () =>{
  return BackgroundService.isRunning();
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
  loadPosts,
  emptyNotifiedPlacesFormAsyncStorage,
  startStask,
  stopStask,
  backgroundTaskIsRunning
}