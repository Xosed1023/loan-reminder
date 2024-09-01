import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Splash from "./pages/Splash";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import Home from "./pages/Home";
import "./theme/variables.css";
import { PushNotifications } from "@capacitor/push-notifications";
import { useEffect } from "react";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    addListeners();
    registerPushNotifications();
    getDeliveredNotifications();
  }, []);

  const addListeners = async () => {
    await PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success, token: ", token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.log("Push registration error: ", err);
    });

    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log(
          "Push registration received: ",
          JSON.stringify(notification)
        );
      }
    );

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "Push registration action performed: ",
          JSON.stringify(notification)
        );
      }
    );
  };

  const registerPushNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    alert(JSON.stringify(permStatus));
    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      alert("User denied permisions");
    } else {
      try {
        await PushNotifications.register();
      } catch (error) {
        alert(JSON.stringify(error));
      }
    }
  };

  const getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    alert(JSON.stringify(notificationList));
  };

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" component={Splash} />
        <Route exact path="/home" component={Home} />
        <Redirect from="*" to="/"></Redirect>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
