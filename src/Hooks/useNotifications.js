import {createContext, useContext} from 'react';
import NotificationSvc from '../Services/NotificationSvc';

const notifServiceInstance = new NotificationSvc();
const NotifServiceContext = createContext(notifServiceInstance);

export const useNotifService = () => useContext(NotifServiceContext);
