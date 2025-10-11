import BackgroundService from 'react-native-background-actions';
import {locationAndNotificationTask} from '../tasks/CheckLocation';
import {NativeModules, Platform, PermissionsAndroid} from 'react-native';

const {AlarmModule} = NativeModules;

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const notificationsTask = async taskDataArguments => {
  try {
    const {delay} = taskDataArguments;
    
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        try {
          await locationAndNotificationTask();
        } catch (error) {
          console.log('Error in locationAndNotificationTask iteration', i, ':', error);
        }
        await sleep(delay);
      }
      
      resolve();
    });
  } catch (error) {
    console.log('Error in notificationsTask:', error);
  }
};

const options = {
  taskName: 'Notifications',
  taskTitle: 'Mystère Information',
  taskDesc: 'Les notifications sont actives',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'mystery://',
  parameters: {
    delay: 900000, // 15min
  },
};

const checkPermissionAndStartTask = async () => {
  if (Platform.OS === 'android') {
    try {
      // Check permission for Android 13+
      if (Platform.Version >= 33) {
        const hasNotificationPermission = await PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS');
        console.log('Has notification permission:', hasNotificationPermission);
        
        if (!hasNotificationPermission) {
          const granted = await PermissionsAndroid.request(
            'android.permission.POST_NOTIFICATIONS',
            {
              title: 'Autorisation des Notifications',
              message: 'Mystère a besoin de votre autorisation pour recevoir les notifications',
              buttonNeutral: 'Plus tard',
              buttonNegative: 'Annuler',
              buttonPositive: 'OK',
            },
          );
          console.log('Notification permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED);
          
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission denied, cannot start background task');
            return;
          }
        }
      }
    } catch (err) {
      console.log('Notification permission error:', err);
    }
  }

  // Check if the platform is Android and the version is >= 31
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    console.log('Platform.OS === android && Platform.Version >= 31');
    try {
      const hasPermission = await AlarmModule.hasScheduleExactAlarmPermission();
      if (!hasPermission) {
        const permissionGranted = await AlarmModule.requestPermission();
        if (permissionGranted) {
          startTask();
        } else {
          console.log('Permission refusée');
        }
      } else {
        startTask();
      }
      console.log('try  done');
    } catch (error) {
      console.error(error);
    }
  } else if (Platform.OS === 'android' && Platform.Version < 31) {
    console.log('Platform.OS === android && Platform.Version < 31');
    // Start the task directly for Android versions < 31
    startTask();
  }
};

const startTask = async () => {
  try {
    await BackgroundService.start(notificationsTask, options);
    console.log('BackgroundService.start completed successfully');
  } catch (error) {
    console.log('start BG stask err', error);
  }
};

const stopStask = async () => {
  await BackgroundService.stop();
};

const backgroundTaskIsRunning = () => {
  return BackgroundService.isRunning();
};



export {checkPermissionAndStartTask, stopStask, backgroundTaskIsRunning};
