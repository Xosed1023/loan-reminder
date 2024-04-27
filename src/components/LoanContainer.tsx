import { IonCard, IonCol, IonGrid, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption } from "@ionic/react";
import { filterOutline } from 'ionicons/icons';
import { useState } from "react";
import { Loan } from "../models/Loan";
import "./LoanContainer.css";
import Amount from "./loan/Amount";
import Avatar from "./loan/Avatar";
import { IndexedDBService } from "../persistence/IndexedDBService";

function LoanContainer({ loans, setLoans, openModal }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddLoan = () => {
    const newLoan: Loan = {
      id: '5',
      name: '',
      nameInitials: '',
      amount: 3000,
      interestRate: 0,
      payDate: new Date().toISOString().split('T')[0],
    };
    setLoans([...loans, newLoan]);
  };

  const handleDeleteLoan = (id: string) => {
    const db = IndexedDBService.getInstance();
    db.deleteLoan(id).then(() => {
      setLoans(loans.filter((loan: any) => loan.id !== id));
    });

  };

  const handlePayLoan = (id: string) => {
    setLoans(loans.map((loan: any) => {
      if (loan.id === id) {
        return { ...loan, title: 'payed' };
      }
      return loan;
    }));
  };

  const handleSort = (ev: any) => {
    const sortCriteria = ev.detail.value;
    if (sortCriteria === 'paid') {
      setLoans(loans.filter((loan: Loan) => loan.isPayed === true));
    } else if (sortCriteria === 'ontime') {
      /* setLoans(loans.filter((loan: Loan) => loan.id !== id)); */
    } else if (sortCriteria === 'delayed') {
      /* setLoans(loans.filter((loan: Loan) => loan.id !== id)); */
    }
  }

  const getColor = (loan: Loan) => {
    if (loan.id === '1711761608398-o571sqlb') {
      loan.payDate = '2024-12-31'
    }
    const currentDate = Date.now(); // Obtener la fecha y hora actual en la zona horaria local del dispositivo
    const daysUntilPay = Math.ceil((new Date(loan.payDate).getTime() - currentDate) / (1000 * 60 * 60 * 24));

    if (loan.isPayed) {
      return 'grey';
    } else if (daysUntilPay <= -0.1) {
      return 'danger';
    } else if (daysUntilPay <= 5) {
      return 'warning';
    } else {
      return 'success';
    }
  };



  return (
    <>
      <h1 className="ion-text-primary">Tus prestamos</h1>
      <IonCard className="ion-no-margin ion-margin-bottom">
        {
          loans.length >= 4 &&
          <IonGrid >
            <IonRow >
              <IonCol size="10">
                <IonSearchbar placeholder="Search"></IonSearchbar>
              </IonCol>
              <IonCol pull="1" className="col-filter">
                <IonSelect
                  label="Text"
                  justify="end"
                  interface="popover"
                  toggleIcon={filterOutline}
                  onIonChange={handleSort}>
                  <IonSelectOption value="paid">Pagado</IonSelectOption>
                  <IonSelectOption value="delayed">Retrasado</IonSelectOption>
                  <IonSelectOption value="ontime">A tiempo</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
        <IonList mode="ios" lines="none">

          {loans.map((loan: any) =>
            <IonItemSliding key={loan.id}>
              {/* Opciones al incio del item */}
              <IonItemOptions side="start" >
                <IonItemOption mode="ios" color="success" onClick={() => openModal(loan.id)}>Editar</IonItemOption>
              </IonItemOptions>

              <IonItem>
                <Avatar loan={loan}></Avatar>
                <IonLabel className="custom-label">
                  <div className="label-content ion-text-capitalize">
                    <p>{loan.name}</p>
                    <p>{loan.payDate}</p>
                    <Amount amount={loan.amount} color={getColor(loan)}></Amount>
                  </div>
                </IonLabel>
              </IonItem>

              {/* Opciones al final del item */}
              <IonItemOptions side="end" >
                <IonItemOption mode="ios">Registrar Pago</IonItemOption>
                <IonItemOption mode="ios" color="danger" onClick={() => handleDeleteLoan(loan.id)}>Eliminar</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          )}
        </IonList>
      </IonCard>


    </>
  )
}

export default LoanContainer