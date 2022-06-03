import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Image, Icon, TouchableOpacity } from "react-native";


const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked, resetSearchValue}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={searchPhrase}
        onChangeText={setSearchPhrase}
        onFocus={() => {
          setClicked(true);
        }}
      />
      {
        searchPhrase != '' && 
        <TouchableOpacity onPress={resetSearchValue}>
          <Image
            source={require('../Img/erreur.png')}
            style={{width:24, height:24 }}
          />
        </TouchableOpacity>
      }
     
    </View>
  );
};
export default SearchBar;


const styles = StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFF",
    padding : 5,
    borderRadius : 5,


  },
  input: {
    fontSize: 18,
    width: "80%",
    // textTransform: 'lowercase'
  },
});
