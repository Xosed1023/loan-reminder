import React from "react";
import { IonButton, IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonLabel, IonItem, IonIcon, IonButtons } from "@ionic/react";
import { Loan } from "../models/Loan";
import { closeOutline, logoApple, settingsSharp } from "ionicons/icons";

interface LoanModalProps {
  isOpen: boolean;
  loan: Loan;
  onClose: () => void;
}

const LoanModal: React.FC<LoanModalProps> = ({ isOpen, loan, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalles del Préstamo</IonTitle>
          <IonButtons slot="end">
          <IonButton size="small" onClick={onClose}>
            <IonIcon slot="icon-only" ios={closeOutline} md={closeOutline}></IonIcon>
          </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel><strong>Nombre del deudor:</strong> {loan.name}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel><strong>Cantidad:</strong> ${loan.amount.toLocaleString()}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel><strong>Tasa de interés:</strong> {loan.interestRate}%</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel><strong>Fecha de pago:</strong> {new Date(loan.payDate).toLocaleDateString()}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel><strong>Concepto:</strong> {loan.concept}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel><strong>Estado de pago:</strong> {loan.isPayed ? "Pagado" : "Pendiente"}</IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default LoanModal;
