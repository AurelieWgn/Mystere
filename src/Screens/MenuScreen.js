import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import {ScreenContainer} from '../Components/ScreenContainer';
import {useNavigation} from '@react-navigation/native';
import {useNotificationContext} from '../Providers/NotificationProvider';

export const MenuScreen = () => {
  const navigation = useNavigation();
  const {
    notificationsEnabled,
    enableNotifications,
    disableNotifications,
    permissionsGranted,
  } = useNotificationContext();

  const toggleSwitch = async () => {
    const newValue = !notificationsEnabled;

    if (newValue) {
      // Activation des notifications
      Alert.alert(
        'Information notifications',
        "L'application Mystère va vous demander une autorisation pour déclencher les alarmes nécessaires au fonctionnement des notifications, si celle-ci n'est pas déjà autorisée.",
        [
          {
            text: "j'ai compris",
            onPress: async () => {
              try {
                const success = await enableNotifications();
                if (!success) {
                  Alert.alert(
                    'Erreur',
                    'Impossible d\'activer les notifications. Veuillez vérifier les permissions dans les paramètres.',
                  );
                }
              } catch (error) {
                console.error('[MenuScreen] Error enabling notifications:', error);
                Alert.alert(
                  'Erreur',
                  'Une erreur est survenue lors de l\'activation des notifications.',
                );
              }
            },
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ],
      );
    } else {
      // Désactivation des notifications
      try {
        await disableNotifications();
      } catch (error) {
        console.error('[MenuScreen] Error disabling notifications:', error);
      }
    }
  };

  const handleEmail = () => {
    const email = 'appmystere@gmail.com';
    const subject = 'Demande de contact';
    const mailtoUrl = `mailto:${email}?subject=${subject}`;

    Linking.openURL(mailtoUrl).catch(error => {
      console.error('Failed to open mail client:', error);
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.itemsContainer}>
        <Image
          source={require('../Img/Mystere_logo.png')}
          style={styles.logo}
        />

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
        {/* <Text
          style={styles.menuItem}
          onPress={() => navigation.navigate('majScreen')}>
          Mises à jour
        </Text> */}

        <View style={styles.toggleContainer}>
          <Text style={styles.notifItemText}>Notifications actives</Text>
          <Switch
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={notificationsEnabled ? 'black' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={notificationsEnabled}
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
