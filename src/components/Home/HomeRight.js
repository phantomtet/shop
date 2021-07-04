import React, {useState, useEffect} from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { firestore } from '../../firebase'
import {useDispatch, useSelector} from 'react-redux'
import {addOpen, removeCollapse} from '../../actions/chatlistAction'
import {BiSearch, BiCameraHome, BiDotsHorizontalRounded} from 'react-icons/bi'
export default function HomeRight () {
    const client = useSelector(state => state.firebase.profile)
    const [friends, setFriends] = useState([])
    useEffect(() => {
        if (client.id) {
            // firestore.collection(`users/${client.id}/relationship`).where('relationship', '==', 'friends').limit(30).get()
            firestore.collection(`users`).get()
            .then(docs => {
                let array = []
                docs.forEach(doc => {
                    array = array.concat(doc.id)
                })
                setFriends(array)
            })
        }
    }, [client])
    return (
        <div className='color2 right collapse830' style={{position: 'fixed',top: 50, padding: '0px 5px 10px 5px', right: '0', width: '360px',  height: 'calc(100vh - 50px)', color: 'whitesmoke'}}>
           
            <div className='' style={{overflow: 'auto', height: '100%'}}>
                <div className='shadow' >
                    <div className='' style={{padding: '15px 10px 0px 10px', display: 'flex', justifyContent: 'space-between',}}>
                        <div>
                            Contacts
                        </div>
                        <div style={{bottom: '7px', position: 'relative'}}>
                            
                            <BiCameraHome className='canclick' style={{marginLeft: '10px'}} size='25'/>
                            <BiSearch className='canclick' style={{marginLeft: '10px'}} size='25'/>
                            <BiDotsHorizontalRounded className='canclick' style={{marginLeft: '10px'}} size='25'/>
                        </div>
                        
                    </div>
                    {friends && friends.map(data => <SingleContact client={client} key={data} data={data}/>)}

                </div>
            </div>
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
        <div onClick={handleClick} className='canclick' style={{display: 'flex', padding: '10px 5px', borderRadius: '10px'}}>
            <img src={user && user.avatarURL} className='circle0'/>
            <div style={{padding: '5px 0 5px 10px'}}>
                {user && user.name}
            </div>
        </div>
    )
}