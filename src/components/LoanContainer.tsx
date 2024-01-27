import { IonAvatar, IonCard, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonSearchbar, IonThumbnail } from "@ionic/react"
import "./LoanContainer.css"
import { useEffect, useState } from "react"
import Avatar from "./loan/Avatar";
import Amount from "./loan/Amount";

function LoanContainer({loans, setLoans}: any) {
  

  const handleAddLoan = () => {
    const newLoan = {
      id: '5',
      name: '',
      nameInitials: '',
      amount: 3000
    };
    setLoans([...loans, newLoan]);
  };

  const handleDeleteLoan = (id: string) => {
    setLoans(loans.filter((loan: any) => loan.id !== id));
  };

  const handleEditLoan = (id: string) => {
    setLoans(loans.map((loan: any) => {
      if (loan.id === id) {
        return { ...loan, title: 'edited' };
      }
      return loan;
    }));
  };

  const handlePayLoan = (id: string) => {
    setLoans(loans.map((loan: any) => {
      if (loan.id === id) {
        return { ...loan, title: 'payed' };
      }
      return loan;
    }));
  };

  return (
    <>
      <h1>Tus prestamos</h1>
      <IonCard className="ion-no-margin ion-margin-bottom">
        {
          loans.length >= 10 &&
          <IonSearchbar placeholder="Search"></IonSearchbar>
        }
        <IonList mode="ios">

          {loans.map((loan: any) =>
            <IonItemSliding key={loan.id}>
              {/* Opciones al incio del item */}
              <IonItemOptions side="start" >
                <IonItemOption mode="ios" color="success">Editar</IonItemOption>
              </IonItemOptions>

              <IonItem>
                <Avatar loan={loan}></Avatar>
                <IonLabel className="custom-label">
                  <div className="label-content">
                    <p>{loan.name}</p>
                    <Amount amount={loan.amount}></Amount>
                  </div>
                </IonLabel>
              </IonItem>

              {/* Opciones al final del item */}
              <IonItemOptions side="end" >
                <IonItemOption mode="ios">Registrar Pago</IonItemOption>
                <IonItemOption mode="ios" color="danger">Eliminar</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          )}
        </IonList>
      </IonCard>
    </>
  )
}

export default LoanContainer