import { IonLabel } from "@ionic/react"
import "./NoRecords.css"


const NoRecords = () => {
  return (
    <section className="no-records-container ion-no-margin ion-no-padding">
      <IonLabel color="medium">No tienes aún <span className="ion-text-primary">prestamos registrados</span>. </IonLabel>
      <IonLabel color="medium" className="ion-margin-top">¡Crea el primero!</IonLabel>
    </section>
  )
}

export default NoRecords