import { IonLabel } from "@ionic/react";
import "./NoRecords.css";

interface Props {
  recordType: "loan" | "debt";
}

const NoRecords: React.FC<Props> = ({ recordType }) => {
  return (
    <section className="no-records-container ion-no-margin ion-no-padding">
      <IonLabel color="medium">
        No tienes aún{" "}
        <span className="ion-text-primary">{recordType === "loan" ? "préstamos registrados" : "deudas registradas"}</span>.{" "}
      </IonLabel>
      <IonLabel color="medium" className="ion-margin-top">
      {recordType === "loan" ? "¡Crea el primero!" : "¡Genial!"}
      </IonLabel>
    </section>
  );
};

export default NoRecords;
