# 🔄 Guide de Migration - Système de Notifications Optimisé

## 🎯 Vue d'Ensemble

Ce guide vous aide à comprendre les changements apportés au système de notifications et comment utiliser la nouvelle API.

---

## ⚙️ Modifications Automatiques Déjà Appliquées

Les fichiers suivants ont été **automatiquement mis à jour** :

✅ `src/Providers/NotificationProvider.js` - **NOUVEAU**  
✅ `src/Providers/AppProvider.js` - Intégration du NotificationProvider  
✅ `src/Services/NotificationSvc.js` - Refactorisé en singleton  
✅ `src/Hooks/useNotifications.js` - Utilise le singleton  
✅ `src/Screens/HomeScreen.js` - Utilise le contexte optimisé  
✅ `src/Screens/MenuScreen.js` - Utilise le contexte optimisé  
✅ `src/tasks/CheckLocation.js` - Utilise le singleton  
✅ `App.js` - Dépendances useEffect corrigées  

---

## 📦 Changements d'API

### **1. Gestion de l'État des Notifications**

#### ❌ **AVANT** (À ne plus faire)
```javascript
// ❌ Lectures directes d'AsyncStorage
const status = await AsyncStorage.getItem('notifications_status');
const seenAlert = await AsyncStorage.getItem('hasSeenNotificationIconAlert');
setIsEnabled(JSON.parse(status));

// ❌ Gestion manuelle de l'état
const [isEnabled, setIsEnabled] = useState(false);
const [displayAlert, setDisplayAlert] = useState(false);
```

#### ✅ **APRÈS** (Nouvelle façon)
```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const {
  notificationsEnabled,      // Remplace isEnabled
  shouldShowNotificationAlert, // Remplace displayAlert
  markAlertAsSeen,
} = useNotificationContext();

// Plus de useState, plus d'AsyncStorage manuel !
```

---

### **2. Activation/Désactivation des Notifications**

#### ❌ **AVANT**
```javascript
// ❌ Logique dispersée et complexe
const toggleSwitch = async () => {
  await AsyncStorage.setItem('notifications_status', 'true');
  if (backgroundTaskIsRunning()) {
    // ...
  } else {
    await checkPermissionAndStartTask();
  }
};
```

#### ✅ **APRÈS**
```javascript
const {enableNotifications, disableNotifications} = useNotificationContext();

const toggleSwitch = async () => {
  if (!notificationsEnabled) {
    const success = await enableNotifications();
    if (!success) {
      // Gérer l'erreur
    }
  } else {
    await disableNotifications();
  }
};
```

---

### **3. Utilisation de NotificationSvc**

#### ❌ **AVANT**
```javascript
// ❌ Créait une nouvelle instance
import NotificationSvc from '../Services/NotificationSvc';
const notifSvc = new NotificationSvc();
await notifSvc.onDisplayNotification(place);
```

#### ✅ **APRÈS**
```javascript
// ✅ Utilise l'instance singleton exportée
import NotificationSvc from '../Services/NotificationSvc';
await NotificationSvc.onDisplayNotification(place);

// Ou via le hook (déjà configuré)
import {useNotifService} from '../Hooks/useNotifications';
const notifSvc = useNotifService();
await notifSvc.onDisplayNotification(place);
```

---

## 🔍 Cas d'Usage Courants

### **1. Afficher/Cacher un Bouton Basé sur les Notifications**

```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const MyComponent = () => {
  const {shouldShowNotificationAlert} = useNotificationContext();

  return (
    <View>
      {shouldShowNotificationAlert && (
        <NotificationPromptButton />
      )}
    </View>
  );
};
```

---

### **2. Créer un Toggle de Notifications**

```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const SettingsScreen = () => {
  const {
    notificationsEnabled,
    enableNotifications,
    disableNotifications,
  } = useNotificationContext();

  const handleToggle = async () => {
    if (notificationsEnabled) {
      await disableNotifications();
    } else {
      const success = await enableNotifications();
      if (!success) {
        Alert.alert('Erreur', 'Impossible d\'activer les notifications');
      }
    }
  };

  return (
    <Switch
      value={notificationsEnabled}
      onValueChange={handleToggle}
    />
  );
};
```

---

### **3. Vérifier les Permissions**

```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const MyComponent = () => {
  const {
    permissionsGranted,
    checkCurrentPermissions,
    requestNotificationPermissions,
  } = useNotificationContext();

  const handleCheckPermissions = async () => {
    const granted = await checkCurrentPermissions();
    
    if (!granted) {
      const success = await requestNotificationPermissions();
      if (success) {
        console.log('Permissions accordées !');
      }
    }
  };

  return (
    <View>
      <Text>Permissions: {permissionsGranted ? 'OK' : 'Manquantes'}</Text>
      <Button title="Vérifier" onPress={handleCheckPermissions} />
    </View>
  );
};
```

---

### **4. Envoyer une Notification**

```javascript
import NotificationSvc from '../Services/NotificationSvc';

const sendNotification = async (place) => {
  const success = await NotificationSvc.onDisplayNotification({
    id: place.id,
    name: place.name,
    coords: place.coords,
  });

  if (success) {
    console.log('Notification envoyée !');
  } else {
    console.error('Échec de l\'envoi');
  }
};
```

---

### **5. Marquer l'Alerte Comme Vue**

```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const NotificationPrompt = () => {
  const {markAlertAsSeen} = useNotificationContext();

  const handleDismiss = async () => {
    await markAlertAsSeen();
    // L'alerte ne s'affichera plus
  };

  return (
    <View>
      <Text>Activez les notifications !</Text>
      <Button title="Plus tard" onPress={handleDismiss} />
    </View>
  );
};
```

---

## 🎯 API Complète du NotificationContext

```typescript
interface NotificationContextValue {
  // 📊 État (lecture seule)
  notificationsEnabled: boolean;      // Les notifications sont activées
  hasSeenNotificationAlert: boolean;  // L'utilisateur a vu l'alerte
  permissionsGranted: boolean;        // Les permissions sont accordées
  isLoading: boolean;                 // Chargement en cours
  shouldShowNotificationAlert: boolean; // Doit afficher l'alerte

  // 🎬 Actions (fonctions)
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<boolean>;
  checkCurrentPermissions: () => Promise<boolean>;
  requestNotificationPermissions: () => Promise<boolean>;
  markAlertAsSeen: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}
```

---

## ⚠️ Pièges à Éviter

### ❌ **Ne pas faire :**

1. **Créer de nouvelles instances de NotificationSvc**
```javascript
// ❌ MAUVAIS
const notifSvc = new NotificationSvc();
```

2. **Lire directement AsyncStorage pour les notifications**
```javascript
// ❌ MAUVAIS
const status = await AsyncStorage.getItem('notifications_status');
```

3. **Gérer l'état des notifications localement**
```javascript
// ❌ MAUVAIS
const [notifEnabled, setNotifEnabled] = useState(false);
```

4. **Oublier de vérifier le retour des fonctions async**
```javascript
// ❌ MAUVAIS
await enableNotifications(); // Peut échouer !

// ✅ BON
const success = await enableNotifications();
if (!success) {
  // Gérer l'erreur
}
```

---

## 🧪 Tests

### **Tester si les notifications sont activées**
```javascript
import {useNotificationContext} from '../Providers/NotificationProvider';

const TestComponent = () => {
  const {notificationsEnabled, isLoading} = useNotificationContext();

  if (isLoading) return <Loading />;
  
  return (
    <Text>
      Notifications: {notificationsEnabled ? 'ON' : 'OFF'}
    </Text>
  );
};
```

### **Tester l'activation des notifications**
```javascript
const TestActivation = () => {
  const {enableNotifications} = useNotificationContext();

  const test = async () => {
    console.log('Test activation...');
    const success = await enableNotifications();
    console.log('Résultat:', success ? 'OK' : 'ÉCHEC');
  };

  return <Button title="Test" onPress={test} />;
};
```

---

## 📝 Checklist de Migration

Si vous ajoutez un nouveau composant qui utilise les notifications :

- [ ] Importer `useNotificationContext`
- [ ] Extraire les propriétés nécessaires
- [ ] Utiliser `notificationsEnabled` au lieu d'un état local
- [ ] Utiliser `enableNotifications/disableNotifications` au lieu de logique custom
- [ ] Vérifier le retour des fonctions async
- [ ] Ne pas lire AsyncStorage directement
- [ ] Ne pas créer de nouvelles instances de NotificationSvc

---

## 🔧 Dépannage

### **Problème : Les notifications ne s'activent pas**

1. Vérifier les permissions :
```javascript
const {permissionsGranted, checkCurrentPermissions} = useNotificationContext();
await checkCurrentPermissions();
console.log('Permissions:', permissionsGranted);
```

2. Vérifier les logs :
- Rechercher `[NotificationProvider]` dans les logs
- Rechercher `[NotificationSvc]` dans les logs

3. Vérifier AsyncStorage :
```javascript
const status = await AsyncStorage.getItem('notifications_status');
console.log('Status AsyncStorage:', status);
```

---

### **Problème : L'alerte de notification s'affiche en boucle**

Vérifier que `markAlertAsSeen` est bien appelé :
```javascript
const {markAlertAsSeen} = useNotificationContext();

const handleDismiss = async () => {
  await markAlertAsSeen(); // ✅ Important !
};
```

---

### **Problème : Le singleton ne fonctionne pas**

S'assurer d'utiliser l'instance exportée :
```javascript
// ✅ BON
import NotificationSvc from '../Services/NotificationSvc';
NotificationSvc.onDisplayNotification(place);

// ❌ MAUVAIS
import NotificationSvc from '../Services/NotificationSvc';
const svc = new NotificationSvc();
svc.onDisplayNotification(place);
```

---

## 📚 Ressources

- **Documentation NotificationProvider :** `src/Providers/NotificationProvider.js`
- **Documentation NotificationSvc :** `src/Services/NotificationSvc.js`
- **Exemple d'utilisation :** `src/Screens/MenuScreen.js`
- **Guide d'optimisation complet :** `NOTIFICATIONS_OPTIMISATION.md`

---

## 🎉 Conclusion

Le nouveau système de notifications est :
- ✅ Plus performant
- ✅ Plus simple à utiliser
- ✅ Plus facile à maintenir
- ✅ Mieux testé

Toutes les modifications nécessaires ont déjà été appliquées automatiquement. Vous n'avez rien à faire pour les écrans existants !

Pour tout nouveau composant, suivez simplement les exemples ci-dessus.

---

**Questions ? Consultez le code source ou les logs de debug !**

