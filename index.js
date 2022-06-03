/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AppProvider} from "./src/Providers/AppProvider";

export default function Main(){
    return (
        <AppProvider>
            <App/>
        </AppProvider>
    )
  
}

AppRegistry.registerComponent(appName, () => Main);
