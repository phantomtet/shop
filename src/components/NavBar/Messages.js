import React, { useEffect, useState } from 'react'
import { useCollectionData, useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import {RiMessengerLine} from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { firestore } from '../../firebase'
import {addOpen, removeCollapse} from '../../actions/chatlistAction'
import { timeFormat } from '../function'
import {BsThreeDots} from 'react-icons/bs'

export default function Messages () {
    const [searchText, setSearchText] = useState('')
    const chatlist = useSelector(state => state.chatlist)
    const client = useSelector(state => state.firebase.profile)
    const [isOpen, setOpen] = useState(false)
    const [newMesList] = useCollectionData(firestore.collection('users').doc(client.id).collection('messenger').where('newMes', '!=', false))
    const [allMesList] = useCollectionData(firestore.collection('users').doc(client.id).collection('messenger').orderBy('createdAt', 'desc'))
    const func = (target) => {
        if (!document.getElementById('Messages')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('Messages').contains(target.target)) {            //neu k click vao div 
            setOpen(false)

            document.removeEventListener('mousedown', func)
        }
    }
    useEffect(() => {
        if (newMesList && chatlist.open)
        newMesList.filter(ref => chatlist.open.includes(ref.createdBy)).forEach(ele => firestore.collection('users').doc(client.id).collection('messenger').doc(ele.createdBy).set({newMes: false}, {merge: true}))
    }, [newMesList, chatlist])
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

    return (
        <div id='Messages' style={{margin: '0 2px 0 2px', position: 'relative'}}>
            {(newMesList && newMesList.length) ? <div style={{display: 'flex', justifyContent: 'center', position: 'absolute', left: '30px', top: '5px', borderRadius: '100%', backgroundColor: '#f02849', minWidth: '15px', minHeight: '15px', color: 'white'}}>{newMesList.length}</div> : ''}
            <RiMessengerLine size='40' className='canclick' onClick={open} style={{margin: '5px'}}/>
            {isOpen?
            <div className='color3 shadow' style={{margin: '8px', padding: '8px', width: '360px', right: '0', top: '50px', overflow: 'auto', maxHeight: '80%', position: 'fixed', borderRadius: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontWeight: 'bold', fontSize: '25px', marginBottom: '10px'}}>
                        Messenger
                    </div>
                    <div>
                        <BsThreeDots size='25' className='canclick' style={{borderRadius: '100%'}}/>
                    </div>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <input onChange={({target}) => setSearchText(target.value)} value={searchText} placeholder='Search Messenger' style={{borderRadius: '15px', width: '100%', height: '36px'}}/>
                </div>
                {
                    !searchText && allMesList && allMesList.map(ele => <SingleMes data={ele} client={client}/>)
                }
                {
                    searchText && 
                    <div>
                        
                    </div>
                }
            </div>
            :
            ''}
        </div>
    )
}
function SingleMes ({data, client}) {
    const chatlist = useSelector(state => state.chatlist)
    const dispatch = useDispatch()
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(data.createdBy))
    const [lastMes] = useCollectionData(firestore.collection('users').doc(client.id).collection('messenger').doc(data.createdBy).collection('messages').limit(1).orderBy('createdAt', 'desc'))
    const handeClick = () => {
        if (chatlist.open && chatlist.open.includes(data.createdBy)) return
        dispatch(addOpen(data.createdBy))
        if (chatlist.collapse && chatlist.collapse.includes(data.createdBy)) dispatch(removeCollapse(data.createdBy))
    }
    if (user && lastMes)
    return (
        <div onClick={handeClick} className='canclick shadow' style={{padding: '5px', backgroundColor: data.newMes ? '#c4dfe6' : '', display: 'flex', height: '72px', borderRadius: '10px'}}>
            <img className='circle2' style={{marginRight: '10px'}} src={user.avatarURL}/>
            <div>
                <div style={{fontWeight: 'bold'}}>
                    {user && user.name}
                </div>
                <div style={{textOverflow: 'ellipsis', width: '232px', height: '20px', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                    {lastMes[0].createdBy === client.id ? `You: ${lastMes && lastMes[0].text}` : `${lastMes && lastMes[0].text}`}
                </div>
                <div style={{fontSize: '13px'}}>
                    {timeFormat(data.createdAt)}
                </div>
            </div>
        </div>
    )
    else return ''
}