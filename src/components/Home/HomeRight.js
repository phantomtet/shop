import React, {useState, useEffect} from 'react'
import { useCollectionData, useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { auth, firestore, storage } from '../../firebase'
import {useDispatch, useSelector} from 'react-redux'
import {addOpen, removeCollapse} from '../../actions/chatlistAction'
export default function HomeRight () {
    const client = useSelector(state => state.firebase.profile)
    return (
        <div className='color2 right' style={{position: 'sticky',top: '50px', right: '0', width: '360px', padding: '5px', height: '100%', color: 'whitesmoke'}}>
            <div className='' style={{padding: '15px 10px 0px 10px', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    Contacts
                </div>
                <div style={{bottom: '7px', position: 'relative'}}>
                    <img style={{marginLeft: '5px'}} className='canclick circle0'/>
                    <img style={{marginLeft: '5px'}} className='canclick circle0'/>
                    <img style={{marginLeft: '5px'}} className='canclick circle0'/>
                </div>
            </div>
           
            {client.friends && client.friends.map(data => <SingleContact client={client} key={data} data={data}/>)}
        </div>
    )
}

function SingleContact ({data, client}) {
    const chatlist = useSelector(state => state.chatlist)
    const dispatch = useDispatch()
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(data))
    const handleClick = () => {
        if (chatlist.open && chatlist.open.includes(data)) return
        dispatch(addOpen(data))
        if (chatlist.collapse && chatlist.collapse.includes(data)) dispatch(removeCollapse(data))
    }
    return (
        <div onClick={handleClick} className='canclick' style={{display: 'flex', padding: '5px'}}>
            <img src={user && user.avatarURL} className='circle0'/>
            <div style={{padding: '5px 0 5px 10px'}}>
                {user && user.name}
            </div>
        </div>
    )
}