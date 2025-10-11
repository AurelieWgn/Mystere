serveur : npx react-native start
npx react-native run-android


## Generate APK : 

- Before create the first APK you need to create a keyStore :
   -  Follow Step 1 and step 2 : https://instamobile.io/android-development/generate-react-native-release-build-android/

- To generate APK :
- Go to android folder :  `cd android` 
- run : `./gradlew assembleRelease`
- find the APK file in : /android/app/build/outputs/apk/release/app-release.apk

OR To generate Aab

- Go to android folder :  `cd android` 
- run :  `./gradlew bundleRelease`
- Find the Aab file in : 



// node 18 : nvm use 18
// Java 17 : export JAVA_HOME=`/usr/libexec/java_home -v 17`

# Utils

Run server : npx react-native start --reset-cache

Clean : cd android && ./gradlew clean && cd ..
Run app :  npx react-native run-android   