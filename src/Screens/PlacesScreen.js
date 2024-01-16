/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext, useMemo} from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
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
  const [filteredPlaces, setFilteredPlaces] = useState(state.places);
  const [maxDistanceValue, setMaxDistanceValue] = useState(50);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [radioButtons, setRadioButtons] = useState(filterRadioButtonsData);
  const [selectedRadioDistanceBtn, setSelectedRadioDistanceBtn] =
    useState('all');
  const [locationPermission, setLocationPermission] = useState(false);
  const locationSvc = new GeolocationSvc();

  const filterRadioButtonsData = useMemo(
    () => [
      {
        id: 'all',
        label: 'Tout',
        value: 'all',
        color: '#FFFFFF',
        size: 14,
      },
      {
        id: 'distance',
        label: 'Filtrer par distance',
        value: 'distance',
        color: '#FFFFFF',
        size: 14,
      },
    ],
    [],
  );

  useEffect(() => {
    setMaxDistanceValue(500);
    setFilteredPlaces(state.places);
  }, []);

  useEffect(() => {
    executeFiltering();
  }, [searchPhrase, maxDistanceValue]);

  useEffect(() => {
    if (state.userLocation) {
      executeFiltering();
    }
  }, [state.userLocation]);

  useEffect(() => {}, [filteredPlaces]);

  const getLocationPermition = async () => {
    locationSvc.askForGeolocationPermission().then(resp => {
      setLocationPermission(resp);
    });
  };

  useEffect(() => {
    if (!locationPermission) {
      getLocationPermition();
    }
    if (!state.userLocation && locationPermission) {
      initLocation();
    }
  }, [locationPermission]);

  const initLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        data => {
          const pos = {
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
  const handleResetSearchValue = () => {
    setSearchPhrase('');
    setFilteredPlaces(state.places);
  };

  const onChangeSliderDistance = newDistance => {
    setMaxDistanceValue(Math.round(newDistance));
  };

  const onPressRadioButton = value => {
    setSelectedRadioDistanceBtn(value);
    value === 'all' ? setMaxDistanceValue(500) : setMaxDistanceValue(50);
  };

  const executeFiltering = () => {
    const dataToDistanceFilter =
      searchPhrase.length > 2
        ? state.places.filter(
            places =>
              places.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
              places.description
                .toLowerCase()
                .includes(searchPhrase.toLowerCase()),
          )
        : state.places;

    const placesBetween =
      maxDistanceValue === 500
        ? dataToDistanceFilter
        : getPlacesBetween(
            state.userLocation,
            dataToDistanceFilter,
            maxDistanceValue,
          );
    setFilteredPlaces(placesBetween);
  };

  const renderItem = ({item}) => {
    return <PlaceItem data={item} />;
  };

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
        labelStyle={{color: ' #FFFFFF'}}
        containerStyle={{marginBottom: 10}}
      />
      {state.userLocation && selectedRadioDistanceBtn === 'distance' ? (
        <View style={styles.sliderContainer}>
          <Slider
            style={{width: '100%', height: 40, color: '#FFF'}}
            minimumValue={50}
            maximumValue={+500}
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
      ) : null}

      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderItem}
          keyExtractor={(item, id) => item.id}
        />
      ) : (
        <>
          {(searchPhrase != '' && searchPhrase.length > 2) ||
          filteredPlaces.length < 1 ? (
            <Text style={styles.distanceText}>
              Votre recherche ne permet pas de vous proposer de lieux ...
            </Text>
          ) : null}
        </>
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
