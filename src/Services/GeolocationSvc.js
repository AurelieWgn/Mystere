import Geolocation from 'react-native-geolocation-service';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

/**
 * Service de géolocalisation singleton optimisé
 * - Une seule instance partagée dans toute l'application
 * - Cache de la dernière position
 * - Gestion correcte des permissions Android selon versions
 * 
 * ⚠️ DÉPRÉCIÉ : Utiliser LocationProvider à la place
 * Ce service est maintenu pour compatibilité mais LocationProvider est préféré
 */
class GeolocationSvc {
  static instance = null;
  lastKnownLocation = null;

  constructor() {
    if (GeolocationSvc.instance) {
      return GeolocationSvc.instance;
    }
    GeolocationSvc.instance = this;
  }

  /**
   * Demander la permission de localisation en avant-plan
   * @returns {Promise<boolean>}
   */
  async askForGeolocationPermission() {
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, // Changé de COARSE à FINE
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const granted = await request(permission, {
        title: 'Autorisation de Localisation',
        message: 'Mystère a besoin de votre position pour vous montrer les lieux à proximité.',
        buttonPositive: 'Autoriser',
        buttonNegative: 'Refuser',
      });

      const result = granted === RESULTS.GRANTED;
      console.log('[GeolocationSvc] Foreground permission:', result ? 'GRANTED' : 'DENIED');
      return result;
    } catch (error) {
      console.error('[GeolocationSvc] Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Demander la permission de localisation en arrière-plan
   * ⚠️ Android 10+ : Doit être demandée APRÈS la permission foreground
   * @returns {Promise<boolean>}
   */
  async askForBGGeolocationPermission() {
    try {
      // Android 10+ uniquement
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const permission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION; // ✅ Corrigé

        const granted = await request(permission, {
          title: 'Autorisation Localisation en Arrière-Plan',
          message: "Mystère a besoin de votre position en arrière-plan pour vous notifier des lieux à proximité.",
          buttonPositive: 'Autoriser',
          buttonNegative: 'Refuser',
        });

        const result = granted === RESULTS.GRANTED;
        console.log('[GeolocationSvc] Background permission:', result ? 'GRANTED' : 'DENIED');
        return result;
      }

      // Versions antérieures : pas de permission séparée
      console.log('[GeolocationSvc] Background permission not needed for Android <10');
      return true;
    } catch (error) {
      console.error('[GeolocationSvc] Error requesting background permission:', error);
      return false;
    }
  }

  /**
   * Vérifier si la permission foreground est accordée
   * @returns {Promise<boolean>}
   */
  async checkForegroundPermission() {
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const status = await check(permission);
      return status === RESULTS.GRANTED;
    } catch (error) {
      console.error('[GeolocationSvc] Error checking permission:', error);
      return false;
    }
  }

  /**
   * Obtenir la position actuelle
   * @param {boolean} useCache - Utiliser la dernière position si disponible
   * @returns {Promise<{status: boolean, pos?: object, message?: string}>}
   */
  async getCurrentLocation(useCache = false) {
    // Retourner le cache si demandé et disponible
    if (useCache && this.lastKnownLocation) {
      console.log('[GeolocationSvc] Returning cached location');
      return {status: true, pos: this.lastKnownLocation};
    }

    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition(
          (data) => {
            const pos = {
              longitude: data.coords.longitude,
              latitude: data.coords.latitude,
              accuracy: data.coords.accuracy,
              timestamp: data.timestamp,
            };

            // Mettre en cache
            this.lastKnownLocation = pos;
            console.log('[GeolocationSvc] Location obtained:', pos);

            resolve({status: true, pos});
          },
          (error) => {
            console.error('[GeolocationSvc] Error:', error.code, error.message);
            resolve({
              status: false,
              message: `Impossible d'obtenir la position: ${error.message}`,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch (error) {
        console.error('[GeolocationSvc] Exception:', error);
        resolve({
          status: false,
          message: 'Erreur lors de la récupération de la position',
        });
      }
    });
  }

  /**
   * Alias pour compatibilité (ancienne méthode avec typo)
   * @deprecated Utiliser getCurrentLocation à la place
   */
  async getCurrantLocation(useCache = false) {
    console.warn('[GeolocationSvc] getCurrantLocation is deprecated, use getCurrentLocation');
    return this.getCurrentLocation(useCache);
  }

  /**
   * Effacer le cache de position
   */
  clearCache() {
    this.lastKnownLocation = null;
    console.log('[GeolocationSvc] Location cache cleared');
  }

  /**
   * Obtenir l'instance singleton
   */
  static getInstance() {
    if (!GeolocationSvc.instance) {
      GeolocationSvc.instance = new GeolocationSvc();
    }
    return GeolocationSvc.instance;
  }
}

// Exporter l'instance singleton par défaut
export default GeolocationSvc.getInstance();
