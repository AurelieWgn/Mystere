import React from 'react';
import {NotificationProvider} from './NotificationProvider';
import {LocationProvider} from './LocationProvider';

const initialState = {
  places: [],
  filteredPlaces: [],
  userLocation: null, // ⚠️ DÉPRÉCIÉ : Utiliser LocationProvider.userLocation à la place
};

const AppContext = React.createContext();

const AppReduceur = (state, action) => {
  let newState = {...state};
  switch (action.type) {
    case 'INIT_RANDOM_PLACES':
    case 'INIT_ALL_PLACES':
      newState.places = action.places;
      return newState;

    case 'UPDATE_USER_LOCATION':
      // ⚠️ DÉPRÉCIÉ : Maintenu pour compatibilité
      // Utiliser LocationProvider.updateUserLocation à la place
      newState.userLocation = action.location;
      return newState;

    case 'INIT_FILTERED_PLACES':
      newState.filteredPlaces = action.filteredPlaces;
      return newState;
  }
};

const AppProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(AppReduceur, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <LocationProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </LocationProvider>
    </AppContext.Provider>
  );
};

export {AppProvider, AppContext};
