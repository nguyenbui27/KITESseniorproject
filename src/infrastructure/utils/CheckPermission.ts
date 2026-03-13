   import { Platform } from 'react-native';
   import { PERMISSIONS, request } from 'react-native-permissions';

   function requestPhotoLibraryPermission(
       onSuccessCallback: () => void,
       onDenyCallback: (arg0: string) => void,
   ) {
       if (Platform.OS.toLocaleLowerCase() === 'ios') {
           request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(permission => {
               if (permission === 'granted') {
                   onSuccessCallback();
               } else {
                   onDenyCallback(permission);
               }
           });
       } else {
           request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(permission => {
               if (permission === 'granted') {
                   onSuccessCallback();
               } else {
                   onDenyCallback(permission);
               }
           });
       }
   }

   function hasCameraCaptureAndSave(
       onSuccessCallback: () => void,
       onDenyCallback: (arg0: string) => void,
   ) {
       if (Platform.OS.toLocaleLowerCase() === 'ios') {
           request(PERMISSIONS.IOS.CAMERA).then(permission => {
               if (permission === 'granted') {
                   onSuccessCallback();
               } else {
                   onDenyCallback(permission);
               }
           });
       } else {
           request(PERMISSIONS.ANDROID.CAMERA).then(permission => {
               if (permission === 'granted') {
                   onSuccessCallback();
               } else {
                   onDenyCallback(permission);
               }
           });
       }
   }

   export default {
       requestPhotoLibraryPermission,
       hasCameraCaptureAndSave,
   };