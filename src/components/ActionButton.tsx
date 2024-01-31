import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import './ActionButton.css';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useRef, useState } from 'react';

function ActionButton({ setLoans, loans }: any) {

  const modal = useRef<HTMLIonModalElement>(null);
  const form = {
    debtor: useRef<HTMLIonInputElement>(null),
    amount: useRef<HTMLIonInputElement>(null),
    interest: useRef<HTMLIonInputElement>(null),
  };

  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  function confirm() {
    const debtorValue = form.debtor.current?.value;
    const amountValue = form.amount.current?.value;
    const interestValue = form.interest.current?.value;

    const formData = {
      debtor: debtorValue,
      amount: amountValue,
      interest: interestValue,
    };

    modal.current?.dismiss(formData, 'confirm');
  }

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setLoans([
        ...loans, {
          id: generateUniqueId(),
          name: ev.detail.data.debtor,
          amount: ev.detail.data.amount
        }
      ])
    }
  }

  return (
    <>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal">
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>


      <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancelar</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirmar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTitle className='ion-text-center ion-margin-bottom'>Nuevo prestamo</IonTitle>
          <IonItem>
            <IonInput
              label="Nombre del deudor"
              labelPlacement="stacked"
              ref={form.debtor}
              type="text"
              placeholder="Nombre"
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Cantidad a prestar"
              labelPlacement="stacked"
              ref={form.amount}
              type="number"
              placeholder="Monto"
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Tasa de interés?"
              labelPlacement="stacked"
              ref={form.interest}
              type="number"
              placeholder="Porcentaje"
            />
          </IonItem>
          <IonItem>
            <IonLabel>Fecha de pago</IonLabel>
            <IonDatetimeButton datetime="datetime" mode='ios'></IonDatetimeButton>

            <IonModal keepContentsMounted={true}>
              <IonDatetime presentation='date' id="datetime" showDefaultButtons={true} min={new Date().toISOString()}></IonDatetime>
            </IonModal>
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  )
}

export default ActionButton