import React, { useEffect, useState } from 'react'
import { Link, Route, useParams, useRouteMatch } from 'react-router-dom'
import {useCollectionData, useDocumentData, useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {firestore} from '../../firebase'
import Tag from '../Tag'
import {FaUserFriends} from 'react-icons/fa'
import { RiUserReceivedFill, RiArrowRightSLine, RiUserAddFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { AddFriendButton } from '../Profile'

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
    const { path, url } = useRouteMatch()
    return(
        <div className='test' style={{}}>
            <div className='color3 test' style={{position: 'fixed', width: '300px', height: '100%', top: '50px', padding: '10px 5px'}}>
                <div style={{fontWeight: 'bolder', fontSize: '30px'}}>
                    Friends
                </div>
                <Link to={`${url}/friendrequest`}>
                    <div className={ useRouteMatch({path: `${url}/friendrequest`}) ? 'color5': 'canclick'} style={{display: 'flex', padding: '10px'}}>
                        <RiUserReceivedFill size='30' />
                        <div style={{margin: 'auto auto auto 15px'}}>Friend Requests</div>
                        <RiArrowRightSLine size='30'/>
                    </div>
                </Link>
                <Link to={`${url}/suggest`}>
                    <div className={ useRouteMatch({path: `${url}/suggest`}) ? 'color5': 'canclick'} style={{display: 'flex', padding: '10px'}}>
                        <RiUserAddFill size='30'/>
                        <div style={{margin: 'auto auto auto 15px'}}>Suggestion</div>
                        <RiArrowRightSLine size='30'/>
                    </div>
                </Link>
                <Link to={`${url}/allfriends`}>
                    <div className={ useRouteMatch({path: `${url}/allfriends`}) ? 'color5': 'canclick'} style={{display: 'flex', padding: '10px'}}>
                        <FaUserFriends size='30' />
                        <div style={{margin: 'auto auto auto 15px'}}>All Friends</div>
                        <RiArrowRightSLine size='30'/>
                    </div>
                </Link>
            </div>
            <div>
                <Route path={`${path}/:topic`}><List/></Route>
            </div>
        </div>
    )
}
function List () {
    const client = useSelector(state => state.firebase.profile)
    const {topic} = useParams()
    const [list, setList] = useState([])
    useEffect(() => {
        if (client.id) {
            switch (topic) {
                case 'friendrequest':
                    firestore.collection(`users/${client.id}/relationship`).where('relationship', '==', 'receive').get()
                    .then(docs => {
                        let array = []
                        docs.forEach(doc => array = array.concat(doc.id))
                        setList(array)
                    })
            }
        }
    }, [topic])
    return (
        <div className='color3' style={{ marginLeft: '300px'}}>
            {list && list.map(id => <SingleList id={id}/>)}
        </div>
    )
}

function SingleList ({id}) {
    const [user] = useDocumentDataOnce(firestore.doc(`users/${id}`))

    if (user) return (
        <div>
            <img src={user.avatarURL} style={{width: '168px', height: 'auto'}}/>
            <div style={{padding: '8px', width: '168px'}}>
                <Tag info={user} fontSize='20px'/>
                <AddFriendButton id={user.id} />
            </div>
        </div>
    )
    else return ''
}