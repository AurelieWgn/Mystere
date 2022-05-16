import React, {useEffect, useContext, useState} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageMapper from '../Components/Mapper';
import MAPPING from '../RegionsMap';

const imageSource = require('../Img/Map/Group.png');

const styles = StyleSheet.create({
  myCustomStyle: {
    width: '100%',
    padding: 10,
    marginTop: '16%',
  },
});

const MapScreen = () => {
  const navigation = useNavigation();

  const onPressRegion = id => {
    navigation.navigate('FilteredListeScreen', {regionId: id});
  };

  return (
    <View style={{position: 'relative'}}>
      <ImageMapper
        imgHeight={500}
        imgWidth={'100%'}
        imgSource={imageSource}
        imgMap={MAPPING}
        onPress={id => onPressRegion(id)}
        containerStyle={styles.myCustomStyle}
        selectedAreaId="my_area_id"
      />
    </View>
  );
};

export default MapScreen;
