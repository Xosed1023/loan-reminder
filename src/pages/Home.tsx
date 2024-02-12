import { IonApp, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Storage } from '@ionic/storage';
import { ellipse, square, triangle } from 'ionicons/icons';
import { Redirect, Route } from 'react-router';
import './Splash.css';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import { useState, useEffect } from 'react';
import { Loan } from '../models/Loan';
import React from 'react';

const Home: React.FC = () => {
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const storage: any = new Storage();

  useEffect(() => {
    const fetchLoans = async () => {
      await storage.create();
      let data = await storage.get('loans');
      if (data) {
        setLoans(data);
      } else {
        setLoans([])
      }
    };
    fetchLoans();
  }, []);

  useEffect(() => {
    const saveLoans = async () => {
      await storage.create();
      storage.set('loans', loans);
    }
    saveLoans();
  }, [loans]);

  return (
    <IonPage>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab1">
                <Tab1 loans={loans} setLoans={setLoans} />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/tab3">
                <Tab3 />
              </Route>
              <Route exact path="/home">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Tab 1</IonLabel>
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