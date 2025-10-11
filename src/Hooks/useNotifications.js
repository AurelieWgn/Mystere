import {createContext, useContext} from 'react';
import NotificationSvc from '../Services/NotificationSvc';

// Utiliser l'instance singleton exportée
const NotifServiceContext = createContext(NotificationSvc);

export const useNotifService = () => useContext(NotifServiceContext);
