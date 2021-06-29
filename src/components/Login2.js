import React, { useEffect, useState } from 'react'
import './Login.css'
import { firestore, auth } from '../firebase'
import { useFirebase } from 'react-redux-firebase'
import {FcGoogle,} from 'react-icons/fc'
import { FaUserTie } from 'react-icons/fa'
export default function Login2 () {
    const firebase = useFirebase()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [mode, setMode] = useState('signin')
    useEffect(() => {
        if (error) setError('')
    }, [username, password])
    const signinWithGuest = () => {
        auth.signInWithEmailAndPassword('guest123@gmail.com', '123456')
        
    }
    const signInWithEmailAndPassword = () => {
        if (username && password) auth.signInWithEmailAndPassword(username, password)
        .catch(err => setError(err))
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
        <div id='login' style={{display: 'flex', justifyContent: 'center', position: 'fixed', height: '100%', width: '100%', background: 'linear-gradient(to top, #003b46, #00ccff)'}}>
            {
                mode === 'signin' ?
                <div style={{ width: '100%', maxWidth: '400px', height: '100%', maxHeight: '600px', margin: 'auto'}}>
                    <div style={{display: 'flex', fontSize: '30px', width: '100%', justifyContent: 'center',}}>
                        Fakebook
                    </div>
                    <div style={{ padding: '10px'}}>
                        <div className='group'>
                            <input required type='text' onChange={({target}) => setUsername(target.value)} value={username} style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)', color: '#c4dfe6'}}/>
                            <label>Username</label>
                        </div>
                        <div className='group'>
                            <input required type='password' onChange={({target}) => setPassword(target.value)} value={password} style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)', color: '#c4dfe6'}}/>
                            <label>Password</label>
                        </div>
                        {
                            error && <div style={{color: 'red'}}>{error.message}</div>
                        }
                        <div onClick={signInWithEmailAndPassword} id='signin' className={username && password ? 'enable' : 'disable'}>
                            SIGN IN
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', paddingTop: '10px'}}>
                                <input type='checkbox' style={{margin: 'auto 5px'}}/>
                                <p className='canclick2'>Remember me</p>
                            </div>
                            <div className='canclick2 ' style={{marginTop: '10px', paddingRight: '5px'}}>
                                Forgot password
                            </div>
                        </div>
                    </div>
                    <div style={{fontSize: '20px', display: 'flex', justifyContent: 'center'}}>
                        Don't have an account?&nbsp; <p onClick={() => setMode('signup')} className='canclick2' style={{color: '#c4dfe6'}}>Create it here.</p>
                    </div>
                    <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid black'}}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            Or Sign In With
                        </div>
                        <div style={{display: 'flex', }}>
                            <div onClick={() => signin('google')} className='login-button enable'>
                                <FcGoogle style={{margin: 'auto 5px auto auto'}}/>
                                <p style={{margin: 'auto auto auto 0'}}>Google</p>
                            </div>
                            <div onClick={signinWithGuest} className='login-button enable'>
                                <FaUserTie style={{margin: 'auto 5px auto auto'}}/>
                                <p style={{margin: 'auto auto auto 0'}}>Guest Account</p>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <Signup changeMode={() => setMode('signin')}/>
            }
        </div>
    )
}
function Signup (props) {
    const firebase = useFirebase()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    useEffect(() => {
        
    }, [name])
    const signup = () => {
        if (username && password ) {
            auth.createUserWithEmailAndPassword(username, password)
            .then(result => {
                if (result.additionalUserInfo.isNewUser) {
                    const defaultData =  {
                        id: result.user.uid,
                        name: name,
                        avatarURL: result.user.photoURL,
                    }
                    firestore.collection('users').doc(result.user.uid).set(defaultData)
                }
                auth.signInWithEmailAndPassword(username, password)
                })
            .catch(err => setError(err))
        }
        
    }
    return (
        <div style={{ width: '100%', maxWidth: '400px', height: '100%', maxHeight: '600px', margin: 'auto'}}>
            <div style={{display: 'flex', fontSize: '30px', width: '100%', justifyContent: 'center',}}>
                Fakebook
            </div>
            <div style={{ padding: '10px'}}>
                <div className='group'>
                    <input required type='text' onChange={({target}) => setUsername(target.value)} value={username} style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)', color: '#c4dfe6'}}/>
                    <label>Username</label>
                </div>
                <div className='group'>
                    <input required type='password' onChange={({target}) => setPassword(target.value)} value={password} style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)', color: '#c4dfe6'}}/>
                    <label>New Password</label>
                </div>
                <div className='group'>
                    <input required type='text' onChange={({target}) => setName(target.value)} value={name} style={{width: '100%', margin: '15px 0 10px', fontSize: '25px', height: '40px', border: 'none', borderRadius: '30px', backgroundColor: 'rgba(0, 0, 0, 0.25)', color: '#c4dfe6'}}/>
                    <label>Your Full Name</label>
                </div>
                {
                    error && <div style={{color: 'red'}}>{error.message}</div>
                }
                <div style={{margin: '15px 0'}} onClick={signup} id='signin' className={username && password ? 'enable' : 'disable'}>
                    SIGN UP
                </div>
                <div style={{display: 'flex'}}>
                    Have an account? &nbsp; <p onClick={props.changeMode} className='canclick2' style={{color: 'white'}}>Login here.</p>
                </div>
            </div>
        </div>
    )
}