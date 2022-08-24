import React, {useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {AppContext} from '../Providers/AppProvider';
import {storePlacesData} from '../Utiles';
import {API_URL_ALL_PLACES} from '../env';

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
      try {
        const response = await fetch(API_URL_ALL_PLACES,);
        const places = await response.json();
        dispatch({type: 'INIT_ALL_PLACES', places: places});
        storePlacesData(JSON.stringify(places));

      } catch (err) {
        console.log('splashScreen Fetch places err :', err);
      }
    
      setTimeout(() => {
        navigation.navigate('MainHome');
      }, 5000);
    }
    loadPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../Img/Mystere_logo.png')} style={styles.logo} />
      <Text style={styles.intro}>
        {' '}
        Découvrir la france autrement {'\n'} frissons au rendez-vous{' '}
      </Text>
      <View style={{marginTop: 80}}>
        <Text style={{fontSize: 18, color: "#3d3d3d"}}> Chargement en cours... </Text>
        <ProgressBar styleAttr="Horizontal" color="#000" />
      </View>
    </View>
  );
};

