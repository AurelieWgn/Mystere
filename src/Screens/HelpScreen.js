/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScreenContainer} from '../Components/ScreenContainer';
import {Text, Image, ScrollView, View} from 'react-native';

export const HelpScreen = () => {
  return (
    <ScreenContainer>
      <ScrollView style={{padding: 10, marginBottom: 30}}>
        <Text style={{color: '#FFF'}}>
          L'application Mystère utilise de manière indirecte la fonction
          localisation de votre smartphone, le choix d'un bon système de
          Géolocalisation est primordial pour être pleinement satisfait lors de
          vos trajets.
          {'\n'} {'\n'}
          Plusieurs options s'offrent à vous:
          {'\n'} {'\n'}• L'application Google Maps utilisé par 1 milliard
          d'utilisateurs mensuels actifs dans le monde. {'\n'}• L'application
          Waze utilisé par 140 millions d'utilisateurs par mois dans le monde,
          dont 17 millions en France. {'\n'}• L'application Mappy utilisé par
          près de 12 millions d'utilisateurs en France chaque mois. {'\n'}
          Conseil: n'hésitez pas à utiliser différentes applications de
          Géolocalisation comme proposé ci-dessus. {'\n'}
          {'\n'}
          Aide concernant l'utilisation de Google Maps: {'\n'}
          {'\n'}
          (1) L'application Google Maps vous demande obligatoirement de
          sélectionner une destination pour en déterminer l'itinéraire.
          {'\n'} {'\n'}
          (2) L'application Google Maps indique chaque destination à l'aide
          d'icône accompagner du nom de celle-ci.
          {'\n'} {'\n'}
          Les exemples d'icônes: {'\n'}
        </Text>
        <Image
          source={require('../Img/Help/icone-transparent.png')}
          style={{width: 200, height: 30, resizeMode: 'contain'}}
        />

        <Text style={{color: '#FFF'}}>
          {'\n'}
          (3) L'application Google Maps n'indique parfois aucune destination au
          premier abord. Il vous faut dès lors zoomer au centre de l'écran sur
          votre smartphone, afin de voir apparaître votre destination.
          {'\n'} {'\n'}
          Exemple:
          {'\n'} {'\n'}
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            marginBottom: 30,
          }}>
          <Image
            source={require('../Img/Help/ex3/n1.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />

          <Image
            source={require('../Img/Help/ex3/n2.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />
        </View>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
          }}>
          <Image
            source={require('../Img/Help/ex3/n3.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />

          <Image
            source={require('../Img/Help/ex3/n4.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />
        </View>

        <Text style={{color: '#FFF'}}>
          {'\n'}
          (4) L'application Google Maps ne vous indique concrètement aucune
          destination. Veuillez alors indiquer le nom de votre destination
          (identifié par une flèche rouge) dans le champ prévu à cet effet sur
          l'application google Maps.
          {'\n'} {'\n'}
          Exemple:
          {'\n'}
        </Text>

        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            marginBottom: 30,
          }}>
          <Image
            source={require('../Img/Help/ex4/n1.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />

          <Image
            source={require('../Img/Help/ex4/n2.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />
        </View>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
          }}>
          <Image
            source={require('../Img/Help/ex4/n3.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />

          <Image
            source={require('../Img/Help/ex4/n4.jpg')}
            style={{width: '49%', height: 200, resizeMode: 'contain'}}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
