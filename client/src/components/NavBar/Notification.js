import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { firestore } from '../../firebase';
import {RiNotification2Fill} from 'react-icons/ri'
import {useFirestoreConnect} from 'react-redux-firebase'
import { useCollectionData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom'
import {BsThreeDots} from 'react-icons/bs'
export default function Notification () {
    const client = useSelector(state => state.firebase.profile)
    const [isOpen, setOpen] = useState(false)
    const [numberOfList, setNumberOfList] = useState(14)
    useFirestoreConnect(client.id && [{collection: 'users', doc: client.id, subcollections: [{collection: 'notification', limit: numberOfList, orderBy: 'createdAt'}], storeAs: 'notification'}], )
    const list = useSelector(state => state.firestore.ordered.notification)
    const func = (target) => {
        if (!document.getElementById('Notification')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('Notification').contains(target.target)) {            //neu k click vao div 
            setOpen(false)

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

            document.removeEventListener('mousedown', func)
        }
    }
    useEffect(() => {
        if (!isOpen) return
        firestore.doc(`users/${client.id}`).update({newNoti: false})
    }, [isOpen])
    return(
        <div id='Notification' style={{margin: '0 2px', position: 'relative',}}>
            {client.newNoti && <div style={{display: 'flex', justifyContent: 'center', position: 'absolute', left: '30px', top: '5px', borderRadius: '100%', backgroundColor: '#f02849', minWidth: '15px', minHeight: '15px'}}></div>}
            <RiNotification2Fill size='40' className='canclick' onClick={open} style={{margin: '5px'}}/>
            {isOpen ? 
            <div className='color3' style={{margin: '8px', padding: '8px', width: '360px', right: '0', top: '50px', border: '1px solid green', overflow: 'auto', maxHeight: '80%', position: 'fixed'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <div style={{fontSize: '25px', fontWeight: 'bold'}}>
                        Notifications
                    </div>
                    <div>
                        <BsThreeDots size='25' className='canclick' style={{borderRadius: '100%'}}/>
                    </div>
                </div>
                {list && list.map(data => <SingleList key={data.id} notiData={data}/>)}              
            </div>
            :
            ''
            }
        </div>

    )
}

function SingleList ({notiData}) {
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(notiData.createdBy))
    if (user)
    return (
        <Link to={`/${notiData.path.path}`}>
            <div className='canclick' style={{display: 'flex', padding: '5px'}}>
                <img className='circle2' style={{marginRight: '10px'}} src={user && user.avatarURL}/>
                <div style={{wordWrap: 'break-word', maxWidth: '100%'}}>
                    {user && `${user.name} do something on the post`}
                </div>
            </div>
        </Link>
    )
    else return (
        <div style={{display: 'flex', justifyContent: 'center', height: '60px'}}>
            Loading
        </div>
        )
}