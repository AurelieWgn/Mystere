import React, {useEffect, useContext} from 'react';
import { StyleSheet, Image } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/Screens/HomeScreen';
import {SplashScreen} from './src/Screens/SplashScreen';
import {MenuScreen} from './src/Screens/MenuScreen';
import {PlacesScreen} from './src/Screens/PlacesScreen';
import {SearchScreen} from './src/Screens/SearchScreen';
import {SinglePlaceScreen} from './src/Screens/SinglePlaceScreen';
import {FilteredListeScreen} from './src/Screens/FilteredListeScreen';
import {MapScreen} from './src/Screens/MapScreen';
import {MentionsScreen} from './src/Screens/MentionsScreen';
import {HelpScreen} from './src/Screens/HelpScreen';
import {MajScreen} from './src/Screens/MajScreen';
import {ContactScreen} from './src/Screens/ContactScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import {useTracking} from "./src/Services/Hooks/useTracking";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from './src/Providers/AppProvider';
import RNLocation from 'react-native-location';
import { AppRegistry } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

RNLocation.configure({
  distanceFilter: 100, // Meters
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  // Android only
  androidProvider: 'auto',
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});

ReactNativeForegroundService.add_task(() => useTracking(true), {
  delay: 100,
  onLoop: true,
  taskId: 'taskid',
  onError: (e) => console.log(`Error logging:`, e),
});

ReactNativeForegroundService.start({
    id: 144,
    title: 'Foreground Service',
    message: 'you are online!',
});


ReactNativeForegroundService.register();


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab bar will be displayed on :
const MainTabNavigation = () => {
  return (
    <Tab.Navigator 
      initialRouteName="SplashScreen"
      screenOptions= {({  }) => ({
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: '#000',
        })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Accueil',
          tabBarIcon: () => (
            <Image
              source={require('./src/Img/TabBarIcons/home.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recherche"
        component={PlacesScreen}
        options={{
          headerShown: false,
          title: 'Recherche',
          tabBarIcon: () => (
            <Image
              source={require('./src/Img/TabBarIcons/search.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
     
      {/* <Tab.Screen
        name="Lieux"
        component={PlacesScreen}
        options={{
          headerShown: false,
          title: 'Lieux',
          tabBarIcon: () => (
            <Image
              source={require('./src/Img/TabBarIcons/place.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      /> */}
       <Tab.Screen
        name="Carte"
        component={MapScreen}
        options={{
          headerShown: false,
          title: 'Carte',
          tabBarIcon: () => (
            <Image
              source={require('./src/Img/TabBarIcons/la-france.png')}
              style={{width: 30, height: 30}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: () => (
            <Image
              source={require('./src/Img/TabBarIcons/menu.png')}
              style={{width: 24, height: 24}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [state, dispatch] = useContext(AppContext);

  const initLocation = async() =>{
        try {
      
            Geolocation.getCurrentPosition(
              (data) => {
                pos = {longitude: data.coords.longitude, latitude: data.coords.latitude};
                // return { status: true, pos};
                dispatch({type: "UPDATE_USER_LOCATION", location: pos})
         
              },
              (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true}
            )   
          
          } catch (error) {
    
            console.log("App.js getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };

  }

  const emptyNotifiedPlacesFormAsyncStorage = async()=>{
    try {
      const lastDelete = await AsyncStorage.getItem('lastStorageDelete');
      if(!lastDelete){
        await AsyncStorage.setItem('lastStorageDelete', new Date().toString());
        await AsyncStorage.removeItem('notified_places');
      }
      else{
        const twoDaysAgo = moment().subtract(2, 'days');
        if(moment(lastDelete).isBefore(twoDaysAgo)){
           await AsyncStorage.removeItem('notified_places');
           await AsyncStorage.setItem('lastStorageDelete', new Date().toString());
        }
      }
      
    } catch (e) {
      console.log("[Utiles] --> emptyNotifiedPlacesFormAsyncStorage")
    }
  }

  useEffect(()=>{
      initLocation()
      emptyNotifiedPlacesFormAsyncStorage()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false, title: 'SplashScreen'}}
        />
        <Stack.Screen
          name="MainHome"
          options={{headerShown: false, title: 'Home'}}
          component={MainTabNavigation}
        />
        <Stack.Screen
          name="SinglePlaceScreen"
          component={SinglePlaceScreen}
          options={({ route }) => ({headerShown: true, title: route.params.name })}
        />
        <Stack.Screen
          name="FilteredListeScreen"
          component={FilteredListeScreen}
          options={({ route }) => ({headerShown: true, title: route.params.regionLabel})}
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
          options={{headerShown: true, title: 'Besoin d\'aide ?'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
