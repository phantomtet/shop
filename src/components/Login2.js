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
        <div className='' style={{position: 'absolute', height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div className=' color3' style={{position: 'relative', margin: 'auto', borderRadius: '0 20px'}}>
                <div style={{fontWeight: 'bolder', fontSize: '25px', position: 'absolute', top: '-22px', left: '6px', color: '#66a5ad'}}>
                    Fakebook
                </div>
                <div className='canclick' onClick={() => signin('google')} style={{display: 'flex', margin: '5px'}}>
                    <FcGoogle size='30'/>
                    <div  style={{padding: '5px'}}>Sign in with Google Account</div>
                </div>
                <div title="Not working yet" className='cantclick' style={{display: 'flex', margin: '5px'}}>
                    <FaFacebook size='30'/>
                    <div  style={{padding: '5px'}}>Sign in with Facebook Account</div>
                </div>
                <div className='canclick' onClick={signinWithGuest} style={{display: 'flex', margin: '5px'}}>
                    <FaUserTie size='30' color='lightgreen'/>
                    <div style={{padding: '5px'}}>Or sign in with Guest Account</div>
                </div>
            </div>
            
        </div>
    )
}
