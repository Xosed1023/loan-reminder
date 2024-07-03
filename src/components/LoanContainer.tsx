import { useState, useEffect } from "react";
import { IonCard, IonCol, IonGrid, IonHeader, IonToolbar, IonTitle, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonContent, IonButton, IonText, IonAlert } from "@ionic/react";
import { checkmarkOutline, filterOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { Loan } from "../models/Loan";
import { IndexedDBService } from "../persistence/IndexedDBService";
import "./LoanContainer.css";
import Amount from "./loan/Amount";
import Avatar from "./loan/Avatar";
import LoanModal from "./LoanModal";

function LoanContainer({ loans, setLoans, openModal }: any) {
  const [searchText, setSearchText] = useState('');
  const [filteredLoans, setFilteredLoans] = useState(loans);
  const [sortCriteria, setSortCriteria] = useState('');

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null); // State for the selected loan
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [showAlert, setShowAlert] = useState<boolean>(false); // State for alert visibility
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null); // State for loan to delet
  const [slidingLoanToDelete, setSlidingLoanToDelete] = useState<any>(null); // State for loan to delet


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

  const handleDeleteLoan = async (loan: Loan) => {
    // Animación para eliminar el préstamo
    const loanElement = slidingLoanToDelete.closest('.loan-item');
    if (loanElement) {
      loanElement.classList.add('deleting');
      setTimeout(async () => {
        const db = IndexedDBService.getInstance();
        await db.deleteLoan(loan.id);
        setLoans(loans.filter((l: any) => l.id !== loan.id));
      }, 300); // Tiempo para la animación, ajusta según sea necesario
    }
  };

  const confirmDeleteLoan = (loan: Loan, slidingItem: HTMLIonItemSlidingElement) => {
    setSlidingLoanToDelete(slidingItem);
    setLoanToDelete(loan);
    setShowAlert(true);
  };

  const handleLoanClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleSort = (ev: any) => {
    setSortCriteria(ev.detail.value);
  };

  const handleMarkAsPaid = async (loan: Loan, slidingItem: any) => {
    const db = IndexedDBService.getInstance();
    const updatedLoan = { ...loan, isPayed: true, datePaid: new Date().toISOString() };
    await db.updateLoan(updatedLoan);
    setLoans(loans.map((l: any) => l.id === loan.id ? updatedLoan : l));

    // Cerrar el IonItemSliding
    await slidingItem.closeOpened();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSortCriteria('');
    setFilteredLoans(loans);
  };

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

  const calculateTotalAmount = (amount: number, interest: number) => {
    return amount + (amount * interest / 100);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tus prestamos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="sticky-container">
          {loans.length >= 4 &&
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
                    <IonSelectOption value="duedateasc">Fecha (Ascendente)</IonSelectOption>
                    <IonSelectOption value="duedatedesc">Fecha (Descendente)</IonSelectOption>
                  </IonSelect>
                </IonCol>
              </IonRow>
            </IonGrid>
          }
        </div>
        {filteredLoans.length === 0 ? (
          <div className="no-results">
            <IonText>No hay resultados</IonText>
            <IonButton onClick={handleClearFilters}>Limpiar filtros</IonButton>
          </div>
        ) : (
          <IonCard className="ion-no-margin ion-margin-bottom list-container">
            <IonList mode="ios" lines="none">
              {filteredLoans.map((loan: any) =>
                <IonItemSliding key={loan.id} className="loan-item"  >
                  <IonItemOptions side="start">
                    <IonItemOption mode="ios" onClick={() => openModal(loan.id)}>
                      <IonIcon icon={pencilOutline}></IonIcon>
                    </IonItemOption>
                  </IonItemOptions>
                  <IonItem onClick={() => handleLoanClick(loan)}>
                    <Avatar loan={loan}></Avatar>
                    <IonLabel className="custom-label">
                      <div className="label-content ion-text-capitalize">
                        <p>{loan.name}</p>
                        <div className="label-info">
                          <Amount amount={calculateTotalAmount(loan.amount, loan.interestRate)} color={getColor(loan)}></Amount>
                          <p className="payment-date">{formatDate(loan.payDate)}</p>
                        </div>
                      </div>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption mode="ios" color="success" onClick={(e: any) => handleMarkAsPaid(loan, e.target.closest('ion-item-sliding'))}>
                      <IonIcon icon={checkmarkOutline}></IonIcon>
                    </IonItemOption>
                    <IonItemOption
                      mode="ios"
                      color="danger"
                      onClick={(e: React.MouseEvent<HTMLIonItemOptionElement>) =>
                        /* handleDeleteLoan(loan, e.currentTarget.closest('ion-item-sliding') as HTMLIonItemSlidingElement) */
                        confirmDeleteLoan(loan, e.currentTarget.closest('ion-item-sliding') as HTMLIonItemSlidingElement)
                      }
                    >
                      <IonIcon icon={trashOutline}></IonIcon>
                    </IonItemOption>

                  </IonItemOptions>
                </IonItemSliding>
              )}
            </IonList>
          </IonCard>
        )}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Confirmar eliminación'}
          message={`¿Está seguro de que desea eliminar el préstamo "${loanToDelete?.name}"? Esta acción no se puede deshacer.`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setLoanToDelete(null);
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                if (loanToDelete) {
                  handleDeleteLoan(loanToDelete);
                  setLoanToDelete(null);
                }
              }
            }
          ]}
        />
      </IonContent>

      {selectedLoan && (
        <LoanModal
          isOpen={isModalOpen}
          loan={selectedLoan}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default LoanContainer;
