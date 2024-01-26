import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonThumbnail } from "@ionic/react"
import "./LoanContainer.css"
import { useEffect, useState } from "react"

function LoanContainer() {
  const [loans, setLoans] = useState([
    {
      id: '1',
      name: 'Johan Rios',
      nameInitials: '',
      avatarClass: '',
      amount: 2500
    },
    {
      id: '2',
      name: 'Joon Erira',
      nameInitials: '',
      amount: 1000
    },
    {
      id: '3',
      name: 'Xosed Peñaloza',
      nameInitials: '',
      amount: 1000
    }
  ]);
  const [labelColor, setLabelColor] = useState('success');

  const handleLabelColor = () => {
    if (labelColor === 'danger') {
      setLabelColor('success');
    } else {
      setLabelColor('danger');
    }
  };

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
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const handleEditLoan = (id: string) => {
    setLoans(loans.map(loan => {
      if (loan.id === id) {
        return { ...loan, title: 'edited' };
      }
      return loan;
    }));
  };

  const handlePayLoan = (id: string) => {
    setLoans(loans.map(loan => {
      if (loan.id === id) {
        return { ...loan, title: 'payed' };
      }
      return loan;
    }));
  };

  // Inicializar iniciales de nombre para el avatar
  useEffect(() => {
    const getGradient = () => {
      return 'gradient-' + Math.floor(Math.random() * 6);
    };

    setLoans(loans.map(loan => {
      if (loan.name.split(' ').length >= 2) {
        return { ...loan, avatarClass: getGradient(), nameInitials: loan.name.split(' ')[0][0].toUpperCase() + loan.name.split(' ')[1][0].toUpperCase() };
      } else {
        return { ...loan, avatarClass: getGradient(), nameInitials: loan.name.substring(0, 2).toUpperCase() };
      }
    }));
  }, []);

  return (
    <>
      <h1>Tus prestamos</h1>
      <IonList mode="ios">

        {loans.map(loan =>
          <IonItemSliding key={loan.id}>
            {/* Opciones al incio del item */}
            <IonItemOptions side="start" >
              <IonItemOption mode="ios" color="success">Editar</IonItemOption>
            </IonItemOptions>

            <IonItem>
              <IonAvatar aria-hidden="true" slot="start" className={loan.avatarClass}>
                <p>{loan.nameInitials}</p>
              </IonAvatar>
              <IonLabel className="custom-label">
                <div className="label-content">
                  <p>{loan.name}</p>
                  <p className={labelColor}>{loan.amount}</p>
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
    </>
  )
}

export default LoanContainer