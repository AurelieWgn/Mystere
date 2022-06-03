import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  FlatList,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/Screens/HomeScreen';
import SplashScreen from './src/Screens/SplashScreen';
import MenuScreen from './src/Screens/MenuScreen';
import PlacesScreen from './src/Screens/PlacesScreen';
import SearchScreen from './src/Screens/SearchScreen';
import SinglePlaceScreen from './src/Screens/SinglePlaceScreen';
import FilteredListeScreen from './src/Screens/FilteredListeScreen';
import MapScreen from './src/Screens/MapScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import useTracking from "./src/Services/Hooks/useTracking";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


// Bottom tab bar will be displayed on :
const MainTabNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="SplashScreen">
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
        component={SearchScreen}
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
      <Tab.Screen
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
      />
      <Tab.Screen
        name="Menu"
        component={MapScreen}
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
        // listeners={({ navigation }) => ({
        //   tabPress: e => {
        //     e.preventDefault();
        //     // navigation.openDrawer();
        //   }
        // })}
      />
    </Tab.Navigator>
  );
};

//Drawer
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator detachInactiveScreens={true}>
      <Drawer.Screen name="Mention" component={MenuScreen} />
      <Drawer.Screen name="Carte de France" component={MenuScreen} />
      <Drawer.Screen name="Contact" component={MenuScreen} />
      <Drawer.Screen name="Mise à jour" component={MenuScreen} />
    </Drawer.Navigator>
  );
};



const App = () => {
  const {location} = useTracking(true);

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
    
            console.log("getCurrentLatLong::catcherror =>", error);
            return { status: false, message: "[MapSvc] Can not get position" };
      
        };
        // await locationSvc.getCurrantLocation().then(async(pos)=>{
        //     console.log("pos Liste", pos)
        //     dispatch({type: "UPDATE_USER_LOCATION", location: pos})
        // });
  }

   

  const emptyNotifiedPlacesFormAsyncStorage = async()=>{
    console.log("new Date()", typeof new Date())
    try {
      const lastDelete = await AsyncStorage.getItem('lastStorageDelete');
      if(!lastDelete){
        await AsyncStorage.setItem('lastStorageDelete', new Date().toString());
        await AsyncStorage.removeItem('stored_places');
      }
      else{
        const twoDaysAgo = moment().subtract(2, 'days');
        if(moment(lastDelete).isBefore(twoDaysAgo)){
           await AsyncStorage.removeItem('stored_places');
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
  })

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
          options={{headerShown: true, title: 'Lieux'}}
        />
        <Stack.Screen
          name="FilteredListeScreen"
          component={FilteredListeScreen}
          options={{headerShown: true, title: ''}}
        />
        <Stack.Screen
          name="mapScreen"
          component={MapScreen}
          options={{headerShown: true, title: ''}}
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
