import React, { useEffect, useState } from 'react'
import { Link, Route, useParams, useRouteMatch } from 'react-router-dom'
import {useCollectionData, useDocumentData, useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {firestore} from '../../firebase'
import Tag from '../Tag'
import {FaUserFriends} from 'react-icons/fa'
import { RiUserReceivedFill, RiArrowRightSLine, RiUserAddFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { AddFriendButton } from '../Profile'
import Profile from '../Profile'

export function FriendsButton () {
    return(
        <Link to='/friends' className='canclick' style={{width: '100px', padding: '0 25px'}}>
            <FaUserFriends size='50' color= { useRouteMatch({path: '/friends', }) && '#00ccff'}/>
        </Link>
    )
}
export function Friends () {
    const { path, url } = useRouteMatch()
    return(
        <div style={{display: 'flex', minHeight: '100%'}}>
            <div style={{}}>
                <div className='color3 shadow' style={{position: 'sticky', minWidth: '300px', height: '30vh' - '50px', top: '50px', padding: '10px 5px'}}>
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
                    <div style={{overflow: 'auto', height: '70vh', position: 'sticky'}}>
                    <Route path={`${path}/:topic`}><List/></Route>
                    </div>
                </div>
            </div>
            <div style={{marginLeft: '', width: '100%'}} className=''>
                <Route path={`${path}/:topic/:id`}><Profile/></Route>
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
                    return
                case 'suggest': 
                    let randomUsers = []
                    let relationshipUsers = []
                    firestore.collection(`users`).limit(10).get()
                    .then(docs => {
                        docs.forEach(doc => randomUsers = randomUsers.concat(doc.id))
                        firestore.collection(`users/${client.id}/relationship`).where('id', 'in', randomUsers).where('relationship', '!=', '').get()
                        .then(docs => {
                            docs.forEach(doc => relationshipUsers = relationshipUsers.concat(doc.id))
                            setList(randomUsers.filter(id => !relationshipUsers.includes(id)))
                        })
                    })

                    return
                case 'allfriends':

            }
        }
    }, [topic, client])
    return (
        <div className='color3' style={{}}>
            {list && list.map(id => <SingleList key={id} id={id}/>)}
        </div>
    )
}

function SingleList ({id}) {
    const [user] = useDocumentDataOnce(firestore.doc(`users/${id}`))
    const { path, url } = useRouteMatch()
    if (user) return (
        <Link to={`${url}/${id}`}>
            <div className='canclick' style={{display: 'flex', padding: '10px'}}>
                <img src={user.avatarURL} className='circle2'/>
                <div  style={{width: '100%', margin: 'auto 0', padding: '0 12px'}}>
                    {user.name}
                    <AddFriendButton id={user.id}/>
                </div>
            </div>
        </Link>
    )
    else return ''
}

