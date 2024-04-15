import {refNavigate} from './RefNavigationSvc';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {
  getStockedNotificationForLater,
  stockNotificationForLater,
} from '../Utiles';

export default class NotificationSvc {
  async onDisplayNotification(place) {
    const channelId = await notifee.createChannel({
      id: 'mystere_app',
      name: 'mystere_app',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      id: place.id,
      title: `${place.name}`,
      body: "Vous êtes proche d'un lieu mystère, décourez le !",
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
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
