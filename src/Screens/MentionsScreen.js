import React from 'react';
import {ScreenContainer} from '../Components/ScreenContainer';
import {Text, ScrollView, StyleSheet} from 'react-native';

export const MentionsScreen = () => {
  return (
    <ScreenContainer>
      <ScrollView style={{padding: 10}}>
        <Text style={styles.paragraph}>
          L'application mobile Mystère est éditée par: {'\n'}
          L'auto entreprise Locus {'\n'}
          Représenté par Monsieur Bécasse Anthony{'\n'}
          Adresse: 137 rue grande 14290 Orbec{'\n'}
          E-mail de contact: appmystere@gmail.com {'\n'}
          R.C.S Lisieux: 953 022 019 {'\n'}
          SIRET: 95302201900012 {'\n'}
          Hébergeur: GROUPE LWS 10 Rue de Penthièvre, 75008 Paris {'\n'}
          Numéro de contact: 01 77 62 30 03 {'\n'}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 12,
    color: '#FFF',
  },
});
