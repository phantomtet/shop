import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {useCollectionData, useDocumentData} from 'react-firebase-hooks/firestore'
import {firestore} from '../../firebase'
import Tag from '../Tag'
import {FaUserFriends} from 'react-icons/fa'
export function FriendsButton () {
    return(
        <div className='canclick' style={{width: '100px', padding: '0 25px'}}>
           <Link to='/friends'>
               <FaUserFriends size='50'/>
           </Link>
        </div>
    )
}
export function Friends () {
    const [users] = useCollectionData(firestore.collection('users'))
    return(
        <div style={{display: 'flex'}}>
            {users && users.map(data => <Tag info={data} />)}
        </div>
    )
}