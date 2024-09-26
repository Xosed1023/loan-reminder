import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar, IonCheckbox, IonIcon, IonPopover } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useRef, useState, useEffect } from "react";
import { generateUniqueId, replaceAll } from "../../utilities/transform";
import { Loan } from "../../models/Loan";
import { IndexedDBService } from "../../persistence/IndexedDBService";
import { useForm, useWatch } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { helpCircleOutline } from 'ionicons/icons';
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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isPayed, setIsPayed] = useState<boolean>(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    watch
  } = useForm({
    criteriaMode: "all",
    defaultValues: {
      debtor: "",
      amount: "",
      interest: "",
      date: new Date().toISOString().split('T')[0],
      concept: "" // default value for concept
    }
  });

  useEffect(() => {
    if (editableLoan && Object.keys(editableLoan).length > 0) {
      setButtonText("Actualizar");
      reset({
        debtor: editableLoan.name,
        amount: formatAmount(editableLoan.amount.toString()),
        interest: editableLoan.interestRate.toString(),
        date: editableLoan.payDate,
        concept: editableLoan.concept || "" // reset concept if exists
      });
      setSelectedDate(editableLoan.payDate);
      setIsPayed(editableLoan.isPayed!); // Set the checkbox value
    } else {
      setButtonText("Agregar");
      reset({
        debtor: "",
        amount: "",
        interest: "",
        date: new Date().toISOString().split('T')[0],
        concept: "" // reset concept
      });
      setSelectedDate(new Date().toISOString());
      setIsPayed(false); // Reset the checkbox value
    }
  }, [editableLoan, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        debtor: "",
        amount: "",
        interest: "",
        date: new Date().toISOString().split('T')[0],
        concept: "" // reset concept
      });
      setSelectedDate(new Date().toISOString());
      setIsPayed(false); // Reset the checkbox value
    }
  }, [isOpen, reset]);

  const formatAmount = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (event: CustomEvent) => {
    const rawValue = event.detail.value.replace(/\D/g, "");
    const formattedValue = formatAmount(rawValue);
    setValue('amount', formattedValue);
  };

  const calculateTotalAmount = (amount: number, interest: number) => {
    return amount + (amount * interest / 100);
  };

  const watchedAmount = watch('amount');
  const watchedInterest = watch('interest');

  useEffect(() => {
    const amount = Number(replaceAll(watchedAmount ?? '', '.', ''));
    const interest = Number(watchedInterest ?? '');
    if (!isNaN(amount) && !isNaN(interest)) {
      setTotalAmount(calculateTotalAmount(amount, interest));
    } else {
      setTotalAmount(0);
    }
  }, [watchedAmount, watchedInterest]);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      const loanData = {
        id: editableLoan ? editableLoan.id : generateUniqueId(),
        name: ev.detail.data.debtor,
        amount: Number(replaceAll(ev.detail.data.amount, '.', '')),
        interestRate: ev.detail.data.interest,
        payDate: selectedDate,
        concept: ev.detail.data.concept, // add concept to loanData
        isPayed: editableLoan ? isPayed : false // Update isPayed based on the checkbox
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
    const { debtor, amount, interest, date: payDate, concept } = data; // add concept to destructured data
    const formData = { debtor, amount, interest, payDate, concept }; // add concept to formData
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
            <IonTitle color="primary">
              {editableLoan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

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
                      <IonLabel className="ion-text-alert error-message show" color="danger" key={type}>{message}</IonLabel>
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
                      <IonLabel className="ion-text-alert error-message show" color="danger" key={type}>{message}</IonLabel>
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
              <IonButton id="interest-popover" slot="end" fill="clear">
                <IonIcon icon={helpCircleOutline} />
              </IonButton>
              <IonPopover  trigger="interest-popover" triggerAction="click">
                <IonContent className="ion-padding-horizontal">
                  <p>El interés es el porcentaje adicional que se añadirá al monto total prestado.</p>
                </IonContent>
              </IonPopover>
              <ErrorMessage
                errors={errors}
                name="interest"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                      <IonLabel className="ion-text-alert error-message show" color="danger" key={type}>{message}</IonLabel>
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

            <IonItem>
              <IonInput
                label="Concepto"
                labelPlacement="stacked"
                {...register("concept", {
                  required: "¿Cuál es el concepto del préstamo?",
                  minLength: {
                    value: 3,
                    message: "Este concepto parece corto"
                  }
                })}
                type="text"
                placeholder="Concepto"
                onIonBlur={() => clearErrors("concept")}
              />
              <ErrorMessage
                errors={errors}
                name="concept"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                      <IonLabel className="ion-text-alert error-message show" color="danger" key={type}>{message}</IonLabel>
                    ))
                    : null;
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel color="success">Total a pagar: ${totalAmount.toLocaleString()}</IonLabel>
            </IonItem>

            {editableLoan && editableLoan.isPayed && (
              <IonItem>
                <IonLabel>Préstamo Pagado</IonLabel>
                <IonCheckbox
                  checked={isPayed}
                  onIonChange={(e) => setIsPayed(e.detail.checked)}
                />
              </IonItem>
            )}

            <IonButton className="button-submit" expand="block" type="submit">{buttonText}</IonButton>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
}

export default Modal;
