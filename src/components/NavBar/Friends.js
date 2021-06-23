import React, { useEffect, useState } from 'react'
import { Link, Route, useParams, useRouteMatch } from 'react-router-dom'
import {useCollectionData, useDocumentData} from 'react-firebase-hooks/firestore'
import {firestore} from '../../firebase'
import Tag from '../Tag'
import {FaUserFriends} from 'react-icons/fa'
import { RiUserReceivedFill, RiArrowRightSLine, RiUserAddFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'

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
        <div style={{display: 'flex', height: '100%'}}>
            <div className='color3' style={{position: 'sticky', height: '100%', paddingBottom: '100%', left: 0, width: '300px', top: '50px', padding: '10px 5px'}}>
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
        <div className='color3' style={{height: '2000px'}}>
            a
        </div>
    )
}