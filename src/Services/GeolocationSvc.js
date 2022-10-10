
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {AppContext} from '../Providers/AppProvider';


export default class GeolocationSvc {

    
    //Return boolean
    async askForGeolocationPermission(){
        const granted = await request(
     
            Platform.select({
              android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            }),
            {
              title: 'Mystere !',
              message: 'Mystere a besoin de votre position pour fonctionner entierement.',
            },
          );
        
          return granted === RESULTS.GRANTED ? true : false;
    };

     async askForBGGeolocationPermission(){
        const granted = await request(
     
            Platform.select({
              android: PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            }),
            {
              title: 'Mystere !',
              message: 'Mystere a besoin de votre position pour fonctionner entierement.',
            },
          );
        
          return granted === RESULTS.GRANTED ? true : false;
    };


    async getCurrantLocation (){
      try {
      
        Geolocation.getCurrentPosition(
          (data) => {
            pos = {longitude: data.coords.longitude, latitude: data.coords.latitude};
            return { status: true, pos};
     
          },
          (error) => {
            // See error code charts below.
            console.log('GeolocationSvc message',  error.code, error.message);
          },
          { enableHighAccuracy: true}
        )

      } catch (error) {

        console.log("GeoLocSvc getCurrentLatLong::catcherror =>", error);
        return { status: false, message: "[MapSvc] Can not get position" };
  
    };
  }

}