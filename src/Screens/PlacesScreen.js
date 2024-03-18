/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import SearchBar from '../Components/SearchBar';
import {getPlacesBetween, orderPlaceByDistance} from '../Utiles';
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
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedRadioDistanceBtn, setSelectedRadioDistanceBtn] =
    useState('all');
  const [locationPermission, setLocationPermission] = useState(false);
  const locationSvc = new GeolocationSvc();
  const [isLoading, setIsLoading] = useState(true);

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

    let placesBetween = [];

    if (selectedRadioDistanceBtn === 'all') {
      // For All : Random liste
      placesBetween = dataToDistanceFilter
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);
    } else {
      // For distance limite = The farthest at the top
      const liste = getPlacesBetween(
        state.userLocation,
        dataToDistanceFilter,
        maxDistanceValue,
      );
      placesBetween = orderPlaceByDistance(state.userLocation, liste).reverse();
    }
    setFilteredPlaces(placesBetween);
    setIsLoading(false);
  }, [
    searchPhrase,
    maxDistanceValue,
    state.userLocation,
    selectedRadioDistanceBtn,
    state.places,
  ]);

  const handleResetSearchValue = () => {
    setSearchPhrase('');
  };

  const onChangeSliderDistance = newDistance => {
    setMaxDistanceValue(Math.round(newDistance));
  };

  const onPressRadioButton = val => {
    setIsLoading(true);
    setSelectedRadioDistanceBtn(val);
    setMaxDistanceValue(val === 'all' ? 500 : 50);
  };
  const PlaceItemMemo = React.memo(PlaceItem);

  const renderItem = ({item}) => <PlaceItemMemo data={item} />;

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
        isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          <FlatList
            data={filteredPlaces}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )
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
  loaderContainer: {
    height: '100%',
    paddingTop: 50,
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
