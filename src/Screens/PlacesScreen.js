/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useMemo, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import SearchBar from '../Components/SearchBar';
import {getPlacesBetween, orderPlaceByDistance} from '../Utiles';
import {PlaceItem} from '../Components/PlaceItem';
import {AppContext} from '../Providers/AppProvider';
import Slider from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import {useLocationContext} from '../Providers/LocationProvider';

export const PlacesScreen = () => {
  const [state, dispatch] = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [debouncedSearchPhrase, setDebouncedSearchPhrase] = useState('');
  const [maxDistanceValue, setMaxDistanceValue] = useState(50);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedRadioDistanceBtn, setSelectedRadioDistanceBtn] = useState('all');
  const [isFiltering, setIsFiltering] = useState(false);
  
  const {
    userLocation,
    foregroundPermissionGranted,
    requestForegroundPermission,
    isLoadingLocation,
    locationError,
  } = useLocationContext();

  const filterRadioButtonsData = useMemo(
    () => [
      {id: 'all', label: 'Tout', value: 'all', color: '#FFF', size: 14},
      {
        id: 'distance',
        label: 'Filtrer par distance',
        value: 'distance',
        color: '#FFF',
        size: 14,
      },
    ],
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchPhrase(searchPhrase);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchPhrase]);

  useEffect(() => {
    const initLocation = async () => {
      if (!foregroundPermissionGranted) {
        await requestForegroundPermission();
      }
    };
    initLocation();
  }, []);

  useEffect(() => {
    if (userLocation && (!state.userLocation || 
        state.userLocation.latitude !== userLocation.latitude ||
        state.userLocation.longitude !== userLocation.longitude)) {
      dispatch({type: 'UPDATE_USER_LOCATION', location: userLocation});
    }
  }, [userLocation, state.userLocation, dispatch]);

  useEffect(() => {
    const filterPlaces = async () => {
      setIsFiltering(true);

      const searchFiltered = debouncedSearchPhrase.length > 2
        ? state.places.filter(place =>
            place.name.toLowerCase().includes(debouncedSearchPhrase.toLowerCase()) ||
            place.description.toLowerCase().includes(debouncedSearchPhrase.toLowerCase())
          )
        : state.places;

      let result = [];

      if (selectedRadioDistanceBtn === 'all') {
        // Mode "Tout" : Liste aléatoire
        result = searchFiltered
          .map(value => ({value, sort: Math.random()}))
          .sort((a, b) => a.sort - b.sort)
          .map(({value}) => value);
      } else {
        // Mode "Distance" : Filtrer par distance puis trier
        if (userLocation) {
          const placesInRange = getPlacesBetween(
            userLocation,
            searchFiltered,
            maxDistanceValue,
          );
          // Les plus proches en premier
          result = orderPlaceByDistance(userLocation, placesInRange);
        } else {
          // Pas de localisation → afficher tous les résultats de recherche
          result = searchFiltered;
        }
      }

      setFilteredPlaces(result);
      setIsFiltering(false);
    };

    filterPlaces();
  }, [
    debouncedSearchPhrase,
    maxDistanceValue,
    userLocation,
    selectedRadioDistanceBtn,
    state.places,
  ]);

  const handleResetSearchValue = useCallback(() => {
    setSearchPhrase('');
    setDebouncedSearchPhrase('');
  }, []);

  const onChangeSliderDistance = useCallback((newDistance) => {
    setMaxDistanceValue(Math.round(newDistance));
  }, []);

  const onPressRadioButton = useCallback((val) => {
    setIsFiltering(true);
    setSelectedRadioDistanceBtn(val);
    setMaxDistanceValue(val === 'all' ? 500 : 50);
  }, []);

  const handleRequestLocation = useCallback(async () => {
    await requestForegroundPermission();
  }, [requestForegroundPermission]);

  const PlaceItemMemo = useMemo(() => React.memo(PlaceItem), []);
  const renderItem = useCallback(({item}) => <PlaceItemMemo data={item} />, [PlaceItemMemo]);

  // ✅ Messages d'état améliorés
  const renderContent = () => {
    // Pas de lieux chargés
    if (!state.places || state.places.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chargement des lieux...</Text>
          <ActivityIndicator size="large" color="#FFF" style={{marginTop: 20}} />
        </View>
      );
    }

    // Permission refusée + mode distance
    if (!foregroundPermissionGranted && selectedRadioDistanceBtn === 'distance') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            📍 Permission de localisation requise
          </Text>
          <Text style={styles.emptySubText}>
            Pour filtrer par distance, nous avons besoin d'accéder à votre position.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleRequestLocation}>
            <Text style={styles.buttonText}>Autoriser la localisation</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Erreur de localisation + mode distance
    if (locationError && selectedRadioDistanceBtn === 'distance') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>⚠️ Erreur de localisation</Text>
          <Text style={styles.emptySubText}>{locationError}</Text>
        </View>
      );
    }

    // Chargement de la localisation + mode distance
    if (isLoadingLocation && selectedRadioDistanceBtn === 'distance') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Obtention de votre position...</Text>
          <ActivityIndicator size="large" color="#FFF" style={{marginTop: 20}} />
        </View>
      );
    }

    // Filtrage en cours
    if (isFiltering) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Filtrage en cours...</Text>
        </View>
      );
    }

    // Aucun résultat
    if (filteredPlaces.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun lieu trouvé</Text>
          <Text style={styles.emptySubText}>
            {debouncedSearchPhrase.length > 2
              ? `Aucun résultat pour "${debouncedSearchPhrase}"`
              : selectedRadioDistanceBtn === 'distance'
              ? `Aucun lieu dans un rayon de ${maxDistanceValue} km`
              : 'Aucun lieu disponible'}
          </Text>
        </View>
      );
    }

    // Afficher les résultats
    return (
      <FlatList
        data={filteredPlaces}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          debouncedSearchPhrase.length > 2 ? (
            <View style={styles.resultHeader}>
              <Text style={styles.resultText}>
                {filteredPlaces.length} résultat{filteredPlaces.length > 1 ? 's' : ''} pour "{debouncedSearchPhrase}"
              </Text>
            </View>
          ) : null
        }
      />
    );
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
        labelStyle={{color: '#FFF'}}
        containerStyle={{marginBottom: 10}}
      />
      {userLocation && selectedRadioDistanceBtn === 'distance' && (
        <View style={styles.sliderContainer}>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={50}
            maximumValue={500}
            minimumTrackTintColor="#773B43"
            maximumTrackTintColor="#FFF"
            thumbTintColor="#773B43"
            value={maxDistanceValue}
            onValueChange={onChangeSliderDistance}
          />
          <Text style={styles.distanceText}>
            Lieux à {maxDistanceValue === 500 ? 'plus' : 'moins'} de {maxDistanceValue} Kms
          </Text>
        </View>
      )}
      {renderContent()}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#773B43',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultHeader: {
    padding: 10,
    backgroundColor: 'rgba(119, 59, 67, 0.2)',
    marginBottom: 5,
  },
  resultText: {
    color: '#F3E0E2',
    fontSize: 14,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
});
