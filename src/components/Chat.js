import React, { useEffect, useState } from 'react'
import { useCollectionData, useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { firestore } from '../firebase'
import {addOpen, removeOpen, addCollapse, removeCollapse} from '../actions/chatlistAction'
import {GrClose, GrGallery, GrAddCircle, GrLike} from 'react-icons/gr'
import {BiSticker, BiSend} from 'react-icons/bi'
import {RiFileGifLine} from 'react-icons/ri'
import {v4} from 'uuid'
export default function Chat () {
    const client = useSelector(state => state.firebase.profile)
    const chatlist = useSelector(state => state.chatlist)
    return (
        <div className='' style={{position: 'fixed', bottom: 0, right: '80px', zIndex: '5'}}>
            <div className='canclick circle2 ' style={{position: 'fixed', bottom: '0', right: '0', margin: '10px'}}>
                <img style={{width: '30px', position: 'relative', top: '14px', left: '15px'}} src='https://static.thenounproject.com/png/729124-200.png'/>  
            </div>
            <div style={{right: '80px', display: 'flex'}}>
                {chatlist.open && chatlist.open.map(elem => <OpenChat client={client} key={elem} id={elem}/>)}
                
            </div>
            <div className='' style={{position: 'fixed', right: '0', bottom: '80px', width: '80px', padding: '0 10px 0 10px'}}>
                {chatlist.collapse && chatlist.collapse.map(elem => <CollapseChat key={elem} id={elem}/>)}
            </div>
        </div>
    )
}

function OpenChat ({id, client}) {              //id la id cua doi phuong
    const [isFocus, setFocus] = useState(true)
    const [messages] = useCollectionData(firestore.collection(`users/${client.id}/messenger/${id}/messages`).orderBy('createdAt', 'desc'))
    const [text, setText] = useState('')
    const dispatch = useDispatch()
    const handleClick = () => {
        dispatch(removeOpen(id))
        dispatch(addCollapse(id))
    }
    const handleSubmit = () => {
        if (text) {
            // new chat, ref la message cua minh, ref2 la mes cua doi phuong
            const ref = firestore.collection('users').doc(client.id).collection('messenger').doc(id).collection('messages').doc()
            const ref2 = firestore.collection('users').doc(id).collection('messenger').doc(client.id).collection('messages').doc()
            //set message phia doi phuong
            firestore.collection('users').doc(id).collection('messenger').doc(client.id).set({newMes: true, createdAt: Date.now(), createdBy: client.id}, {merge: true})
            //set message phia minh
            firestore.collection('users').doc(client.id).collection('messenger').doc(id).set({createdAt: Date.now(), createdBy: id}, {merge: true})
            ref.set({
                text: text,
                createdAt: Date.now(),
                createdBy: client.id,
            })
            ref2.set({
                text: text,
                createdAt: Date.now(),
                createdBy: client.id,
            })
            setText('')
        }
    }
    
    useEffect(() => {
        if (isFocus) {
            const input = document.getElementById(id)
            input.focus()
            //an esc de tat chat
            const func = (e) => {
                if (e.key === 'Escape') dispatch(removeOpen(id))
                if (e.key === 'Enter') handleSubmit()
            }
            // click ra ngoai thi focus lost
            const func1 = (target) => {
                if (!input.parentNode.parentNode.parentNode.contains(target.target)) {
                    setFocus(false)
                    document.removeEventListener('click', func1)
                }
                else input.focus()
            }
            document.addEventListener('click', func1)
            document.addEventListener('keydown', func)
            
            return () => {document.removeEventListener('keydown', func); document.removeEventListener('click', func1);}
        }
    }, [isFocus, text])
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(id))
    return (
        <div onClick={() => setFocus(true)} className='color3 shadow' style={{width: '328px', height: '400px', borderRadius: '10px 10px 0 0',}}>
            <div style={{display: 'flex', justifyContent: 'space-between', borderRadius: '10px 10px 0 0', backgroundColor: isFocus ? '#00e2ff' : ''}}>
                <div className='canclick ' onClick={handleClick} style={{display: 'flex', width: '100%'}}> 
                    {/* avatar */}
                    <img className='circle0' src={user && user.avatarURL} style={{margin: '5px'}}/>   
                    {/* User name */}
                    <div style={{padding: '10px 0 10px 0'}}>
                        {user && user.name}
                    </div>
                </div>
                <div onClick={() => dispatch(removeOpen(id))} className="canclick circle0" style={{margin: '5px', display: 'flex', justifyContent: 'center'}}>
                    <GrClose style={{position: 'relative', top: '8px'}}/>
                </div>
            </div>
            <div style={{display: 'flex', height: '305px', flexDirection: 'column-reverse', overflow: 'auto'}}>
                {/* context here */}
                {messages &&  messages.map(data => <SingleChat data={data} key={v4()} client={client}/>)}
            </div>
            <div style={{height: '53px', display: 'flex'}}>
                <div style={{ display: 'flex', width: '100%'}}>
                    <GrAddCircle size='25' className='canclick' style={{margin: 'auto'}}/>
                    <GrGallery size='25' className='canclick' style={{margin: 'auto'}}/>
                    <BiSticker size='25' className='canclick' style={{margin: 'auto'}}/>
                    <RiFileGifLine size='25' className='canclick' style={{margin: 'auto'}}/>
                    <input id={id} onChange={({target}) => setText(target.value)} value={text} placeholder='Aa' style={{margin: 'auto', height: '35px', borderRadius: '20px'}}/>
                    <BiSend onClick={() => handleSubmit()} size='25' className='canclick' style={{margin: 'auto 10px auto auto'}}/>
                </div>
            </div>
        </div>
    )
}

function CollapseChat ({id}) {
    const [isHover, setHover] = useState(false)
    const dispatch = useDispatch()
    const [user] = useDocumentDataOnce(firestore.collection('users').doc(id))
    const handleClick = () => {
        dispatch(addOpen(id))
        dispatch(removeCollapse(id))
    }
    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div onClick={() => dispatch(removeCollapse(id))} className='canclick' style={{position: 'absolute', borderRadius: '100%', right: '6px', width: '25px', height: '25px', display: isHover ? 'flex' : 'none', color: 'blue', justifyContent: 'center'}}>
                <GrClose style={{position: 'relative', top: '5px'}}/>
            </div>
            <img onClick={() => dispatch(addOpen(id))} className='circle2 canclick' onClick={handleClick} src={user && user.avatarURL}/>
        </div>
    )
}

function SingleChat ({data, client}) {            // 1 dong chat trong message, data.createdBy la id nguoi gui
    return (
        <div style={{display: 'flex', margin: '5px', flexFlow: (client.id !== data.createdBy) ? '' : 'row-reverse'}}>     
            <div className='shadow' style={{padding: '10px 0', backgroundColor: (client.id === data.createdBy) ? 'lightgreen' : 'lightgray', borderRadius: '20px', maxWidth: '202px', overflow: 'hidden', overflowWrap: 'break-word', padding: '10px 15px'}}>{data.text}</div>
        </div>
    )
}