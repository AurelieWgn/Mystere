import {refNavigate} from './RefNavigationSvc';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import {
  getStockedNotificationForLater,
  stockNotificationForLater,
} from '../Utiles';

export default class NotificationSvc {
  async onDisplayNotification(place) {
    try {
      console.log('NotificationSvc start - Android version:', Platform.Version);
      
      // Vérifier les permissions pour Android 14+
      if (Platform.OS === 'android' && Platform.Version >= 34) {
        const settings = await notifee.getNotificationSettings();
        console.log('Notification settings:', settings);
        
        if (settings.authorizationStatus === 0) { // DENIED
          console.log('Notifications are denied, requesting permission...');
          const permission = await notifee.requestPermission();
          console.log('Permission result:', permission);
          
          if (permission.authorizationStatus === 0) {
            console.log('Permission denied, cannot show notification');
            return;
          }
        }
      }
      
      const channelId = await notifee.createChannel({
        id: 'mystere_app',
        name: 'mystere_app',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      
      console.log('Channel created:', channelId);
      console.log('onDisplayNotification', place);
      
      // Display a notification
      await notifee.displayNotification({
        id: place.id,
        title: `${place.name}`,
        body: "Vous êtes proche d'un lieu mystère, décourez le !",
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
        },
      });

      console.log('onDisplayNotification done');
    } catch (error) {
      console.log('Error in onDisplayNotification:', error);
      console.log('Error details:', error.message, error.stack);
    }
  }

  async subscribeBackgroundEvents() {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      if (pressAction.id === 'default') {
        await stockNotificationForLater(notification);

        getStockedNotificationForLater().then(stockedNotification => {
          if (stockedNotification) {
            refNavigate('SinglePlaceScreen', {
              name: notification.title,
              placeId: notification.id,
            });
          }
        });
      }
    });
  }

  async subscribeForgroundEvents() {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          refNavigate('SinglePlaceScreen', {
            name: detail.notification.title,
            placeId: detail.notification.id,
          });
          break;
      }
    });
  }

  navigateToTheNotifiedBackgroundPlace() {
    getStockedNotificationForLater().then(stockedNotification => {
      if (stockedNotification) {
        refNavigate('SinglePlaceScreen', {
          name: stockedNotification.title,
          placeId: stockedNotification.id,
        });
      }
    });
  }
}
