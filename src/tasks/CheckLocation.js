import PushNotificationSvc from "../Services/NotificationSvc";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {calculateDistance, getNotifiedPlaces, updateNotifiedPlaces} from '../Utiles';
import {findNearest} from 'geolib';

const findCloserPlaceEndSendNotif = async (userLocation) => {
  const places = await AsyncStorage.getItem('stored_places');
  const closestPlace = userLocation ? findNearest(userLocation, JSON.parse(places)) : null;
  const isCloserEnough = closestPlace ? calculateDistance(userLocation, closestPlace.coords) < 3 : null;

  if(isCloserEnough){
    const notifiedPlaces = await getNotifiedPlaces();
    const isPlaceHasAlreadyNotified = notifiedPlaces.find(id => id == closestPlace.id);
    if(!isPlaceHasAlreadyNotified){
      await updateNotifiedPlaces(notifiedPlaces.concat([closestPlace.id]));
      PushNotificationSvc.schduleNotification(closestPlace);
    }
  }
}


export const locationAndNotificationTask = async (taskData) => {
  Geolocation.getCurrentPosition(
      (data) => {
        pos = {longitude: data.coords.longitude, latitude: data.coords.latitude};
        findCloserPlaceEndSendNotif(pos);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true}
    )  
};
