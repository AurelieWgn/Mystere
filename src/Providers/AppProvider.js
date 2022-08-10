import React from 'react';

const initialState = {
    places : [],
    filteredPlaces : [],
    userLocation : null,
};

const AppContext = React.createContext();

const AppReduceur = (state, action) =>{

    let newState = {...state};
    switch(action.type){
        case 'INIT_RANDOM_PLACES': 
        
        case 'INIT_ALL_PLACES': 
            newState.places = action.places;
            return newState
        
        case 'UPDATE_USER_LOCATION':
            newState.userLocation = action.location
            return newState
        
        case 'INIT_FILTERED_PLACES': 
            newState.filteredPlaces = action.filteredPlaces;
            return newState
    }

}

const AppProvider = ({children}) =>{
    const [state, dispatch] = React.useReducer(AppReduceur, initialState);

    return (
        <AppContext.Provider value={[state, dispatch]}>
            {children}
        </AppContext.Provider>
    )

}

export {AppProvider, AppContext }

