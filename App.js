import React, {useEffect, useContext} from 'react';
import { StyleSheet, Image } from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';
import {AppContext} from './src/Providers/AppProvider';
import {MenuIcon} from "./src/Components/MenuIcon";
import {emptyNotifiedPlacesFormAsyncStorage} from './src/Utiles';
import { CGVScreen } from './src/Screens/CGVScreen';
import { CGUScreen } from './src/Screens/CGUScreen';
import { navigationRef } from './src/Services/RefNavigationService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab bar will be displayed on :
const MainTabNavigation = () => {
  return (
    <Tab.Navigator 
      initialRouteName="SplashScreen"
      screenOptions= {({  }) => ({
          tabBarActiveTintColor: '#773B43',
          tabBarInactiveTintColor: '#000',
          tabBarShowLabel: false,
        })}       
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Accueil',
          tabBarIcon: (props) => (
             <MenuIcon 
              name='Accueil'
              {...props}
            >
              <Image
                source={require('./src/Img/TabBarIcons/home.png')}
                style={{width: 24, height: 24}}
              />   
            </MenuIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Recherche"
        component={PlacesScreen}
        options={{
          headerShown: false,
          title: 'Recherche',
          tabBarIcon: (props) => (
             <MenuIcon 
              name='Recherche'
              {...props}
            >
              <Image
                source={require('./src/Img/TabBarIcons/search.png')}
                style={{width: 20, height: 20}}
              />   
            </MenuIcon>
          ),
        }}
      />
       <Tab.Screen
        name="Carte"
        component={MapScreen}
        options={{
          headerShown: false,
          title: 'Carte',
           tabBarIcon: (props) => (
            <MenuIcon 
              name='Carte'
              {...props}
            >
              <Image
                source={require('./src/Img/TabBarIcons/la-france.png')}
                style={{width: 24, height: 24}}
              />   
            </MenuIcon>
          )
        
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: (props) => (
            <MenuIcon 
              name='Menu'
              {...props}
            >
              <Image
                source={require('./src/Img/TabBarIcons/menu.png')}
                style={{width: 24, height: 24}}
              />   
            </MenuIcon>
          )
        }}
      />
    </Tab.Navigator>
  );
};


const App = () => {
  const [state, dispatch] = useContext(AppContext);

  // React.useEffect(() => {
  //   const startBackgroundService = async () => {
  //      try {
  //           const notifiactionsStatus = await AsyncStorage.getItem('notifications_status');
    
  //           if(notifiactionsStatus == null){
  //             await AsyncStorage.setItem('notifications_status', 'true');
  //             if(!backgroundTaskIsRunning()){
  //               await startStask();  
  //             }
  //           }
  //           else{
  //              if(!backgroundTaskIsRunning() && JSON.parse(notifiactionsStatus)){
  //               await startStask();   
  //             }
  //             else if(backgroundTaskIsRunning() && !JSON.parse(notifiactionsStatus)){
  //               await stopStask();  
  //             } 
  //           }
  //       } catch (e) {
  //           console.log("[App] --> Can't set notifications_status to true", e)
  //       } 
  //   };
  //   startBackgroundService();
  // }, []);


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

  // const disableNotifications = async () =>{
  //    await AsyncStorage.setItem('notifications_status', `false`)
  // }

  
  useEffect(()=>{
      initLocation()
      emptyNotifiedPlacesFormAsyncStorage()
  }, [])

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
          <Stack.Screen
          name="CGVScreen"
          component={CGVScreen}
          options={{headerShown: true, title: 'Conditions général de vente'}}
        />
         <Stack.Screen
          name="CGUScreen"
          component={CGUScreen}
          options={{headerShown: true, title: "Conditions général d\'utilisation"}}
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
