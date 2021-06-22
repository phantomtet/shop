import React from 'react'

import { firestore } from '../firebase'
import { useFirebase } from 'react-redux-firebase'

export default function Login2 () {
    const firebase = useFirebase()
    const signin = () => {
        firebase.login({
            provider: 'google',
            type: 'popup'
        })
        .then(result => {
            if (result.additionalUserInfo.isNewUser) {
                const defaultData =  {
                    id: result.user.uid,
                    name: result.user.email,
                    avatarURL: result.user.photoURL,
                    newNoti: false
                }
                firestore.collection('users').doc(result.user.uid).set(defaultData)
            }
        })
    }
    return (
        <div className='test'>
            <button onClick={signin}>Log in</button>
        </div>
    )
}
