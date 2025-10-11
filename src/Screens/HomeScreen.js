/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useContext, useState} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GeolocationSvc from '../Services/GeolocationSvc';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from '../Providers/AppProvider';
import {getRandomItem} from '../Utiles';
import {PlaceItemFullWidth} from '../Components/PlaceItemFullWidth';
import {FloatingButton} from '../Components/FloatingButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotifService} from '../Hooks/useNotifications';

export const HomeScreen = () => {
  const [state, dispatch] = useContext(AppContext);
  const [locationPermission, setLocationPermission] = useState(false);
  const [randomPlaces, setRandom] = useState([]);
  const [hasSeenAlertMessage, sethasSeenAlertMessage] = useState(true);
  const [displayNotificationsAlert, setDisplayNotificationsAlert] =
    useState(false);
  const locationSvc = new GeolocationSvc();
  const navigation = useNavigation();
  const notifSvc = useNotifService();

  const hasSeenIconNotification = async () => {
    return await AsyncStorage.getItem('hasSeenNotificationIconAlert');
  };
  const hasActivatedNotification = async () => {
    return await AsyncStorage.getItem('notifications_status');
  };

  const getLocationPermition = async () => {
    locationSvc.askForGeolocationPermission().then(resp => {
      setLocationPermission(resp);
    });
  };

  const initLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        data => {
          let pos = {
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          };
          // return { status: true, pos};
          dispatch({type: 'UPDATE_USER_LOCATION', location: pos});
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true},
      );
    } catch (error) {
      console.log('HomeScreen getCurrentLatLong::catcherror =>', error);
      return {status: false, message: '[MapSvc] Can not get position'};
    }
  };

  const renderItem = ({item}) => {
    return <PlaceItemFullWidth data={item} />;
  };

  const onActiveNotifications = async () => {
    await AsyncStorage.setItem('hasSeenNotificationIconAlert', 'true');
    setDisplayNotificationsAlert(false);
    navigation.navigate('Menu');
  };

  const onCloseNotificationIcon = async () => {
    await AsyncStorage.setItem('hasSeenNotificationIconAlert', 'true');
    setDisplayNotificationsAlert(false);
  };

  useEffect(() => {
    if (!locationPermission && hasSeenAlertMessage) {
      getLocationPermition();
    }
    if (!state.userLocation && locationPermission && hasSeenAlertMessage) {
      initLocation();
    }
  }, [locationPermission, hasSeenAlertMessage]);

  useEffect(() => {
    const numberOfPlaces = 5;
    let finalPlaceArray = [];
    if (state.places) {
      for (let i = 0; i < numberOfPlaces; i++) {
        let item = getRandomItem(state.places);
        finalPlaceArray.push(item);
      }
      setRandom([...new Set(finalPlaceArray)]);
    } else {
      console.log('pas de lieux ! ');
    }
  }, [state.places]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // used when the application is killed and user open the notification
    notifSvc.navigateToTheNotifiedBackgroundPlace();
  }, []);

  useEffect(() => {
    const checkNotificationsStatus = async () => {
      const activated = await hasActivatedNotification();
      const seenIcon = await hasSeenIconNotification();

      if (!JSON.parse(activated) && !JSON.parse(seenIcon)) {
        setDisplayNotificationsAlert(true);
      } else if (JSON.parse(activated) && !JSON.parse(seenIcon)) {
        setDisplayNotificationsAlert(false);
      } else {
        setDisplayNotificationsAlert(false);
      }
    };

    checkNotificationsStatus();
  });

  return (
    <View style={styles.container}>
      {displayNotificationsAlert && (
        <FloatingButton
          activeNotifications={onActiveNotifications}
          close={onCloseNotificationIcon}
        />
      )}

      <View>
        {!randomPlaces ? (
          <Text style={styles.title}>
            Impossible de charger les informations ...
          </Text>
        ) : (
          <FlatList
            ListHeaderComponent={() => (
              <Text style={styles.title}>Lieux à découvrir ou redécouvrir</Text>
            )}
            data={randomPlaces}
            renderItem={renderItem}
            keyExtractor={(item, id) => id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    color: '#F3E0E2',
    textAlign: 'center',
    padding: 20,
  },
});
