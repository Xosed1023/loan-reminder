import { IonApp, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import { Loan } from '../models/Loan';
import { IndexedDBService } from '../persistence/IndexedDBService';
import Loans from './Loans';
import './Splash.css';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import { AdMob, AdOptions, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const Home: React.FC = () => {
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const db = IndexedDBService.getInstance();

  const fetchLoans = async (desde: string = "No identificado") => {
    console.log("fetchLoans desde: ", desde);
    db.getAllLoans().then(loans => {
      sortLoans(loans);
      setLoans(loans)
    }).catch(error => {
      console.error(`Error consultando prestamo ${error}`);
      setLoans([])
    });
  };

  const initialize = async () => {
    try {
      const { status } = await AdMob.trackingAuthorizationStatus();
      console.log("🚀 ~ ========= status:", status)
      if (status === 'notDetermined') {
        console.log("initialize: notDetermined");
      }

    } catch (error) {
      console.log("🚀 ~ initialize ~ error 1:", error)

    }

    try {



      AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['TESTDEVICE'],
        initializeForTesting: true
      })
    } catch (error) {
      console.log("🚀 ~ initialize ~ error:", error)
    }
  };

  useEffect(() => {
    initialize().then(() => {
      console.log("Mostrando intersticial");
      setTimeout(() => {
        showInterstitial();
      }, 3000)
    });

    db.openDatabase().then(() => {
      fetchLoans("Effect de inicio");
    }).catch(error => {
      console.error(`Error al abrir la base de datos ${error}`);
      setLoans([])
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
  }

  const showInterstitial = async (): Promise<void> => {
    const options: AdOptions = {
      adId: 'ca-app-pub-3940256099942544/1033173712',
      isTesting: true
      // npa: true
    };
    console.log("A")
    await AdMob.prepareInterstitial(options);
    console.log("B")
    await AdMob.showInterstitial();
  }

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