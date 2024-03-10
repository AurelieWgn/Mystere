import PushNotificationSvc from '../Services/NotificationSvc';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateDistance,
  getNotifiedPlaces,
  orderPlaceByDistance,
  stockNotificationForLater,
  updateNotifiedPlaces,
} from '../Utiles';

const findCloserPlaceEndSendNotif = async userLocation => {
  console.log('findCloserPlaceEndSendNotif');
  try {
    const placesString = await AsyncStorage.getItem('stored_places');
    const places = JSON.parse(placesString) || [];
    const sortedPlaces = orderPlaceByDistance(userLocation, places);
    const notifiedPlaces = await getNotifiedPlaces();

    // Trouver le premier lieu non notifié qui est assez proche
    const closestPlace = sortedPlaces.find(place => {
      const isCloserEnough = calculateDistance(userLocation, place.coords) < 50;

      const isNotNotifiedYet = !notifiedPlaces.includes(place.id);
      return isCloserEnough && isNotNotifiedYet;
    });
    console.log('closestPlace', closestPlace);

    if (closestPlace) {
      console.log('closestPlace');
      try {
        await updateNotifiedPlaces(notifiedPlaces.concat([closestPlace.id]));
        await stockNotificationForLater(closestPlace);
        PushNotificationSvc.schduleNotification(closestPlace);
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

const fakePlace = {
  addres: '1 Avenue du Colonel Henri Rol Tanguy, 75014 Paris',
  coords: {latitude: '48.8337', longitude: '2.3323'},
  description:
    'Les catacombes de Paris, sont situées à Paris dans le département de Paris en région Île de France. Le plus grand ossuaire souterrain du monde, ce lieu mystérieux fait partie des monuments incontournables de la capitale.',
  id: '1055',
  img: 'Les-Catacombes-de-Paris-01.jpg',
  latitude: '48.8337',
  longitude: '2.3323',
  name: 'Les Catacombes de Paris',
  region: '8',
};
