import { IonAvatar } from "@ionic/react"
import React from 'react'

function Avatar({ loan }) {
    return (
        <>
            <IonAvatar aria-hidden="true" slot="start" className={loan.avatarClass}>
                <p>{loan.nameInitials}</p>
            </IonAvatar>
        </>
    )
}

export default Avatar