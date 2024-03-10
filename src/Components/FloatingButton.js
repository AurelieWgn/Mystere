/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Animated} from 'react-native';

export const FloatingButton = ({activeNotifications, close}) => {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(new Animated.Value(0));
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [running, setRunning] = useState(1);
  const shakeAnimation = useState(new Animated.Value(0))[0];

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(startShake, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    if (index > 0) {
      return;
    }
    Animated.parallel([
      Animated.timing(current, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(progress, {
        toValue: index + 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIndex(index + 1);
      current.setValue(0);
      if (index > 0) {
        setTimeout(() => {
          setRunning(0);
        }, 500);
      }
    });
  };

  const progressAnim = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '96%'],
  });

  const barSize = {
    height: progressAnim,
    width: progressAnim,
  };

  const renderElement = () => {
    return (
      <View style={styles.mainView}>
        <Animated.View style={[styles.bar, barSize]}>
          <Text style={styles.title}>
            Activez les notifications à partir du menu pour recevoir des alertes
            lorsque vous passez à proximité d'un lieu intéressent.
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={activeNotifications}>
              <Text style={styles.actionText}>Aller au Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={close}>
              <Text style={styles.actionText}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <TouchableOpacity style={styles.IconBtn} onPress={handlePress}>
          <Animated.Image
            source={require('../Img/notification.png')}
            style={{
              width: 30,
              height: 30,
              transform: [{translateX: shakeAnimation}],
            }}
          />
        </TouchableOpacity>
        <View style={{height: 120, width: 0}} />
      </View>
    );
  };

  return renderElement();
};

const styles = StyleSheet.create({
  mainView: {
    zIndex: 9,
    width: '100%',
    height: '400px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 70,
    right: 5,
  },
  bar: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    position: 'absolute',
    paddingRight: 80,
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1,
    shadowRadius: 20.0,
    elevation: 9,
  },

  IconBtn: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#FFF',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  title: {
    color: '#000',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  actionButton: {
    // margin: 2,
    // borderColor: '#000',
    // borderBottomWidth: 1,
  },
  actionText: {
    color: '#000',
    fontWeight: 'bold',
    margin: 3,
    textDecorationLine: 'underline',
  },
});
