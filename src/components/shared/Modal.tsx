import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useRef, useState, useEffect } from "react";
import { generateUniqueId, replaceAll } from "../../utilities/transform";
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
  const [buttonText, setButtonText] = useState<string>("Agregar");

  const modal = useRef<HTMLIonModalElement>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    getValues
  } = useForm({
    criteriaMode: "all",
    defaultValues: {
      debtor: "",
      amount: "",
      interest: "",
      date: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (editableLoan && Object.keys(editableLoan).length > 0) {
      setButtonText("Actualizar");
      reset({
        debtor: editableLoan.name,
        amount: formatAmount(editableLoan.amount.toString()),
        interest: editableLoan.interestRate.toString(),
        date: editableLoan.payDate
      });
      setSelectedDate(editableLoan.payDate);
    } else {
      setButtonText("Agregar");
      reset({
        debtor: "",
        amount: "",
        interest: "",
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedDate(new Date().toISOString());
    }
  }, [editableLoan, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        debtor: "",
        amount: "",
        interest: "",
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedDate(new Date().toISOString());
    }
  }, [isOpen, reset]);

  const formatAmount = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (event: CustomEvent) => {
    const rawValue = event.detail.value.replace(/\./g, '');
    const formattedValue = formatAmount(rawValue);
    setValue('amount', formattedValue);
  };

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      const loanData = {
        id: editableLoan ? editableLoan.id : generateUniqueId(),
        name: ev.detail.data.debtor,
        amount: Number(replaceAll(ev.detail.data.amount, '.', '')),
        interestRate: ev.detail.data.interest,
        payDate: selectedDate,
        isPayed: editableLoan ? editableLoan.isPayed : false // Default isPayed to false for new loans
      };

      if (editableLoan) {
        indexedDBService.updateLoan(loanData).then(() => {
          indexedDBService.getAllLoans().then((data) => {
            setLoans([...data]);
          });
        });
      } else {
        indexedDBService.addLoan(loanData).then(() => {
          indexedDBService.getAllLoans().then((data) => {
            setLoans([...data]);
          });
        });
      }
    }
  }

  const onSubmit = (data: any) => {
    const { debtor, amount, interest, date: payDate } = data;
    const formData = { debtor, amount, interest, payDate };
    modal.current?.dismiss(formData, 'confirm');
  }

  return (
    <>
      <IonModal ref={modal} isOpen={isOpen} onWillDismiss={(ev) => onWillDismiss(ev)}
        onIonModalDidDismiss={closeModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancelar</IonButton>
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
                {...register("debtor", {
                  required: "¿A quién le vas a prestar?",
                  minLength: {
                    value: 3,
                    message: "Este nombre parece corto"
                  }
                })}
                type="text"
                placeholder="Nombre"
                onIonBlur={() => clearErrors("debtor")}
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
                type="text"
                placeholder="Monto"
                onIonChange={handleAmountChange}
                onIonBlur={() => clearErrors("amount")}
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
                {...register('interest', {
                  required: "Define un porcentaje de interés",
                  max: { value: 100, message: "El porcentaje no puede ser mayor a 100%" }
                })}
                type="number"
                placeholder="Porcentaje"
                onIonBlur={() => clearErrors("interest")}
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
                  value={selectedDate}
                  onIonChange={(e) => {
                    if (typeof e.detail.value === 'string') {
                      setSelectedDate(e.detail.value);
                    }
                  }}
                />
              </IonModal>
            </IonItem>

            <IonButton expand="block" type="submit">{buttonText}</IonButton>
          </form>
        </IonContent>
      </IonModal>
    </>
  )
}

export default Modal;
