import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { triangle } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';
import { Loan } from '../models/Loan';
import { IndexedDBService } from '../persistence/IndexedDBService';
import Loans from './Loans';
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const Home: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const db = IndexedDBService.getInstance();
  const isInitialized = useRef(false);
  const [isAdVisible, setIsAdVisible] = useState(true);

  const fetchLoans = async (from: string = "No identificado") => {
    // console.log("fetchLoans desde: ", from);
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
        testingDevices: ['TESTDEVICE'],
        initializeForTesting: true
      });
      // console.log("AdMob inicializado");
    } catch (error) {
      console.error("Error al inicializar AdMob", error);
    }
  };

  useEffect(() => {
    // console.log(">>> | isAdVisible:", isAdVisible)
    if (!isAdVisible) {
      // console.log(new Date().toTimeString().split(' ')[0], "Se debe cargar intersticial");
      setTimeout(() => {
        showAdMobInterstitial();
      }, 30000)
    } else {
      // console.log(new Date().toTimeString().split(' ')[0], "intersticial abierto");
    }
  }, [isAdVisible]);

  useEffect(() => {

    initializeAdMob();
    // console.log(">>> | isAdVisible:", isAdVisible)
    setIsAdVisible(false);

    db.openDatabase().then(() => {
      fetchLoans("Effect de inicio");
    }).catch(error => {
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
    try {
      const options: AdOptions = {
        adId: 'ca-app-pub-3940256099942544/1033173712',
        isTesting: true
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
        // console.log(new Date().toTimeString().split(' ')[0], "Se cerró el intersticial");
        setIsAdVisible(false);
      }
    );
    const onFailedListener = AdMob.addListener(
      InterstitialAdPluginEvents.FailedToLoad,
      () => {
        // console.log(new Date().toTimeString().split(' ')[0], "Fallo al cargar el intersticial");
        setIsAdVisible(false);
      }
    );

    const onLoadListener = AdMob.addListener(
      InterstitialAdPluginEvents.Showed,
      () => {
        // console.log("Se muestra el intersticial");
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
                <Loans loans={loans} setLoans={setLoans} indexedDBService={db} />
              </Route>
              {/* <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/tab3">
                <Tab3 />
              </Route> */}
              <Route exact path="/home">
                <Redirect to="/loans" />
              </Route>
              <Redirect exact from="/" to="/loans" />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="loans" href="/loans">
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Préstamos</IonLabel>
              </IonTabButton>
              {/* <IonTabButton tab="tab2" href="/tab2">
                <IonIcon aria-hidden="true" icon={ellipse} />
                <IonLabel>Tab 2</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
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
