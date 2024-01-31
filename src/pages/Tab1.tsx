import { IonContent, IonPage } from '@ionic/react';

import ActionButton from '../components/ActionButton';
import LoanContainer from '../components/LoanContainer';
import NoRecords from '../components/NoRecords';
import './Tab1.css';

interface LoansProps {
  loans: any[],
  setLoans: any
}

const Tab1: React.FC<LoansProps> = ({ loans, setLoans }) => {

  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>
        {
          loans?.length > 0 &&
          <>
            <LoanContainer loans={loans} setLoans={setLoans} />
          </>
        }
        {
          loans?.length === 0 &&
          <NoRecords></NoRecords>
        }
        <ActionButton loans={loans} setLoans={setLoans} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
