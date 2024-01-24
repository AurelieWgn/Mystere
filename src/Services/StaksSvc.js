import BackgroundService from 'react-native-background-actions';
import {locationAndNotificationTask} from '../../src/tasks/CheckLocation';
const {AlarmModule} = NativeModules;
import {NativeModules, Platform, PermissionsAndroid} from 'react-native';

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
      PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS')
        .then(response => {
          if (!response) {
            PermissionsAndroid.request(
              'android.permission.POST_NOTIFICATIONS',
              {
                title: 'Respetion des Notifications',
                message:
                  'Mystère a besoin de votre autorisation pour recevoir les notifications',

                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
          }
        })
        .catch(err => {
          console.log('Notification Error=====>', err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  console.log('checkPermissionAndStartTask');
  // Vérifier si la plateforme est Android et la version est >= 31
  if (Platform.OS === 'android' && Platform.Version >= 31) {
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
    } catch (error) {
      console.error(error);
      // Gérer les erreurs potentielles
    }
  } else if (Platform.OS === 'android' && Platform.Version < 31) {
    // Pour les versions Android < 31, démarrer la tâche directement
    startTask();
  }
};

const startTask = async () => {
  try {
    await BackgroundService.start(notificationsTask, options);
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

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const notificationsTask = async taskDataArguments => {
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      locationAndNotificationTask();
      await sleep(delay);
    }
  });
};

export {checkPermissionAndStartTask, stopStask, backgroundTaskIsRunning};
