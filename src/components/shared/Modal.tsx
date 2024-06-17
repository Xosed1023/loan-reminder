import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useRef, useState } from "react";
import { generateUniqueId, replaceAll, transformNumbers } from "../../utilities/transform";
import { Loan } from "../../models/Loan";
import { IndexedDBService } from "../../persistence/IndexedDBService";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import './Modal.css';

interface ModalProps {
  setLoans: any;
  isOpen: boolean;
  closeModal: () => void;
  editableLoan: Loan | undefined;
  indexedDBService: IndexedDBService;
}

const Modal = ({ setLoans, isOpen, closeModal, editableLoan, indexedDBService }: ModalProps) => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [amount, setAmount] = useState<string | number>();
  const [name, setName] = useState<string>();
  const [interest, setInterest] = useState<string | number>();

  const modal = useRef<HTMLIonModalElement>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm({
    criteriaMode: "all"
  });

  const form = {
    amount: useRef<HTMLIonInputElement>(null),
    debtor: useRef<HTMLIonInputElement>(null),
    interest: useRef<HTMLIonInputElement>(null),
  };

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      indexedDBService.addLoan({
        id: generateUniqueId(),
        name: ev.detail.data.debtor,
        amount: Number(replaceAll(ev.detail.data.amount, '.', '')),
        interestRate: ev.detail.data.interest,
        payDate: selectedDate
      }).then(() => {
        indexedDBService.getAllLoans().then((data) => {
          setLoans([...data]);
        });
      });
    }
    setAmount('');
    setName('');
    setInterest('');
  }

  const handleAmountChange = (event: any) => {
    const value = event.target.value;
    setAmount(transformNumbers(value));
  }

  const handleDateChange = (event: any) => {
    setSelectedDate(new Date(event.detail.value).toISOString().split('T')[0]);
  };

  /**
   * This function loads the data of the editable loan
   * Is called when the modal is opened
   */
  const loadData = () => {
    if (editableLoan) {
      setAmount(editableLoan.amount);
      setName(editableLoan.name);
      setInterest(editableLoan.interestRate);
      setSelectedDate(editableLoan.payDate);
    }
  }

  const onSubmit = (data: any) => {
    console.log("onSubmit", data);

    const { debtor, amount, interest, date: payDate } = data;
    const formData = { debtor, amount, interest, payDate };
    modal.current?.dismiss(formData, 'confirm');
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
              {/* <IonButton strong={true} onClick={() => confirm()}>
                Confirmar
              </IonButton> */}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTitle className='ion-text-center ion-margin-bottom' color="primary">
            {editableLoan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
          </IonTitle>


          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput
                label="Nombre del deudor"
                labelPlacement="stacked"
                onIonFocus={() => clearErrors()}
                {...register("debtor", {
                  required: "¿A quién le vas a prestar?",
                  minLength: {
                    value: 3,
                    message: "Este nombre parece corto"
                  }
                })}
                type="text"
                placeholder="Nombre"
              />
              <ErrorMessage
                errors={errors}
                name="debtor"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                      <IonLabel className="ion-text-alert" color="danger" key={type}>{message}</IonLabel>
                    ))
                    : null;
                }}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Cantidad a prestar"
                labelPlacement="stacked"
                onClick={() => clearErrors()}
                {...register('amount', {
                  required: "¿Cuánto vas a prestar?",
                  min: {
                    value: 1,
                    message: "¿Cuánto vas a prestar?"
                  },
                  max: {
                    value: 999999999,
                    message: "Puedes prestar máximo $999.999.999"
                  }
                })}

                value={amount}
                type="text"
                placeholder="Monto"
                onIonInput={handleAmountChange}
              />
              <ErrorMessage
                errors={errors}
                name="amount"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                      <IonLabel className="ion-text-alert" color="danger" key={type}>{message}</IonLabel>
                    ))
                    : null;
                }}
              />
            </IonItem>


            <IonItem>
              <IonInput
                label="¿Tasa de interés?"
                labelPlacement="stacked"
                onClick={() => clearErrors()}
                {...register('interest', { required: "Define un porcentaje de interés", max: { value: 100, message: "El porcentaje no puede ser mayor a 100%" } })}
                value={interest}
                type="number"
                placeholder="Porcentaje"
              />
              <ErrorMessage
                errors={errors}
                name="interest"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                      <IonLabel className="ion-text-alert" color="danger" key={type}>{message}</IonLabel>
                    ))
                    : null;
                }}
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

            <IonButton expand="block" type="submit">Agregar</IonButton>
          </form>
        </IonContent>
      </IonModal>
    </>

  )
}

export default Modal