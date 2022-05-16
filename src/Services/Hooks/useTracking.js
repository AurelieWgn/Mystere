import {useEffect, useState, useContext} from 'react';
import {Alert} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {AppContext} from '../../Providers/AppProvider';
import {getPlacesData, calculateDistance, getNotifiedPlaces, updateNotifiedPlaces} from '../../Utiles';
import {findNearest} from 'geolib';
import PushNotificationSvc from "../NotificationSvc";

const findCloserPlaceEndSendNotif = async (userLocation) =>{
  const [state, dispatch] = useContext(AppContext);

  const closestPlace = userLocation ? findNearest(userLocation, state.places) : null;
  const isCloserEnough = closestPlace ? calculateDistance(userLocation, closestPlace.coords) < 50 : null;

  if(isCloserEnough){
    const notifiedPlaces = await getNotifiedPlaces();
    const isPlaceHasAlreadyNotified = notifiedPlaces.find(id => id == closestPlace.id);

    if(!isPlaceHasAlreadyNotified){
      // const newNotifiedValues = notifiedPlaces.push(closestPlace.id);
      // await updateNotifiedPlaces(newNotifiedValues);

       PushNotificationSvc.schduleNotification(closestPlace);
    }
  }
}

const useTracking = (isActive) => {
  const [state, dispatch] = useContext(AppContext);
  const [location, setLocation] = useState(state.userLocation);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // DISTANCE_FILTER_PROVIDER for
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('location', (location) => {
      setLocation((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

   
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
        findCloserPlaceEndSendNotif();
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      console.log("stationary : ", stationaryLocation)
    });

    BackgroundGeolocation.on('error', (error) => {
      //console.log('[ERROR] BackgroundGeolocation error:', error);
      console.log("error")
    });

    BackgroundGeolocation.on('start', () => {
      console.log("start")
      findCloserPlaceEndSendNotif()
      //console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      //console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
      findCloserPlaceEndSendNotif()
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
     
      BackgroundGeolocation.start(); //triggers start on start event
      
    });

    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, [location, isActive]);

  return {location};
};

export default useTracking;