import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Switch,
  Linking,
  Alert,
  Button,
} from 'react-native';
import {ScreenContainer} from '../Components/ScreenContainer';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {stockNotificationForLater} from '../Utiles';
import {
  stopStask,
  checkPermissionAndStartTask,
  backgroundTaskIsRunning,
} from '../Services/StaksSvc';
import PushNotificationSvc from '../Services/NotificationSvc';

export const MenuScreen = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;

    if (newValue) {
      Alert.alert(
        'Information notifications',
        "L'application Mystère va vous demander une autorisation pour déclencher les alarmes nécessaires au fonctionnement des notifications, si celle-ci n'est pas déjà autorisée.",
        [
          {
            text: "j'ai compris",
            onPress: async () => {
              try {
                console.log('okay ! ', newValue);

                setIsEnabled(newValue); // true
                await AsyncStorage.setItem(
                  'notifications_status',
                  `${newValue}`,
                );
                backgroundTaskIsRunning()
                  ? null
                  : await checkPermissionAndStartTask();
              } catch (error) {
                console.log('menuScreen err', error);
              }
            },
          },
        ],
      );
    } else {
      try {
        setIsEnabled(newValue); // false
        await AsyncStorage.setItem('notifications_status', `${newValue}`);
        await stopStask();
      } catch (error) {
        console.log('menuScreen err', error);
      }
    }
  };

  const initToggle = async () => {
    try {
      const notifiactionsStatus = await AsyncStorage.getItem(
        'notifications_status',
      );
      if (notifiactionsStatus) {
        setIsEnabled(JSON.parse(notifiactionsStatus));
      }
    } catch (e) {
      console.log(
        "[Menu] --> Can't update notifications_status by menu toggle",
      );
    }
  };

  React.useEffect(() => {
    initToggle();
  }, []);

  const handleEmail = () => {
    const email = 'appmystere@gmail.com';
    const subject = 'Demande de contact';
    const mailtoUrl = `mailto:${email}?subject=${subject}`;

    Linking.openURL(mailtoUrl).catch(error => {
      console.error('Failed to open mail client:', error);
    });
  };

  const sendFakeTestNotif = async () => {
    const fakePlace = {
      addres: '1 Avenue du Colonel Henri Rol Tanguy, 75014 Paris',
      coords: {latitude: '48.8337', longitude: '2.3323'},
      description:
        'Les catacombes de Paris, sont situées à Paris dans le département de Paris en région Île de France. Le plus grand ossuaire souterrain du monde, ce lieu mystérieux fait partie des monuments incontournables de la capitale.',
      id: '1055',
      img: 'Les-Catacombes-de-Paris-01.jpg',
      latitude: '48.8337',
      longitude: '2.3323',
      name: 'Les Catacombes de Paris',
      region: '8',
    };
    // await stockNotificationForLater(fakePlace);
    PushNotificationSvc.schduleNotification(fakePlace);
  };

  return (
    <ScreenContainer>
      <View style={styles.itemsContainer}>
        <Image
          source={require('../Img/Mystere_logo.png')}
          style={styles.logo}
        />
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('mapScreen')}>
          Carte de France
        </Text>
        <View style={styles.inlineCG}>
          <Text
            style={styles.menuItem}
            onPress={() => navigation.navigate('CGVScreen')}>
            CGV
          </Text>
          <Text style={{color: '#000'}}>-</Text>
          <Text
            style={styles.menuItem}
            onPress={() => navigation.navigate('CGUScreen')}>
            CGU
          </Text>
        </View>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('mentionsScreen')}>
          Mentions légales
        </Text>
        <Text style={styles.menuItem} onPress={handleEmail}>
          Contact
        </Text>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('helpScreen')}>
          Besoin d'aide
        </Text>
        <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('majScreen')}>
          Mises à jour
        </Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.notifItemText}>Notifications actives</Text>
          <Switch
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={isEnabled ? 'black' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch()}
            value={isEnabled}
          />
        </View>
        <Text style={styles.notifItemSubText}>
          Activez les notifications pour recevoir des alertes lorsque vous
          passez à proximité d'un lieu intéressent.
        </Text>
        {/* For dev only */}
        {/* {
          <Button
            onPress={() => sendFakeTestNotif()}
            title="SEND NOTIF"
            color="#773B43"
            accessibilityLabel="send notif"
          />
        } */}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    color: '#000',
    textTransform: 'uppercase',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 4,
  },
  itemsContainer: {
    width: '90%',
    backgroundColor: '#F4F4F4',
    alignSelf: 'center',
    direction: 'column',
    justifyContent: 'space-evenly',
    margin: 20,
    height: '95%',
    borderRadius: 5,
    padding: 10,
  },
  logo: {
    maxWidth: '90%',
    height: '28%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifItemText: {
    marginRight: 5,
    color: '#595959',
  },
  notifItemSubText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#595959',
  },
  inlineCG: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
