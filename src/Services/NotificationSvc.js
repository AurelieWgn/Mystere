import PushNotification from "react-native-push-notification";
class PushNotificationSvc {
  constructor() {
    PushNotification.configure({
    
      onRegister: function () {
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
       
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
    });
  }
}

export default new PushNotificationSvc();