import React, {createContext, useContext, useState, useCallback, useEffect, useMemo} from 'react';
import {Platform, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const LocationContext = createContext(null);

/**
 * Contexte optimisé pour la gestion de la géolocalisation
 * - Cache de la position en mémoire
 * - Gestion des permissions selon les versions Android
 * - Une seule source de vérité
 * 
 * Règles Android :
 * - Android 10+ (API 29) : ACCESS_BACKGROUND_LOCATION doit être demandée séparément
 * - Android 12+ (API 31) : Doit montrer une justification pour ACCESS_BACKGROUND_LOCATION
 * - Android 13+ : Même comportement qu'Android 12
 */
export const LocationProvider = ({children}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [foregroundPermissionGranted, setForegroundPermissionGranted] = useState(false);
  const [backgroundPermissionGranted, setBackgroundPermissionGranted] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Nouveau : éviter race condition

  /**
   * Obtenir les bonnes permissions selon la plateforme
   */
  const getLocationPermissions = useCallback(() => {
    if (Platform.OS === 'android') {
      return {
        foreground: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        coarse: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        background: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      };
    }
    // iOS (pour futur support)
    return {
      foreground: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      background: PERMISSIONS.IOS.LOCATION_ALWAYS,
    };
  }, []);

  /**
   * Vérifier toutes les permissions actuelles
   */
  const checkAllPermissions = useCallback(async () => {
    try {
      const permissions = getLocationPermissions();

      // Vérifier permission en avant-plan (foreground)
      const fineLocationStatus = await check(permissions.foreground);
      const hasForeground = fineLocationStatus === RESULTS.GRANTED;
      setForegroundPermissionGranted(hasForeground);

      // Vérifier permission en arrière-plan (background) - Android 10+ uniquement
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const bgLocationStatus = await check(permissions.background);
        const hasBackground = bgLocationStatus === RESULTS.GRANTED;
        setBackgroundPermissionGranted(hasBackground);
      } else {
        // Versions antérieures : pas de permission séparée
        setBackgroundPermissionGranted(hasForeground);
      }

      console.log('[LocationProvider] Permissions:', {
        foreground: hasForeground,
        background: backgroundPermissionGranted,
      });

      return {foreground: hasForeground, background: backgroundPermissionGranted};
    } catch (error) {
      console.error('[LocationProvider] Error checking permissions:', error);
      return {foreground: false, background: false};
    }
  }, [getLocationPermissions, backgroundPermissionGranted]);

  /**
   * Demander la permission de localisation en avant-plan (foreground)
   * Cette permission est TOUJOURS demandée en premier
   */
  const requestForegroundPermission = useCallback(async () => {
    try {
      const permissions = getLocationPermissions();

      // Demander ACCESS_FINE_LOCATION
      const result = await request(permissions.foreground, {
        title: 'Autorisation de Localisation',
        message: 'Mystère a besoin de votre position pour vous montrer les lieux à proximité.',
        buttonPositive: 'Autoriser',
        buttonNegative: 'Refuser',
      });

      const granted = result === RESULTS.GRANTED;
      setForegroundPermissionGranted(granted);

      console.log('[LocationProvider] Foreground permission:', granted ? 'GRANTED' : 'DENIED');

      return granted;
    } catch (error) {
      console.error('[LocationProvider] Error requesting foreground permission:', error);
      return false;
    }
  }, [getLocationPermissions]);

  /**
   * Demander la permission de localisation en arrière-plan (background)
   * 
   * IMPORTANT (Android 10+) :
   * - Doit être demandée APRÈS la permission foreground
   * - Doit montrer une justification claire à l'utilisateur
   * - Android 12+ : Système affiche automatiquement une justification
   */
  const requestBackgroundPermission = useCallback(async () => {
    try {
      // Vérifier d'abord la permission foreground
      if (!foregroundPermissionGranted) {
        console.warn('[LocationProvider] Foreground permission not granted. Request it first.');
        return false;
      }

      // Android 10+ uniquement
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const permissions = getLocationPermissions();

        // Android 12+ : Afficher une alerte explicative AVANT la demande système
        if (Platform.Version >= 31) {
          return new Promise((resolve) => {
            Alert.alert(
              'Autorisation Localisation en Arrière-Plan',
              "Pour recevoir des notifications lorsque vous passez près d'un lieu mystère, l'application a besoin d'accéder à votre position en arrière-plan.\n\nDans l'écran suivant, choisissez 'Autoriser tout le temps'.",
              [
                {
                  text: 'Plus tard',
                  style: 'cancel',
                  onPress: () => resolve(false),
                },
                {
                  text: 'Continuer',
                  onPress: async () => {
                    const result = await request(permissions.background);
                    const granted = result === RESULTS.GRANTED;
                    setBackgroundPermissionGranted(granted);
                    console.log('[LocationProvider] Background permission (Android 12+):', granted ? 'GRANTED' : 'DENIED');
                    resolve(granted);
                  },
                },
              ],
            );
          });
        }

        // Android 10-11 : Demande directe
        const result = await request(permissions.background, {
          title: 'Autorisation Localisation en Arrière-Plan',
          message: "Mystère a besoin de votre position en arrière-plan pour vous notifier des lieux à proximité.",
          buttonPositive: 'Autoriser',
          buttonNegative: 'Refuser',
        });

        const granted = result === RESULTS.GRANTED;
        setBackgroundPermissionGranted(granted);

        console.log('[LocationProvider] Background permission (Android 10-11):', granted ? 'GRANTED' : 'DENIED');

        return granted;
      }

      // Versions antérieures : pas de permission séparée
      console.log('[LocationProvider] Background permission not needed for Android <10');
      setBackgroundPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('[LocationProvider] Error requesting background permission:', error);
      return false;
    }
  }, [foregroundPermissionGranted, getLocationPermissions]);

  /**
   * Demander toutes les permissions nécessaires (foreground puis background si nécessaire)
   */
  const requestAllLocationPermissions = useCallback(async (includeBackground = false) => {
    try {
      // 1. Toujours demander foreground en premier
      const foregroundGranted = await requestForegroundPermission();

      if (!foregroundGranted) {
        console.log('[LocationProvider] Foreground permission denied, stopping here');
        return {foreground: false, background: false};
      }

      // 2. Si demandé, demander background (Android 10+ uniquement)
      let backgroundGranted = false;
      if (includeBackground) {
        backgroundGranted = await requestBackgroundPermission();
      } else {
        // Si pas demandé, considérer comme accordé pour compatibilité
        backgroundGranted = Platform.OS === 'android' && Platform.Version >= 29 
          ? backgroundPermissionGranted 
          : true;
      }

      return {foreground: foregroundGranted, background: backgroundGranted};
    } catch (error) {
      console.error('[LocationProvider] Error requesting permissions:', error);
      return {foreground: false, background: false};
    }
  }, [requestForegroundPermission, requestBackgroundPermission, backgroundPermissionGranted]);

  /**
   * Obtenir la position actuelle
   */
  const getCurrentLocation = useCallback(async (forceRefresh = false) => {
    // ✅ Attendre l'initialisation pour éviter race condition
    if (!isInitialized) {
      console.warn('[LocationProvider] Waiting for initialization...');
      // Attendre un peu que l'initialisation se termine
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Si toujours pas initialisé après 100ms, continuer quand même
      if (!isInitialized) {
        console.warn('[LocationProvider] Initialization timeout, continuing anyway');
      }
    }

    // Retourner le cache si disponible et pas de rafraîchissement forcé
    if (userLocation && !forceRefresh) {
      console.log('[LocationProvider] Returning cached location');
      return userLocation;
    }

    // Vérifier les permissions
    if (!foregroundPermissionGranted) {
      console.log('[LocationProvider] No permission, requesting...');
      const granted = await requestForegroundPermission();
      if (!granted) {
        const error = 'Location permission not granted';
        setLocationError(error);
        console.error('[LocationProvider]', error);
        return null;
      }
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          console.log('[LocationProvider] Location obtained:', location);
          setUserLocation(location);
          setIsLoadingLocation(false);
          resolve(location);
        },
        (error) => {
          const errorMsg = `Error getting location: ${error.message}`;
          console.error('[LocationProvider]', errorMsg, error);
          setLocationError(errorMsg);
          setIsLoadingLocation(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }, [userLocation, foregroundPermissionGranted, requestForegroundPermission, isInitialized]);

  /**
   * Mettre à jour la position (appelé par le contexte App ou autres composants)
   */
  const updateUserLocation = useCallback((location) => {
    if (location && location.latitude && location.longitude) {
      setUserLocation(location);
      console.log('[LocationProvider] Location updated manually:', location);
    }
  }, []);

  /**
   * Effacer le cache de position
   */
  const clearLocationCache = useCallback(() => {
    setUserLocation(null);
    console.log('[LocationProvider] Location cache cleared');
  }, []);

  /**
   * Obtenir un résumé de l'état des permissions
   */
  const getPermissionStatus = useCallback(() => {
    return {
      foreground: foregroundPermissionGranted,
      background: backgroundPermissionGranted,
      needsBackgroundForNotifications: Platform.OS === 'android' && Platform.Version >= 29,
    };
  }, [foregroundPermissionGranted, backgroundPermissionGranted]);

  // ✅ Charger les permissions au démarrage (après la définition de checkAllPermissions)
  useEffect(() => {
    const initPermissions = async () => {
      await checkAllPermissions();
      setIsInitialized(true);
      console.log('[LocationProvider] Initialized');
    };
    initPermissions();
  }, [checkAllPermissions]);

  const value = useMemo(
    () => ({
      // État
      userLocation,
      foregroundPermissionGranted,
      backgroundPermissionGranted,
      isLoadingLocation,
      locationError,
      isInitialized, // ✅ Exposer l'état d'initialisation
      
      // Actions
      getCurrentLocation,
      updateUserLocation,
      clearLocationCache,
      checkAllPermissions,
      requestForegroundPermission,
      requestBackgroundPermission,
      requestAllLocationPermissions,
      getPermissionStatus,
    }),
    [
      userLocation,
      foregroundPermissionGranted,
      backgroundPermissionGranted,
      isLoadingLocation,
      locationError,
      isInitialized,
      getCurrentLocation,
      updateUserLocation,
      clearLocationCache,
      checkAllPermissions,
      requestForegroundPermission,
      requestBackgroundPermission,
      requestAllLocationPermissions,
      getPermissionStatus,
    ]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de localisation
 */
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};

