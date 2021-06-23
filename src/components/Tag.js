import React, {useState} from 'react'
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'
import { firestore } from '../firebase'
import {AddFriendButton, MessageButton, AdvanceOptions} from './Profile'
export default function Tag(props) {
    const [hover, sethover] = useState(false)
    var interval, interval2 
    const enter = () => {
        sethover(true)
        clearInterval(interval)
    }
    const leave = () => {
        sethover(false)
        clearInterval(interval2)
    }
    const handleMouseEnter = () => {
        clearInterval(interval2)
        interval = setInterval(enter, 750)
    }
    const handleMouseLeave = () => {
        clearInterval(interval)
        interval2 = setInterval(leave, 500)
    }
    return (
        <div style={{display: 'flex'}}>
            <div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} style={{display: 'flex', position: 'relative'}}>
                <Link style={{fontWeight: 'bold', fontSize: props.fontSize}} to={'/profile/' + props.info.id}>
                    {props.info.name}
                </Link>
                {hover && <MiniProfile id={props.info.id}/>}      
            </div>
        </div>
    )
}

export function MiniProfile ({id}) {
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(id))
    if (user)
    return (
        <div className='color3' style={{border: '1px solid #c4dfe6', position: 'absolute', top: '25px', left: '-100px', width: '400px', height: '182px', padding: '16px 12px 16px 12px', fontSize: '18px', zIndex: '2'}}>
            <div style={{display: 'flex', marginBottom: '5px'}}>
                <img style={{width: '96px', height: '96px', borderRadius: '100%'}} src={user.avatarURL}/>
                <div style={{marginLeft: '15px'}}>
                <Link style={{fontWeight: 'bold'}} to={'/profile/' + id}>
                    {user && user.name}
                </Link>
                    <div style={{fontSize: '14px'}}>{user.intro && user.intro || 'No information given'}</div>
                </div>
            </div>
            <div style={{display: 'flex',}}>
                <AddFriendButton id={id}/>
                <MessageButton id={id}/>
                <AdvanceOptions />
            </div>
        </div>
    )
    else return ''
}