/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Switch,
} from 'react-native';
import GeolocationSvc from '../Services/GeolocationSvc';
import {AppContext} from '../Providers/AppProvider';
import Geolocation from 'react-native-geolocation-service';
import {PlaceItem} from '../Components/PlaceItem';
import {API_URL_ALL_PLACES} from '../env';
import {orderPlaceByDistance} from '../Utiles';

export const FilteredListeScreen = ({route}) => {
  const [state, dispatch] = useContext(AppContext);
  const [locationPermission, setLocationPermission] = useState(false); // Définition de l'état de la permission de localisation
  const [isLoading, setIsLoading] = useState(true);
  const [isSortedByDistance, setIsSortedByDistance] = useState(false);
  const locationSvc = new GeolocationSvc();
  const {regionId} = route.params;

  const manageLocationAccess = async () => {
    const permission = await locationSvc.askForGeolocationPermission();
    setLocationPermission(permission); // Correction ici pour définir l'état de la permission

    if (permission && !state.userLocation) {
      try {
        Geolocation.getCurrentPosition(
          position => {
            const pos = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            };
            dispatch({type: 'UPDATE_USER_LOCATION', location: pos});
          },
          error => {
            console.log('Error getting location:', error);
          },
          {enableHighAccuracy: true},
        );
      } catch (error) {
        console.log('Error getting location:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (state.places.length > 0) {
        filterList(state.places);
      } else {
        try {
          const response = await fetch(API_URL_ALL_PLACES);
          const places = await response.json();
          filterList(places);
          dispatch({type: 'INIT_ALL_PLACES', places});
        } catch (err) {
          console.log('Error fetching places:', err);
        }
      }
      setIsLoading(false);
    };

    fetchData();
    manageLocationAccess();
  }, [state.places]); // Ajout de state.places comme dépendance pour recharger si les places changent

  const filterList = liste => {
    const filteredPlacesByRegion = liste.filter(
      place => place.region === `${regionId}`,
    );
    dispatch({
      type: 'INIT_FILTERED_PLACES',
      filteredPlaces: filteredPlacesByRegion,
    });
  };

  const toggleSort = () => setIsSortedByDistance(prevState => !prevState);

  const renderItem = ({item}) => <PlaceItem data={item} />;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : state.filteredPlaces.length > 0 ? (
        <View style={{paddingTop: 55}}>
          <FlatList
            data={
              isSortedByDistance
                ? orderPlaceByDistance(state.userLocation, state.filteredPlaces)
                : state.filteredPlaces
                    .map(value => ({value, sort: Math.random()}))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({value}) => value)
            }
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
          <View style={styles.filterBtn}>
            <Image
              source={require('../Img/aleatoire.png')}
              style={{width: 24, height: 24}}
            />
            <Switch
              trackColor={{false: '#767577', true: '#767577'}}
              thumbColor={isSortedByDistance ? 'black' : '#f4f3f4'}
              style={{marginLeft: 5, marginRight: 5}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsSortedByDistance(!isSortedByDistance)}
              value={isSortedByDistance}
            />
            <Image
              source={require('../Img/tout-pres-dici.png')}
              style={{width: 27, height: 27}}
            />
          </View>
        </View>
      ) : (
        <Text
          style={{
            color: '#FFF',
            fontSize: 16,
            textAlign: 'center',
            padding: 20,
          }}>
          Il n'y à pas encore de lieux dans cette région ...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    height: '100%',
    paddingTop: 50,
  },
  filterBtn: {
    width: '100%',
    position: 'absolute',
    top: 0,
    height: 50,
    paddingRight: 20,
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFF',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1,
    shadowRadius: 20.0,
    elevation: 9,
  },
  filterText: {
    color: '#000',
  },
});
