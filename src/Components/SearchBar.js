import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

const SearchBar = ({searchPhrase, setSearchPhrase, resetSearchValue}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Image
          source={require('../Img/recherche.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Rechercher"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          placeholderTextColor="#616162"
        />
      </View>
      {searchPhrase ? (
        <TouchableOpacity onPress={resetSearchValue} style={styles.clearIcon}>
          <Image source={require('../Img/erreur.png')} style={styles.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 10,
  },
  searchSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    paddingVertical: 10, // Ajustez la hauteur de l'input ici si nécessaire
  },
  clearIcon: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
