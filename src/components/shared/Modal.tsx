import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useRef, useState } from "react";
import { generateUniqueId, replaceAll, transformNumbers } from "../../utilities/transform";
import { Loan } from "../../models/Loan";

const Modal = ({ setLoans, isOpen, closeModal, editableLoan }: any) => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [amount, setAmount] = useState('');
  const [debtor, setDebtor] = useState('');
  const [interest, setInterest] = useState('');

  const modal = useRef<HTMLIonModalElement>(null);
  const form = {
    amount: useRef<HTMLIonInputElement>(null),
    debtor: useRef<HTMLIonInputElement>(null),
    interest: useRef<HTMLIonInputElement>(null),
  };

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    console.log(ev.detail.data);
    if (ev.detail.role === 'confirm') {
      setLoans((prevState: Loan[]) => [
        ...prevState,
        {
          id: generateUniqueId(),
          name: ev.detail.data.debtor,
          amount: replaceAll(ev.detail.data.amount, '.', ''),
          interestRate: ev.detail.data.interest,
          payDate: selectedDate
        }
      ]);

    }
    setAmount('');
    setDebtor('');
    setInterest('');
  }

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

  const handleAmountChange = (event: any) => {
    const value = event.target.value;
    setAmount(transformNumbers(value));
  }

  const handleDateChange = (event: any) => {
    setSelectedDate(new Date(event.detail.value).toISOString().split('T')[0]);
  };

  const loadData = () => {
    console.log('Cargando data')
    if (editableLoan) {
      console.log(">>> | editableLoan:", editableLoan)
      setAmount(editableLoan.amount);
      setDebtor(editableLoan.name);
      setInterest(editableLoan.interestRate);
      setSelectedDate(editableLoan.payDate);
    }
  }

  return (
    <>
      <IonModal ref={modal} isOpen={isOpen} onWillDismiss={(ev) => onWillDismiss(ev)}
        onIonModalDidDismiss={closeModal} onIonModalWillPresent={loadData}>
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
          <IonTitle className='ion-text-center ion-margin-bottom' color="primary">Nuevo prestamo</IonTitle>
          <IonItem>
            <IonInput
              label="Nombre del deudor"
              labelPlacement="stacked"
              ref={form.debtor}
              /* value={debtor} */
              type="text"
              placeholder="Nombre"
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Cantidad a prestar"
              labelPlacement="stacked"
              ref={form.amount}
              value={amount}
              type="text"
              placeholder="Monto"
              onIonInput={handleAmountChange}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Tasa de interés?"
              labelPlacement="stacked"
              ref={form.interest}
              value={interest}
              type="number"
              placeholder="Porcentaje"
            />
          </IonItem>
          <IonItem>
            <IonLabel>Fecha de pago</IonLabel>
            <IonDatetimeButton datetime="datetime" mode='ios'></IonDatetimeButton>

            <IonModal keepContentsMounted={true}>
              <IonDatetime
                presentation='date'
                id="datetime"
                showDefaultButtons={true}
                min={new Date().toISOString()}
                onIonChange={handleDateChange}
                value={selectedDate}></IonDatetime>
            </IonModal>
          </IonItem>
        </IonContent>
      </IonModal>
    </>

  )
}

export default Modal