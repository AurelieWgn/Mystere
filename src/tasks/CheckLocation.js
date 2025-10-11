import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateDistance,
  getNotifiedPlaces,
  orderPlaceByDistance,
  updateNotifiedPlaces,
} from '../Utiles';
import NotificationSvc from '../Services/NotificationSvc';
import GeolocationSvc from '../Services/GeolocationSvc';

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
        // Utiliser l'instance singleton
        await NotificationSvc.onDisplayNotification(closestPlace);
      } catch (error) {
        console.error('[CheckLocation] Error sending notification:', error);
      }
    }
  } catch (error) {
    console.error('[CheckLocation] findCloserPlaceEndSendNotif error:', error);
  }
};

/**
 * Tâche de localisation et notification en arrière-plan
 * Utilise le GeolocationSvc singleton pour économiser la mémoire
 */
export const locationAndNotificationTask = async taskData => {
  try {
    // Utiliser le singleton GeolocationSvc
    const result = await GeolocationSvc.getCurrentLocation(true);
    
    if (result.status && result.pos) {
      await findCloserPlaceEndSendNotif(result.pos);
    } else {
      console.warn('[CheckLocation] Could not get location:', result.message);
    }
  } catch (error) {
    console.error('[CheckLocation] locationAndNotificationTask error:', error);
  }
};
