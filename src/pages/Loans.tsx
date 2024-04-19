import { IonContent, IonPage } from '@ionic/react';

import ActionButton from '../components/ActionButton';
import LoanContainer from '../components/LoanContainer';
import NoRecords from '../components/NoRecords';
import './Loans.css';
import { Loan } from '../models/Loan';
import { useState } from 'react';
import Modal from '../components/shared/Modal';
import { IndexedDBService } from '../persistence/IndexedDBService';

interface LoansProps {
  loans: Loan[],
  setLoans: any,
  indexedDBService: IndexedDBService
}

const Loans: React.FC<LoansProps> = ({ loans, setLoans, indexedDBService }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableLoan, setEditableLoan] = useState({} as Loan | undefined);
  
  // Función para abrir el modal
  const openModal = (loanId?: string) => {
    setEditableLoan(loans.find((loan: any) => loan.id === loanId));
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <IonPage>
      <IonContent fullscreen className='ion-padding'>
        {
          loans?.length > 0 &&
          <LoanContainer openModal={openModal} loans={loans} setLoans={setLoans} />
        }
        {
          loans?.length === 0 &&
          <NoRecords></NoRecords>
        }
        <ActionButton openModal={openModal} />
      </IonContent>

      <Modal 
      setLoans={setLoans} 
      isOpen={isModalOpen} 
      closeModal={closeModal} 
      editableLoan={editableLoan}
      indexedDBService={indexedDBService}></Modal>
    </IonPage>
  );
};

export default Loans;
