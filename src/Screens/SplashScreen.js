import React, {useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text, Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {AppContext} from '../Providers/AppProvider';
import {storePlacesData} from '../Utiles';
import {API_URL_ALL_PLACES} from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    maxWidth: '100%',

    resizeMode: 'contain',
  },
  intro: {
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },
});

export const SplashScreen = () => {
  const navigation = useNavigation();
  const [state, dispatch] = useContext(AppContext);

  //Init all places in AsyncStorage and in local storage (Provider)
  useEffect(() => {
    async function loadPosts() {
      const hasSeenAlertMessageInfo = await AsyncStorage.getItem(
        'hasSeenAlertMessage',
      );
      try {
        const response = await fetch(API_URL_ALL_PLACES);
        const places = await response.json();
        dispatch({type: 'INIT_ALL_PLACES', places: places});
        storePlacesData(JSON.stringify(places));
      } catch (err) {
        console.log('splashScreen Fetch places err :', err);
      }

      if (!hasSeenAlertMessageInfo) {
        setTimeout(() => {
          // Afficher popUp puis redirect
          Alert.alert(
            'Collecte des données de localisation',
            "L’application Mystère collecte des données de localisation en arrière-plan pour la localisation approximative, la recherche d’itinéraires et les notifications même lorsque l'application est fermée ou non utilisée.",
            [
              {
                text: "j'ai compris",
                onPress: async () => {
                  await AsyncStorage.setItem('hasSeenAlertMessage', 'true');
                  navigation.navigate('MainHome');
                },
              },
            ],
          );
        }, 5000);
      } else {
        navigation.navigate('MainHome');
      }
    }
    loadPosts();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../Img/Mystere_logo.png')} style={styles.logo} />
      <Text style={styles.intro}>
        {' '}
        Découvrir la france autrement {'\n'} frissons au rendez-vous{' '}
      </Text>
      <View style={{marginTop: 80}}>
        <Text style={{fontSize: 18, color: '#3d3d3d'}}>
          {' '}
          Chargement en cours...{' '}
        </Text>
        <ProgressBar styleAttr="Horizontal" color="#000" />
      </View>
    </View>
  );
};
