import React from 'react'

import { firestore, auth } from '../firebase'
import { useFirebase } from 'react-redux-firebase'
import {FcGoogle,} from 'react-icons/fc'
import {FaFacebook} from 'react-icons/fa'
import { FaUserTie } from 'react-icons/fa'
export default function Login2 () {
    const firebase = useFirebase()
    const signinWithGuest = () => {
        auth.signInWithEmailAndPassword('guest123@gmail.com', '123456')
        
    }
    const signin = (provider) => {
        firebase.login({
            provider: provider,
            type: 'popup'
        })
        .then(result => {
            if (result.additionalUserInfo.isNewUser) {
                const defaultData =  {
                    id: result.user.uid,
                    name: result.user.email,
                    avatarURL: result.user.photoURL,
                }
                firestore.collection('users').doc(result.user.uid).set(defaultData)
            }
        })
    }
    return (
        <div id='login' className='test' style={{position: 'fixed', height: '100%', width: '100%',}}>
            <div style={{ background: 'linear-gradient(132deg, #FC415A, #591BC5, #212335)', animation: 'Gradient 15s ease infinite', backgroundSize: '400% 400%', height: '100vh', width: '100%'}}>
                a
            </div>
        </div>
    )
}
