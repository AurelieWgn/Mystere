/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
import {StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/Screens/HomeScreen';
import {SplashScreen} from './src/Screens/SplashScreen';
import {MenuScreen} from './src/Screens/MenuScreen';
import {PlacesScreen} from './src/Screens/PlacesScreen';
import {SinglePlaceScreen} from './src/Screens/SinglePlaceScreen';
import {FilteredListeScreen} from './src/Screens/FilteredListeScreen';
import {MapScreen} from './src/Screens/MapScreen';
import {MentionsScreen} from './src/Screens/MentionsScreen';
import {HelpScreen} from './src/Screens/HelpScreen';
import {MajScreen} from './src/Screens/MajScreen';
import {ContactScreen} from './src/Screens/ContactScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import {AppContext} from './src/Providers/AppProvider';
import {MenuIcon} from './src/Components/MenuIcon';
import {emptyNotifiedPlacesFormAsyncStorage} from './src/Utiles';
import {CGVScreen} from './src/Screens/CGVScreen';
import {CGUScreen} from './src/Screens/CGUScreen';
import {useNotifService} from './src/Hooks/useNotifications';
import {navigationRef} from './src/Services/RefNavigationSvc';
import {useLocationContext} from './src/Providers/LocationProvider';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeIcon = props => (
  <MenuIcon name="Accueil" {...props}>
    <Image
      source={require('./src/Img/TabBarIcons/home.png')}
      style={{width: 24, height: 24}}
    />
  </MenuIcon>
);

const SearchIcon = props => (
  <MenuIcon name="Recherche" {...props}>
    <Image
      source={require('./src/Img/TabBarIcons/search.png')}
      style={{width: 24, height: 24}}
    />
  </MenuIcon>
);

const MapIcon = props => (
  <MenuIcon name="Carte" {...props}>
    <Image
      source={require('./src/Img/TabBarIcons/la-france.png')}
      style={{width: 24, height: 24}}
    />
  </MenuIcon>
);

const SettingsIcon = props => (
  <MenuIcon name="Menu" {...props}>
    <Image
      source={require('./src/Img/TabBarIcons/menu.png')}
      style={{width: 24, height: 24}}
    />
  </MenuIcon>
);

// Bottom tab bar will be displayed on :
const MainTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        tabBarActiveTintColor: '#773B43',
        tabBarInactiveTintColor: '#000',
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="SplashScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'SplashScreen',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Recherche"
        component={PlacesScreen}
        options={{
          headerShown: false,
          title: 'Recherche',
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Carte"
        component={MapScreen}
        options={{
          headerShown: false,
          title: 'Carte',
          tabBarIcon: MapIcon,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [state, dispatch] = useContext(AppContext);
  const notifSvc = useNotifService();
  const {getCurrentLocation, updateUserLocation} = useLocationContext();

  const initLocation = async () => {
    try {
      // Utiliser le LocationProvider optimisé
      const location = await getCurrentLocation();
      
      if (location) {
        // Mettre à jour le contexte App pour compatibilité avec le code existant
        dispatch({type: 'UPDATE_USER_LOCATION', location});
        console.log('[App] Location initialized:', location);
      } else {
        console.warn('[App] Could not get initial location');
      }
    } catch (error) {
      console.error('[App] Error initializing location:', error);
    }
  };

  useEffect(() => {
    initLocation();
    emptyNotifiedPlacesFormAsyncStorage();
  }, []);

  useEffect(() => {
    // Subscribe to notifications events
    notifSvc.subscribeForgroundEvents();
  }, [notifSvc]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false, title: 'SplashScreen'}}
        />
        <Stack.Screen
          name="MainHome"
          options={{headerShown: false, title: 'Home', gestureEnabled: false}}
          component={MainTabNavigation}
        />
        <Stack.Screen
          name="SinglePlaceScreen"
          component={SinglePlaceScreen}
          options={({route}) => ({headerShown: true, title: route.params.name})}
        />
        <Stack.Screen
          name="FilteredListeScreen"
          component={FilteredListeScreen}
          options={({route}) => ({
            headerShown: true,
            title: route.params.regionLabel,
          })}
        />
        <Stack.Screen
          name="mapScreen"
          component={MapScreen}
          options={{headerShown: true, title: 'Carte de France'}}
        />
        <Stack.Screen
          name="mentionsScreen"
          component={MentionsScreen}
          options={{headerShown: true, title: 'Mentions légales'}}
        />
        <Stack.Screen
          name="contactScreen"
          component={ContactScreen}
          options={{headerShown: true, title: 'Contact'}}
        />
        <Stack.Screen
          name="majScreen"
          component={MajScreen}
          options={{headerShown: true, title: 'Mises à jour'}}
        />
        <Stack.Screen
          name="helpScreen"
          component={HelpScreen}
          options={{headerShown: true, title: "Besoin d'aide ?"}}
        />
        <Stack.Screen
          name="CGVScreen"
          component={CGVScreen}
          options={{headerShown: true, title: 'Conditions général de vente'}}
        />
        <Stack.Screen
          name="CGUScreen"
          component={CGUScreen}
          options={{
            headerShown: true,
            title: "Conditions général d'utilisation",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
