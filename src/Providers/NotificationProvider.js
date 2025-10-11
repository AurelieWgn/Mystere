import React, {createContext, useContext, useState, useCallback, useEffect, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, PermissionsAndroid} from 'react-native';
import notifee from '@notifee/react-native';
import {checkPermissionAndStartTask, stopStask, backgroundTaskIsRunning} from '../Services/StasksSvc';

const NotificationContext = createContext(null);

/**
 * Contexte optimisé pour la gestion des notifications
 * - Cache en mémoire pour éviter les lectures AsyncStorage répétées
 * - Vérifications de permissions centralisées
 * - Gestion d'état réactive
 */
export const NotificationProvider = ({children}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasSeenNotificationAlert, setHasSeenNotificationAlert] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les préférences au démarrage (une seule fois)
  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = useCallback(async () => {
    try {
      const [notifStatus, seenAlert] = await Promise.all([
        AsyncStorage.getItem('notifications_status'),
        AsyncStorage.getItem('hasSeenNotificationIconAlert'),
      ]);

      setNotificationsEnabled(notifStatus ? JSON.parse(notifStatus) : false);
      setHasSeenNotificationAlert(seenAlert ? JSON.parse(seenAlert) : false);
      
      // Vérifier les permissions actuelles
      await checkCurrentPermissions();
    } catch (error) {
      console.error('[NotificationProvider] Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Vérification centralisée des permissions de notification
   */
  const checkCurrentPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setPermissionsGranted(true);
      return true;
    }

    try {
      // Android 13+ (API 33) - Permission POST_NOTIFICATIONS
      if (Platform.Version >= 33) {
        const hasPostNotifications = await PermissionsAndroid.check(
          'android.permission.POST_NOTIFICATIONS'
        );
        setPermissionsGranted(hasPostNotifications);
        return hasPostNotifications;
      }

      // Android 12+ - Vérifier avec notifee
      if (Platform.Version >= 31) {
        const settings = await notifee.getNotificationSettings();
        const granted = settings.authorizationStatus >= 1; // AUTHORIZED
        setPermissionsGranted(granted);
        return granted;
      }

      // Versions antérieures - toujours autorisé
      setPermissionsGranted(true);
      return true;
    } catch (error) {
      console.error('[NotificationProvider] Error checking permissions:', error);
      return false;
    }
  }, []);

  /**
   * Demander toutes les permissions nécessaires
   */
  const requestNotificationPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // 1. Permission POST_NOTIFICATIONS (Android 13+)
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
          {
            title: 'Autorisation des Notifications',
            message: 'Mystère a besoin de votre autorisation pour recevoir les notifications',
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('[NotificationProvider] POST_NOTIFICATIONS denied');
          return false;
        }
      }

      // 2. Vérifier avec notifee
      const settings = await notifee.requestPermission();
      const isGranted = settings.authorizationStatus >= 1;
      
      setPermissionsGranted(isGranted);
      return isGranted;
    } catch (error) {
      console.error('[NotificationProvider] Error requesting permissions:', error);
      return false;
    }
  }, []);

  /**
   * Activer les notifications
   */
  const enableNotifications = useCallback(async () => {
    try {
      // 1. Vérifier/Demander les permissions
      const hasPermissions = await requestNotificationPermissions();
      
      if (!hasPermissions) {
        console.log('[NotificationProvider] Permissions denied, cannot enable notifications');
        return false;
      }

      // 2. Activer le service en arrière-plan
      const isRunning = backgroundTaskIsRunning();
      if (!isRunning) {
        await checkPermissionAndStartTask();
      }

      // 3. Sauvegarder l'état
      await AsyncStorage.setItem('notifications_status', 'true');
      setNotificationsEnabled(true);

      console.log('[NotificationProvider] Notifications enabled successfully');
      return true;
    } catch (error) {
      console.error('[NotificationProvider] Error enabling notifications:', error);
      return false;
    }
  }, [requestNotificationPermissions]);

  /**
   * Désactiver les notifications
   */
  const disableNotifications = useCallback(async () => {
    try {
      // 1. Arrêter le service en arrière-plan
      await stopStask();

      // 2. Sauvegarder l'état
      await AsyncStorage.setItem('notifications_status', 'false');
      setNotificationsEnabled(false);

      console.log('[NotificationProvider] Notifications disabled successfully');
      return true;
    } catch (error) {
      console.error('[NotificationProvider] Error disabling notifications:', error);
      return false;
    }
  }, []);

  /**
   * Marquer l'alerte comme vue
   */
  const markAlertAsSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasSeenNotificationIconAlert', 'true');
      setHasSeenNotificationAlert(true);
    } catch (error) {
      console.error('[NotificationProvider] Error marking alert as seen:', error);
    }
  }, []);

  /**
   * Afficher l'alerte de notification
   */
  const shouldShowNotificationAlert = useMemo(() => {
    return !notificationsEnabled && !hasSeenNotificationAlert && !isLoading;
  }, [notificationsEnabled, hasSeenNotificationAlert, isLoading]);

  const value = useMemo(
    () => ({
      // État
      notificationsEnabled,
      hasSeenNotificationAlert,
      permissionsGranted,
      isLoading,
      shouldShowNotificationAlert,
      
      // Actions
      enableNotifications,
      disableNotifications,
      checkCurrentPermissions,
      requestNotificationPermissions,
      markAlertAsSeen,
      refreshPreferences: loadNotificationPreferences,
    }),
    [
      notificationsEnabled,
      hasSeenNotificationAlert,
      permissionsGranted,
      isLoading,
      shouldShowNotificationAlert,
      enableNotifications,
      disableNotifications,
      checkCurrentPermissions,
      requestNotificationPermissions,
      markAlertAsSeen,
      loadNotificationPreferences,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de notifications
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

