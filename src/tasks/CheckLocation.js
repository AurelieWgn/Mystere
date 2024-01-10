import PushNotificationSvc from "../Services/NotificationSvc";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {calculateDistance, getNotifiedPlaces, stockNotificationForLater, updateNotifiedPlaces} from '../Utiles';
import {findNearest} from 'geolib';

const findCloserPlaceEndSendNotif = async (userLocation) => {
  const places = await AsyncStorage.getItem('stored_places');
  const closestPlace = userLocation ? findNearest(userLocation, JSON.parse(places)) : null;
  const isCloserEnough = closestPlace ? calculateDistance(userLocation, closestPlace.coords) < 50 : null;

  // const fakePlace = {"addres": "1 Avenue du Colonel Henri Rol Tanguy, 75014 Paris", "coords": {"latitude": "48.8337", "longitude": "2.3323"}, "description": "Les catacombes de Paris, sont situées à Paris dans le département de Paris en région Île de France. Le plus grand ossuaire souterrain du monde, ce lieu mystérieux fait partie des monuments incontournables de la capitale.", "id": "1055", "img": "Les-Catacombes-de-Paris-01.jpg", "latitude": "48.8337", "longitude": "2.3323", "name": "Les Catacombes de Paris", "region": "8"}
  // await stockNotificationForLater(closestPlace);
  // PushNotificationSvc.schduleNotification(fakePlace);

  if(isCloserEnough){
    const notifiedPlaces = await getNotifiedPlaces();
    const isPlaceHasAlreadyNotified = notifiedPlaces.find(id => id == closestPlace.id);
    if(!isPlaceHasAlreadyNotified){
      await updateNotifiedPlaces(notifiedPlaces.concat([closestPlace.id]));
      await stockNotificationForLater(closestPlace);
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
