/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useMemo} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import SearchBar from '../Components/SearchBar';
import {getPlacesBetween} from '../Utiles';
import {PlaceItem} from '../Components/PlaceItem';
import {AppContext} from '../Providers/AppProvider';
import Slider from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import GeolocationSvc from '../Services/GeolocationSvc';
import Geolocation from 'react-native-geolocation-service';

export const PlacesScreen = () => {
  const [state, dispatch] = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [maxDistanceValue, setMaxDistanceValue] = useState(50);
  const [filteredPlaces, setFilteredPlaces] = useState(state.places || []); // Ajout de cette ligne pour définir filteredPlaces
  const [selectedRadioDistanceBtn, setSelectedRadioDistanceBtn] =
    useState('all');
  const [locationPermission, setLocationPermission] = useState(false);
  const locationSvc = new GeolocationSvc();

  const filterRadioButtonsData = useMemo(
    () => [
      {id: 'all', label: 'Tout', value: 'all', color: '#FFF', size: 14},
      {
        id: 'distance',
        label: 'Filtrer par limite de distance',
        value: 'distance',
        color: '#FFF',
        size: 14,
      },
    ],
    [],
  );

  useEffect(() => {
    getLocationPermission();
  }, [
    searchPhrase,
    maxDistanceValue,
    state.userLocation,
    selectedRadioDistanceBtn,
    state.places,
  ]);

  const getLocationPermission = async () => {
    const resp = await locationSvc.askForGeolocationPermission();
    setLocationPermission(resp);
    if (resp && !state.userLocation) {
      initLocation();
    }
  };

  const initLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        data => {
          const pos = {
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          };
          dispatch({type: 'UPDATE_USER_LOCATION', location: pos});
        },
        error => {
          console.log('HomeScreen getCurrentLatLong::catcherror =>', error);
        },
        {enableHighAccuracy: true},
      );
    } catch (error) {
      console.log('HomeScreen getCurrentLatLong::catcherror =>', error);
    }
  };

  useEffect(() => {
    const dataToDistanceFilter =
      searchPhrase.length > 2
        ? state.places.filter(
            place =>
              place.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
              place.description
                .toLowerCase()
                .includes(searchPhrase.toLowerCase()),
          )
        : state.places;

    const placesBetween =
      selectedRadioDistanceBtn === 'all' || maxDistanceValue === 500
        ? dataToDistanceFilter
        : getPlacesBetween(
            state.userLocation,
            dataToDistanceFilter,
            maxDistanceValue,
          );

    setFilteredPlaces(placesBetween);
  }, [
    searchPhrase,
    maxDistanceValue,
    state.userLocation,
    selectedRadioDistanceBtn,
    state.places,
  ]); // Cette dépendance manquait

  const handleResetSearchValue = () => {
    setSearchPhrase('');
  };

  const onChangeSliderDistance = newDistance => {
    setMaxDistanceValue(Math.round(newDistance));
  };

  const onPressRadioButton = val => {
    setSelectedRadioDistanceBtn(val);
    setMaxDistanceValue(val === 'all' ? 500 : 50);
  };

  const renderItem = ({item}) => <PlaceItem data={item} />;

  return (
    <View style={styles.container}>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        resetSearchValue={handleResetSearchValue}
      />
      <RadioGroup
        radioButtons={filterRadioButtonsData}
        onPress={onPressRadioButton}
        layout="row"
        selectedId={selectedRadioDistanceBtn}
        labelStyle={{color: '#FFF'}}
        containerStyle={{marginBottom: 10}}
      />
      {state.userLocation && selectedRadioDistanceBtn === 'distance' && (
        <View style={styles.sliderContainer}>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={50}
            maximumValue={500}
            minimumTrackTintColor="#53e1ca"
            maximumTrackTintColor="#FFF"
            thumbTintColor="#53e1ca"
            value={maxDistanceValue}
            onValueChange={onChangeSliderDistance}
          />
          <Text style={styles.distanceText}>
            Lieux à {maxDistanceValue === 500 ? 'plus' : 'moins'} de{' '}
            {maxDistanceValue} Kms
          </Text>
        </View>
      )}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces.reverse()}
          renderItem={renderItem}
          keyExtractor={(item, id) => item.id}
        />
      ) : (
        <Text style={styles.noResultsText}>
          Votre recherche ne permet pas de vous proposer de lieux...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 5,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    // padding:10
  },
  sliderContainer: {
    marginBottom: 20,
  },
});
