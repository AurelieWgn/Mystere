import { createNavigationContainerRef, useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { refNavigate } from "./RefNavigationService";
class PushNotificationSvc {
  
  constructor() {
    
    PushNotification.configure({
    
      onRegister: function () {
        // console.log('TOKEN:', token);
      },
      // not called if app is killed.
      onNotification: function (notification) {
        refNavigate('SinglePlaceScreen', { name: notification.data.name, placeId: notification.data.id });
      },
      popInitialNotification: false,
      // requestPermissions: true,
      requestPermissions: Platform.OS === 'ios'
     
    });

    PushNotification.createChannel(
      {
        channelId: 'mystere_app', // (required)
        channelName: 'Mystere_notifications', // (required)
        // channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  schduleNotification(place) {
    PushNotification.localNotificationSchedule({
      channelId: 'mystere_app',
      title: `${place.name}`,
      message: "Vous êtes proche d'un lieu mystère, décourez le !",
      date: new Date,
      data: place
    });
  }
}

export default new PushNotificationSvc();