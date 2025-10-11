/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useContext, useState, useCallback} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../Providers/AppProvider';
import {getRandomItem} from '../Utiles';
import {PlaceItemFullWidth} from '../Components/PlaceItemFullWidth';
import {FloatingButton} from '../Components/FloatingButton';
import {useNotifService} from '../Hooks/useNotifications';
import {useNotificationContext} from '../Providers/NotificationProvider';
import {useLocationContext} from '../Providers/LocationProvider';

export const HomeScreen = () => {
  const [state, dispatch] = useContext(AppContext);
  const [randomPlaces, setRandom] = useState([]);
  const [hasSeenAlertMessage, sethasSeenAlertMessage] = useState(true);
  
  const navigation = useNavigation();
  const notifSvc = useNotifService();
  
  // Utiliser les contextes optimisés
  const {shouldShowNotificationAlert, markAlertAsSeen} = useNotificationContext();
  const {
    getCurrentLocation,
    foregroundPermissionGranted,
    requestForegroundPermission,
  } = useLocationContext();

  const getLocationPermition = useCallback(async () => {
    if (!foregroundPermissionGranted) {
      await requestForegroundPermission();
    }
  }, [foregroundPermissionGranted, requestForegroundPermission]);

  const initLocation = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      
      if (location) {
        // Mettre à jour le contexte App pour compatibilité
        dispatch({type: 'UPDATE_USER_LOCATION', location});
      }
    } catch (error) {
      console.error('[HomeScreen] Error getting location:', error);
    }
  }, [getCurrentLocation, dispatch]);

  const renderItem = ({item}) => {
    return <PlaceItemFullWidth data={item} />;
  };

  const onActiveNotifications = useCallback(async () => {
    await markAlertAsSeen();
    navigation.navigate('Menu');
  }, [markAlertAsSeen, navigation]);

  const onCloseNotificationIcon = useCallback(async () => {
    await markAlertAsSeen();
  }, [markAlertAsSeen]);

  useEffect(() => {
    if (!foregroundPermissionGranted && hasSeenAlertMessage) {
      getLocationPermition();
    }
    if (!state.userLocation && foregroundPermissionGranted && hasSeenAlertMessage) {
      initLocation();
    }
  }, [foregroundPermissionGranted, hasSeenAlertMessage, state.userLocation, getLocationPermition, initLocation]);

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
  }, [notifSvc]);

  // Plus besoin de ce useEffect - shouldShowNotificationAlert est géré par le contexte

  return (
    <View style={styles.container}>
      {shouldShowNotificationAlert && (
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
