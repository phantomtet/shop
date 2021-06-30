import React, { useState } from 'react'
import { useSelector} from 'react-redux'
import {auth} from '../../firebase'
import {AiFillCaretDown} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import {RiSettings4Fill, RiQuestionLine, RiLogoutBoxRLine} from 'react-icons/ri'
import {GiMoon} from 'react-icons/gi'
import { BsExclamationCircleFill } from 'react-icons/bs'
export default function AccountOption (props) { 
    const user = useSelector(state => state.firebase.profile)
    const [isOpen, setOpen] = useState(false)
    const [focusTab, setFocusTab] = useState('')
    const func = (target) => {
        if (!document.getElementById('AccountOption')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('AccountOption').contains(target.target)) {            //neu k click vao div 
            setOpen(false)
            setFocusTab('')
            document.removeEventListener('mousedown', func)
        }
    }
    
    const open = () => {
        if (isOpen === false) {
            setOpen(true)
            document.addEventListener('mousedown', func)
        }
        else {
            setOpen(false)
            setFocusTab('')
            document.removeEventListener('mousedown', func)
        }
    }

    const header = () => {
        switch (focusTab) {
            case 'setting': return 'Setting & Privacy'
            case 'help' : return 'Help & Support'
            case 'display' : return 'Display & Accessibility'
        }
    }
    const content = () => {
        switch (focusTab) {
            case 'setting' : return (
            <div className=''>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://freeiconshop.com/wp-content/uploads/edd/settings-solid.png'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            Settings
                        </h4>
                    </div>
                </div>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://freeiconshop.com/wp-content/uploads/edd/shield-outline.png'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            Privacy Checkup
                        </h4>
                    </div>
                </div>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiCPL8CCNHTe5O2-535GWCPrvCOsHyl4NDnpariH3j0ua33C0UrH4yRbeV6IMPeO9bm40&usqp=CAU'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            Privacy Shortcuts
                        </h4>
                    </div>
                </div>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://icons-for-free.com/iconfiles/png/512/list+list+icon+menu+menu+icon+icon-1320165661814559795.png'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            Activity Log
                        </h4>
                    </div>
                </div>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://cdn.iconscout.com/icon/free/png-256/menu-1851633-1569358.png'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            New Feed Preferences
                        </h4>
                    </div>
                </div>
                <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src='https://image.flaticon.com/icons/png/512/44/44386.png'/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4 style={{padding: '5px 0 5px 0'}}>
                            Language
                        </h4>
                    </div>
                </div>
            </div>
            )
        }
    }
    return(
        <div id='AccountOption' style={{margin: '0 2px 0 2px'}}>
            <AiFillCaretDown size='40' className='canclick' onClick={open} style={{margin: '5px'}}/>
            { isOpen ? 
            <div className='color3 shadow' style={{margin: '8px', padding: '8px 8px', height: '470px', width: '360px', right: '0', position: 'absolute', borderRadius: '10px'}}>
                <Link to={`/profile/${user.id}`}>
                    <div className='canclick' style={{display: 'flex', padding: '5px', borderBottom: '1px solid green'}}>
                        <img className='circle2' src={user.avatarURL}/>
                        <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                            {user ? <h3>{user.name}</h3> : 'NULL'}
                            <p>See your profile</p>
                        </div>
                    </div>
                </Link>
                <div className='canclick' style={{margin: '5px 0',display: 'flex', padding: '5px', borderBottom: '1px solid green'}}>
                    <BsExclamationCircleFill size='35'/>
                    <div style={{width: '100%', marginLeft: '5px', display: 'flex'}}>
                        <div>
                            <h4 style={{margin: 'auto 0', display: 'block'}}>
                                Give Feedback
                            </h4>
                            <p>Help us improve the new Facebook.</p>
                        </div>
                    </div>
                </div>
                {/* <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <img className='circle0' src=''/>
                    <div style={{width: '100%', marginLeft: '5px', padding: '5px 0 5px 5px'}}>
                        <h4>
                            Switch Account
                        </h4>
                        <p>Log in as other client</p>
                    </div>
                </div> */}
                <div onClick={() => setFocusTab('setting')} className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <RiSettings4Fill size='35' />
                    <div style={{width: '100%', marginLeft: '5px', display: 'flex'}}>
                        <h4 style={{margin: 'auto 0'}}>
                            Setting & Privacy
                        </h4>
                        
                    </div>
                </div>
                <div onClick={() => setFocusTab('help')} className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <RiQuestionLine size='35'/>
                    <div style={{width: '100%', marginLeft: '5px', display: 'flex'}}>
                        <h4 style={{margin: 'auto 0'}}>
                            Help & Support
                        </h4>
                        
                    </div>
                </div>
                <div onClick={() => setFocusTab('display')} className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <GiMoon size ='35'/>
                    <div style={{width: '100%', marginLeft: '5px', display: 'flex'}}>
                        <h4 style={{margin: 'auto 0'}}>
                            Display & Accessibility
                        </h4>
                    </div>
                </div>
                <div onClick={() => auth.signOut()} className='canclick' style={{display: 'flex', padding: '5px'}}>
                    <RiLogoutBoxRLine size='35'/>
                    <div style={{width: '100%', marginLeft: '5px', display: 'flex'}}>
                        <h4 style={{margin: 'auto 0'}}>
                            Log Out
                        </h4>
                    </div>
                </div>
                {focusTab ? 
                        <div className='color3' style={{left: '0', top: '0', position: 'absolute', height: '100%', width: '100%'}}>
                            <div style={{display: 'flex', padding: '16px 16px 8px 16px'}}>
                                <img onClick={() => setFocusTab('')} className='circle0 canclick' src='https://icons.veryicon.com/png/o/miscellaneous/unicons/arrow-left-44.png'/>
                                <h2 style={{paddingLeft: '10px'}}>{header()}</h2>
                            </div>
                            <div>
                                {content()}
                            </div>
                        </div> 
                        : ''}
            </div>
            :
            ''
            }
        </div>
    )
}
