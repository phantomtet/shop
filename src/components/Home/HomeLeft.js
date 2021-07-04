import React from 'react'
import {auth, firestore} from '../../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function HomeLeft () {
    const user = useSelector(state => state.firebase.profile)
    return (
        <div className='color2 left' style={{position: 'fixed', height: 'calc(100vh - 50px)', left: 0, top: 50, width: '360px', padding: '10px 5px 10px 5px', color: 'whitesmoke', overflow: 'auto'}}>
            <div className='' style={{height: '100%', overflow: 'auto'}}>
                <div className='shadow '>
                    <Link to={'/profile/' + user.id}>
                        <div className='canclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img className='circle1' src={user.avatarURL}/>
                            <div style={{padding: '10px', width: '100%'}}>
                                {user && user.name}
                            </div>
                        </div>
                    </Link>
                    <Link to={'/friends'}>
                        <div className='canclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Friends
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/PrjLkDYpYbH.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Groups
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y6/r/VPndBxotRgH.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Memories
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/D2y-jJ2C_hO.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Marketplace
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/kyCAf2jbZvF.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Pages
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/duk32h44Y31.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Watch
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/8wTx0Eu2vRq.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Events
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/lVijPkTeN-r.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Saved
                            </div>
                        </div>
                    </Link>
                    <Link to='/'>
                        <div className='cantclick' style={{display: 'flex', borderRadius: '10px', padding: '5px'}}>
                            <img src='https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/DO-SN-shaZL.png'/>
                            <div style={{padding: '10px', width: '100%'}}>
                                Jobs
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
             
            <div className='useless' style={{position: 'fixed', bottom: '0', padding: '5px 5px 10px 10px', display: 'flex', width: '350px', wordWrap: 'break-word'}}>
                <Link to='/'>Privacy</Link>||
                <Link to='/'>Terms</Link>||
                <Link to='/'>Fakebook © 20021</Link>
            </div>
        </div>
       
    )
}