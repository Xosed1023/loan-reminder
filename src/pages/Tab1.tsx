import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Tab1.css';
import LoanContainer from '../components/LoanContainer';
import ActionButton from '../components/ActionButton';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>
        <LoanContainer />
        <ActionButton />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
