import { IonApp, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Storage } from '@ionic/storage';
import { ellipse, square, triangle } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import './Splash.css';
import Loans from './Loans';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import { useState, useEffect } from 'react';
import { Loan } from '../models/Loan';
import React from 'react';
import { IndexedDBService } from '../persistence/IndexedDBService';

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

  useEffect(() => {
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

  useEffect(() => {
    //fetchLoans();
  }, [loans]);
  return (
    <IonPage>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/loans">
                <Loans loans={loans} setLoans={setLoans} indexedDBService={db} />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/tab3">
                <Tab3 />
              </Route>
              <Route exact path="/home">
                <Redirect to="/loans" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="loans" href="/loans">
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Préstamos</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon aria-hidden="true" icon={ellipse} />
                <IonLabel>Tab 2</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon aria-hidden="true" icon={square} />
                <IonLabel>Tab 3</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </IonPage>
  );
};

export default Home;