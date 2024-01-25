import { IonButton, IonContent, IonPage, createAnimation } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './Splash.css';

const Splash: React.FC = () => {
  const navigate = useHistory();
  setTimeout(() => {
    navigate.push('/home');
  }, 2500);

  const basicAnimation = [
    { offset: 0, transform: 'scale(0)' },
    { offset: 1, transform: 'scale(1)' }
  ]
  const splashContainer = useRef<HTMLDivElement>(null);

  const playAnimation = () => {
    if (splashContainer.current !== null) {
      const animation = createAnimation()
      .addElement(splashContainer.current)
      .duration(250)
      .keyframes(basicAnimation);
      animation.play();
    }
  }

  useEffect(() => {
    playAnimation()
  })

  return (
    <IonPage>
      <IonContent fullscreen>
        <div ref={splashContainer} className="splash-info">
          <img src="./logo.png" alt="Logo" />
          <h1>Loan Reminder</h1>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
