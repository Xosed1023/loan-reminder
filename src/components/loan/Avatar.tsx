import { IonAvatar } from "@ionic/react";
import { useEffect, useState } from "react";
import './Avatar.css';
interface AvatarProps {
  loan: {
    id: string;
    name: string;
    nameInitials?: string;
    avatarClass?: string;
    amount: number;
  };
}

const Avatar: React.FC<AvatarProps> = ({ loan }) => {
  const [nameInitials, setNameInitials] = useState<string>('');
  const [avatarClass, setAvatarClass] = useState<string>('');

  useEffect(() => {
    const wordsName = loan.name.split(' ');
    let initials = '';
    if (wordsName.length > 1) {
      initials = wordsName[0][0] + wordsName[1][0];
    } else {
      initials = wordsName[0][0] + wordsName[0][1];
    }

    const randomGradientClass = 'gradient-' + Math.floor(Math.random() * 6);
    setNameInitials(initials);
    setAvatarClass(randomGradientClass);
  }, [loan]);


  return (
    <>
      <IonAvatar aria-hidden="true" slot="start" className={avatarClass}>
        <p className="ion-text-uppercase">{nameInitials}</p>
      </IonAvatar>
    </>
  )
}

export default Avatar