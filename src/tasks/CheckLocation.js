import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateDistance,
  getNotifiedPlaces,
  orderPlaceByDistance,
  updateNotifiedPlaces,
} from '../Utiles';
import NotificationSvc from '../Services/NotificationSvc';

const findCloserPlaceEndSendNotif = async userLocation => {
  try {
    const placesString = await AsyncStorage.getItem('stored_places');
    const places = JSON.parse(placesString) || [];
    const sortedPlaces = orderPlaceByDistance(userLocation, places);
    const notifiedPlaces = await getNotifiedPlaces();

    // Find the first unnotified location that is close enough
    const closestPlace = sortedPlaces.find(place => {
      const isCloserEnough = calculateDistance(userLocation, place.coords) < 50;

      const isNotNotifiedYet = !notifiedPlaces.includes(place.id);
      return isCloserEnough && isNotNotifiedYet;
    });

    if (closestPlace) {
      try {
        await updateNotifiedPlaces(notifiedPlaces.concat([closestPlace.id]));
        const NotifSvc = new NotificationSvc();
        await NotifSvc.onDisplayNotification(closestPlace);
      } catch (error) {
        console.log('CheckLocation.js, can not send notification :', error);
      }
    }
  } catch (error) {
    console.log('findCloserPlaceEndSendNotif err : ', error);
  }
};

export const locationAndNotificationTask = async taskData => {
  Geolocation.getCurrentPosition(
    data => {
      const pos = {
        longitude: data.coords.longitude,
        latitude: data.coords.latitude,
      };
      findCloserPlaceEndSendNotif(pos);
    },
    error => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true},
  );
};
