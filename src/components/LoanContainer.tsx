import { IonCard, IonCol, IonGrid, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption } from "@ionic/react";
import { Loan } from "../models/Loan";
import "./LoanContainer.css";
import Amount from "./loan/Amount";
import Avatar from "./loan/Avatar";
import Modal from "./shared/Modal";
import { add, remove, filterOutline } from 'ionicons/icons';
import { useState } from "react";

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

  const handleEditLoan = (id: string) => {
    setLoans(loans.map((loan: Loan) => {
      if (loan.id === id) {
        return { ...loan, title: 'edited' };
      }
      return loan;
    }));
  };

  const handleDeleteLoan = (id: string) => {
    setLoans(loans.filter((loan: any) => loan.id !== id));
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
    if(sortCriteria === 'paid') {
      
    }else if(sortCriteria === 'ontime') {
      
    } else if(sortCriteria === 'delayed') {
      
    }
    const sortedLoans = [...loans].sort((a: Loan, b: Loan) => {
      const dateA = new Date(a.payDate);
      const dateB = new Date(b.payDate);
      return dateA.getTime() - dateB.getTime();
    });
    setLoans(sortedLoans);
  }



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
                    <Amount amount={loan.amount}></Amount>
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