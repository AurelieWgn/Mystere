import {refNavigate} from './RefNavigationSvc';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import {
  getStockedNotificationForLater,
  stockNotificationForLater,
} from '../Utiles';

/**
 * Service de notifications singleton optimisé
 * - Une seule instance partagée dans toute l'application
 * - Gestion simplifiée des permissions
 * - Canal de notification créé une seule fois
 */
class NotificationSvc {
  static instance = null;
  channelId = null;

  constructor() {
    if (NotificationSvc.instance) {
      return NotificationSvc.instance;
    }
    NotificationSvc.instance = this;
    this.initializeChannel();
  }

  /**
   * Initialiser le canal de notification (une seule fois)
   */
  async initializeChannel() {
    if (this.channelId) return this.channelId;

    try {
      this.channelId = await notifee.createChannel({
        id: 'mystere_app',
        name: 'mystere_app',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      console.log('[NotificationSvc] Channel created:', this.channelId);
      return this.channelId;
    } catch (error) {
      console.error('[NotificationSvc] Error creating channel:', error);
      return null;
    }
  }
  /**
   * Afficher une notification pour un lieu
   * Les permissions doivent déjà être accordées (gérées par NotificationProvider)
   */
  async onDisplayNotification(place) {
    try {
      console.log('[NotificationSvc] Displaying notification for:', place.name);
      
      // S'assurer que le canal est créé
      const channelId = await this.initializeChannel();
      if (!channelId) {
        console.error('[NotificationSvc] No channel available');
        return false;
      }
      
      // Vérifier rapidement les permissions
      const settings = await notifee.getNotificationSettings();
      if (settings.authorizationStatus === 0) {
        console.warn('[NotificationSvc] Notifications not authorized');
        return false;
      }
      
      // Afficher la notification
      await notifee.displayNotification({
        id: place.id.toString(),
        title: place.name,
        body: "Vous êtes proche d'un lieu mystère, découvrez-le !",
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

      console.log('[NotificationSvc] Notification displayed successfully');
      return true;
    } catch (error) {
      console.error('[NotificationSvc] Error displaying notification:', error);
      return false;
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

  /**
   * Obtenir l'instance singleton
   */
  static getInstance() {
    if (!NotificationSvc.instance) {
      NotificationSvc.instance = new NotificationSvc();
    }
    return NotificationSvc.instance;
  }
}

// Exporter l'instance singleton par défaut
export default NotificationSvc.getInstance();
