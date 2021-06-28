import React from 'react'
import './Login.css'
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
        <div id='login'  style={{display: 'flex', justifyContent: 'center', position: 'fixed', height: '100%', width: '100%', background: 'linear-gradient(to top, #003b46, #00ccff)'}}>
            <div className='test' style={{ width: '100%', maxWidth: '400px', height: '100%', maxHeight: '600px', margin: 'auto'}}>
                {/* tieu de */}
                <div style={{display: 'flex', fontSize: '30px', width: '100%', justifyContent: 'center',}}>
                    Fakebook
                </div>
                <div style={{ padding: '10px', marginTop: '10px'}}>
                    <div style={{fontSize: '20px', display: 'flex', justifyContent: 'center'}}>
                        Have an account?
                    </div>
                    <input placeholder='Username' style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}/>
                    <input type='password' placeholder='Password' style={{width: '100%', marginBottom: '15px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}/>
                    <div id='signin'>
                        SIGN IN
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <input type='checkbox' style={{margin: 'auto 5px'}}/>
                            <p className='canclick2'>Remember me</p>
                        </div>
                        <div className='canclick2 ' style={{marginTop: '10px'}}>
                            Forgot password
                        </div>
                    </div>
                </div>
                <div style={{marginTop: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        Or Sign In With
                    </div>
                    <div style={{display: 'flex', }}>
                        <div className='login-button'>
                            <FcGoogle style={{margin: 'auto 5px auto auto'}}/>
                            <p style={{margin: 'auto auto auto 0'}}>Google</p>
                        </div>
                        <div className='login-button'>
                            <FaUserTie style={{margin: 'auto 5px auto auto'}}/>
                            <p style={{margin: 'auto auto auto 0'}}>Guest Account</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
