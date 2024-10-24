import {
  AdMob,
  AdOptions,
  InterstitialAdPluginEvents,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { walletOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router";
import { Loan } from "../models/Loan";
import { IndexedDBService } from "../persistence/IndexedDBService";
import Loans from "./Loans";

const Home: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const db = IndexedDBService.getInstance();
  const [isAdVisible, setIsAdVisible] = useState(true);

  const fetchLoans = async (from: string = "No identificado") => {
    try {
      const loans = await db.getAllLoans();
      sortLoans(loans);
      setLoans(loans);
    } catch (error) {
      console.error(`Error consultando préstamo ${error}`);
      setLoans([]);
    }
  };

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ["TESTDEVICE"],
        initializeForTesting: true,
      });
      // console.log("AdMob inicializado");
    } catch (error) {
      console.error("Error al inicializar AdMob", error);
    }
  };

  useEffect(() => {
    if (!isAdVisible) {
      setTimeout(() => {
        showAdMobInterstitial();
      }, 60000);
    } else {
    }
  }, [isAdVisible]);

  useEffect(() => {
    initializeAdMob();
    setIsAdVisible(false);

    db.openDatabase()
      .then(() => {
        fetchLoans("Effect de inicio");
      })
      .catch((error) => {
        console.error(`Error al abrir la base de datos ${error}`);
        setLoans([]);
      });
  }, []);

  const sortLoans = (loans: Loan[]) => {
    loans.sort((a, b) => {
      if (a.payDate < b.payDate) {
        return -1;
      }
      if (a.payDate > b.payDate) {
        return 1;
      }
      return 0;
    });
  };

  const showAdMobInterstitial = async (): Promise<void> => {
    let adId: string = "";
    try {
      const platform = Capacitor.getPlatform();
      if (platform === "ios") {
        adId = "ca-app-pub-6255300430204769/2743050859";
      } else if (platform === "android") {
        adId = "ca-app-pub-6255300430204769/6171708718";
      }
      const options: AdOptions = {
        adId: adId,
        isTesting: true,
      };
      await AdMob.prepareInterstitial(options);
      AdMob.showInterstitial().then(() => {
        setIsAdVisible(true);
      });
    } catch (error) {
      console.error("Error mostrando intersticial", error);
      setIsAdVisible(false);
    }
  };

  useEffect(() => {
    const onDismissListener = AdMob.addListener(
      InterstitialAdPluginEvents.Dismissed,
      () => {
        setIsAdVisible(false);
      }
    );
    const onFailedListener = AdMob.addListener(
      InterstitialAdPluginEvents.FailedToLoad,
      () => {
        setIsAdVisible(false);
      }
    );

    const onLoadListener = AdMob.addListener(
      InterstitialAdPluginEvents.Showed,
      () => {
        setIsAdVisible(true);
      }
    );

    return () => {
      onDismissListener.remove();
      onFailedListener.remove();
      onLoadListener.remove();
    };
  }, []);

  return (
    <IonPage>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/loans">
                <Loans
                  loans={loans.filter((loan: Loan) => loan.type === "loan")}
                  setLoans={setLoans}
                  indexedDBService={db}
                  recordType="loan"
                />
              </Route>
              <Route exact path="/debts">
              <Loans
                  loans={loans.filter((loan: Loan) => loan.type === "debt")}
                  setLoans={setLoans}
                  indexedDBService={db}
                  recordType="debt"
                />
              </Route>
              {/* <Route path="/tab3">
                <Tab3 />
              </Route> */}
              <Route exact path="/home">
                <Redirect to="/loans" />
              </Route>
              <Redirect exact from="/" to="/loans" />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="loans" href="/loans">
                <IonIcon aria-hidden="true" icon={walletOutline} />
                <IonLabel>Préstamos</IonLabel>
              </IonTabButton>
              <IonTabButton tab="debts" href="/debts">
                <IonIcon aria-hidden="true" icon={walletOutline} />
                <IonLabel>Deudas</IonLabel>
              </IonTabButton>
              {/* <IonTabButton tab="tab3" href="/tab3">
                <IonIcon aria-hidden="true" icon={square} />
                <IonLabel>Tab 3</IonLabel>
              </IonTabButton> */}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </IonPage>
  );
};

export default Home;
