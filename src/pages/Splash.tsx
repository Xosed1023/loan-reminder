import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Splash.css';
import { useHistory } from 'react-router-dom'

const Splash: React.FC = () => {
  const navigate = useHistory();
  setTimeout(() => {
    navigate.push('/home');
  }, 3000);
  return (
    <IonPage>
      <IonContent fullscreen>
        <img src="./logo.png" alt="Logo" />
      </IonContent>
    </IonPage>
  );
};

export default Splash;
