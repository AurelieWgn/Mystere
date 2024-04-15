/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AppProvider} from './src/Providers/AppProvider';
import {useNotifService} from './src/Hooks/useNotifications';

export default function Main() {
  const notifSvc = useNotifService();
  notifSvc.subscribeBackgroundEvents();

  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
