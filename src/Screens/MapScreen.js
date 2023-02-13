import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageMapper from '../Components/Mapper';
import MAPPING from '../RegionsMap';

const imageSource = require('../Img/Map/Group.png');


export const MapScreen = () => {
  const navigation = useNavigation();

  const onPressRegion = (id, label) => {
    navigation.navigate('FilteredListeScreen', {regionId: id, regionLabel: label});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez une région</Text>
      <ImageMapper
        imgHeight={400}
        imgWidth={'99%'}
        imgSource={imageSource}
        imgMap={MAPPING}
        onPress={(id, label) => onPressRegion(id, label)}
        containerStyle={styles.myCustomStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    //  flex: 1,
    //  display: 'flex',
    //  flexDirection: 'column',
    //  backgroundColor : '#000',
    //  padding:5
    },
    title:{
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        padding:20,
        // paddingBottom: 0,
    },
    myCustomStyle: {
      width: '100%',
      padding: 10,
      marginTop: 30,
  },
})

