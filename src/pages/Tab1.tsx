import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Tab1.css';
import LoanContainer from '../components/LoanContainer';
import ActionButton from '../components/ActionButton';
import { useState } from 'react';

const Tab1: React.FC = () => {
  const [loans, setLoans] = useState([]);

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>
        {
          loans.length > 0 &&
          <>
            <LoanContainer loans={loans} setLoans={setLoans} />
          </>
        }
        {
          loans.length === 0 &&
          <p>Agregar componente para cuando no hay registros</p>
        }
        <ActionButton loans={loans} setLoans={setLoans} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
