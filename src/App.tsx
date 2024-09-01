import {
  IonApp,
  IonButton,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Splash from './pages/Splash';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import Home from './pages/Home';
import './theme/variables.css';
import { useEffect, useState } from 'react';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Toast } from "@capacitor/toast";

setupIonicReact();

const App: React.FC = () => {
  const nullEntry: any[] = []
  const [notifications, setnotifications] = useState(nullEntry);

  useEffect(() => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== 'granted') {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === 'denied') {
            showToast('Push Notification permission denied');
          }
          else {
            showToast('Push Notification permission granted');
            register();
          }
        });
      }
      else {
        register();
      }
    });


  }, []);

  const register = () => {
    console.log('Initializing HomePage');

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success', token);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
      }
    );
  }

  const showToast = async (msg: string) => {
    await Toast.show({
      text: msg
    })
  }

  return (
    <IonApp>
      <IonButton color="success" expand="full" onClick={register}>Register for Push</IonButton>
      <IonReactRouter>
        <Route exact path="/" component={Splash} />
        <Route exact path="/home" component={Home} />
        <Redirect from='*' to='/'></Redirect>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
