import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonThumbnail } from "@ionic/react"
import "./LoanContainer.css"
import { useState } from "react"

function LoanContainer() {
  const [loans, setLoans] = useState([
    {
      id: '1',
      artwork: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      title: 'test',
      artist: 'artist',
      year: '2000',
    },
    {
      id: '2',
      artwork: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      title: 'test',
      artist: 'artist',
      year: '2000',
    },
    {
      id: '3',
      artwork: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      title: 'test',
      artist: 'artist',
      year: '2000',
    },
    {
      id: '4',
      artwork: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      title: 'test',
      artist: 'artist',
      year: '2000',
    },
  ]);
  const [labelColor, setLabelColor] = useState('danger');

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
              <IonAvatar aria-hidden="true" slot="start">
                <img alt="avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </IonAvatar>
              <IonLabel className="custom-label">
                <div className="label-content">
                  <p>{loan.title}</p>
                  <p className={labelColor}>{loan.artist}</p>
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