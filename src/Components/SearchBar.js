import React from "react";
import { StyleSheet, TextInput, View,  Image,  TouchableOpacity } from "react-native";


const SearchBar = ({searchPhrase, setSearchPhrase, resetSearchValue}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher"
        value={searchPhrase}
        onChangeText={setSearchPhrase}
      />
      {
        searchPhrase ? 
        <TouchableOpacity onPress={resetSearchValue}>
          <Image
            source={require('../Img/erreur.png')}
            style={{width:24, height:24 }}
          />
        </TouchableOpacity>
        : null
      }
    </View>
  );
};
export default SearchBar;


const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 0,
    paddingHorizontal : 5,
    borderRadius : 5,
  },
  input: {
    fontSize: 18,
    width: "80%",
    color: "#000"
    // textTransform: 'lowercase'
  },
});
