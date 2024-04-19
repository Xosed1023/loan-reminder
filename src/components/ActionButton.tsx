import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import './ActionButton.css';
import { IndexedDBService } from '../persistence/IndexedDBService';

interface AddLoanButtonProps {
  openModal: () => void;
}

function ActionButton({ openModal }: AddLoanButtonProps) {
  return (
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => openModal()}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default ActionButton