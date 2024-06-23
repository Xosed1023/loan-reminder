import { useState, useEffect } from "react";
import { IonCard, IonCol, IonGrid, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption } from "@ionic/react";
import { filterOutline } from 'ionicons/icons';
import { Loan } from "../models/Loan";
import { IndexedDBService } from "../persistence/IndexedDBService";
import "./LoanContainer.css";
import Amount from "./loan/Amount";
import Avatar from "./loan/Avatar";

function LoanContainer({ loans, setLoans, openModal }: any) {
  const [searchText, setSearchText] = useState('');
  const [filteredLoans, setFilteredLoans] = useState(loans);
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    filterAndSortLoans();
  }, [searchText, loans, sortCriteria]);

  const filterAndSortLoans = () => {
    let result = loans.filter((loan: Loan) =>
      loan.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (sortCriteria === 'paid') {
      result = result.filter((loan: Loan) => loan.isPayed === true);
    } else if (sortCriteria === 'delayed') {
      const currentDate = new Date().toISOString();
      result = result.filter((loan: Loan) => !loan.isPayed && loan.payDate < currentDate);
    } else if (sortCriteria === 'ontime') {
      const currentDate = new Date().toISOString();
      result = result.filter((loan: Loan) => !loan.isPayed && loan.payDate >= currentDate);
    } else if (sortCriteria === 'duedateasc') {
      result = result.sort((a: Loan, b: Loan) => new Date(a.payDate).getTime() - new Date(b.payDate).getTime());
    } else if (sortCriteria === 'duedatedesc') {
      result = result.sort((a: Loan, b: Loan) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime());
    }

    setFilteredLoans(result);
  };

  const handleDeleteLoan = (id: string) => {
    const db = IndexedDBService.getInstance();
    db.deleteLoan(id).then(() => {
      setLoans(loans.filter((loan: any) => loan.id !== id));
    });
  };

  const handleSort = (ev: any) => {
    setSortCriteria(ev.detail.value);
  }

  const getColor = (loan: Loan) => {
    const currentDate = Date.now();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <>
      <h1 className="ion-text-primary">Tus prestamos</h1>
      <IonCard className="ion-no-margin ion-margin-bottom">
        {
          loans.length >= 4 &&
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonSearchbar
                  placeholder="Buscar"
                  value={searchText}
                  onIonInput={(e: any) => setSearchText(e.target.value)}
                />
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
                  <IonSelectOption value="duedateasc">Fecha de Pago (Ascendente)</IonSelectOption>
                  <IonSelectOption value="duedatedesc">Fecha de Pago (Descendente)</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
        <IonList mode="ios" lines="none">
          {filteredLoans.map((loan: any) =>
            <IonItemSliding key={loan.id}>
              <IonItemOptions side="start">
                <IonItemOption mode="ios" color="success" onClick={() => openModal(loan.id)}>Editar</IonItemOption>
              </IonItemOptions>
              <IonItem>
                <Avatar loan={loan}></Avatar>
                <IonLabel className="custom-label">
                  <div className="label-content ion-text-capitalize">
                    <p>{loan.name}</p>
                    <div className="label-info">
                      <Amount amount={loan.amount} color={getColor(loan)}></Amount>
                      <p className="payment-date">{formatDate(loan.payDate)}</p>
                    </div>
                  </div>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end">
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

export default LoanContainer;
