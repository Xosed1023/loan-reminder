import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import './ActionButton.css';

function ActionButton() {
  return (
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton>
        <IonIcon icon={add}></IonIcon>
      </IonFabButton>
    </IonFab>
  )
}

export default ActionButton