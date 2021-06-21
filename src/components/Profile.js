import React, { useEffect, useState } from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import firebase, {auth, firestore, storage} from '../firebase'
import {useCollectionData, useCollectionDataOnce, useDocumentData, useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {BsThreeDots} from 'react-icons/bs'
import {addOpen, removeCollapse} from '../actions/chatlistAction'
import {BsFillPersonCheckFill, BsXOctagon} from 'react-icons/bs'
import { SinglePost } from './Home/HomeMid'
import Tag from './Tag'
export  default function Profile () {
    const { id } = useParams()
    const [opponents] = useDocumentDataOnce(firestore.collection('users').doc(id))
    const {path, url} = useRouteMatch()
    const [friends] = useCollectionData(firestore.collection(`users/${id}/relationship`).where('relationship', '==', 'friends'))
    if (opponents)
    return ( 
        <div>
            <div style={{display: 'flex', justifyContent: 'center', position: 'relative',}}>
                {/* background image */}
                <img src='https://img.freepik.com/free-vector/abstract-banner-background-with-red-shapes_1361-3348.jpg?size=626&ext=jpg' style={{width: '960px', maxHeight: '348px', maxWidth: '100%'}}/>
                <div style={{position: 'absolute', left: '50%', top: '90%', transform: 'translate(-50%, -50%)',}}>
                    <img style={{display: 'block', margin: 'auto auto auto auto'}} className='circle3' src={opponents.avatarURL}/>       
                    <p style={{textAlign: 'center', fontSize: '32px',}}>{opponents.name}</p>
                </div>
            </div>
            <div style={{paddingTop: '100px'}}></div>
            <div style={{position: 'sticky', top: '50px', display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '960px', borderTop: '1px solid gray'}}>
                    <div style={{display: 'flex'}}>
                        <Link to={`${url}`}>
                            <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                Posts
                            </div>
                        </Link>
                        <Link to ={`${url}/about`}>
                            <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                About
                            </div>
                        </Link>
                        <Link to={`${url}/friends`}>
                            <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                <div style={{marginRight: '5px'}}>Friends</div>
                                <div>
                                    {friends && <div>{friends.length}</div>}
                                </div>
                            </div>
                        </Link>
                        <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Photos
                        </div>
                        <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Videos
                        </div>
                    </div>
                    <div classNameName='test' style={{width: '300px', display: 'flex', paddingTop: '15px'}}>
                        <AddFriendButton id={id} />
                        <MessageButton id={id}/>
                        <AdvanceOptions/>
                    </div>
                </div>
            </div>
            <div className='test2' style={{width: '945px', margin: 'auto'}}>
                <Switch>
                    <Route exact path={`${url}`}>
                        <Posts opponents={opponents} friends={friends}/>
                    </Route>
                    <Route path={`${url}/about`}>
                        Under construction
                    </Route>
                    <Route path={`${url}/friends`}>
                        <FriendList opponents={opponents}/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
    else return "This Page Isn't Available"
}
function Posts ({opponents, friends}) {
    const [posts] = useCollectionData(firestore.collection(`posts`).where('relateTo', 'array-contains', opponents.id))
    const [postsWithPhoto] = useCollectionDataOnce(firestore.collection(`posts`).orderBy('fileURL').orderBy('createdAt', 'desc').where('relateTo', 'array-contains', opponents.id).where('fileURL', '!=', '').limit(9))
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>    
            <div className='test' style={{width: '400px', marginTop: '15px'}}>      
                <div style={{padding: '0 16px 0 16px', backgroundColor: 'lightgray', marginBottom: '15px'}} >  
                    <div style={{fontWeight: 'bold', padding: '20px 0 4px'}}>Intro</div>
                    <div>{opponents.intro ? opponents.intro : 'No information given'}</div>
                </div>
                <div style={{padding: '0 16px 0 16px', backgroundColor: 'lightgray', marginBottom: '15px', }}>  
                    <div style={{fontWeight: 'bold', padding: '20px 0 4px'}}>Photos</div>
                    <div style={{display: 'grid', gridTemplateColumns: 'auto auto auto', gridRowGap: '5px'}}>{postsWithPhoto && postsWithPhoto.map(data => data.fileURL && <Link to={`/${data.path}`}><img key={data.id} src={data.fileURL} style={{objectFit: 'cover', minWidth: '30%', width: '100px', height: '100px', margin: 'auto'}}/></Link>)}</div>
                </div>
                <div style={{padding: '16px', backgroundColor: 'lightgray', marginBottom: '15px'}}>  
                    <div style={{fontWeight: 'bold'}}>Friends</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        {friends && friends.map(val => <SingleFriend key={val.id} id={val.id}/>)}
                    </div>
                </div>
            </div>
            {/* owner posts */}
            <div className='test' style={{width: '545px', margin: '15px 0 0 15px'}}>                   {/*right div */}              
                {posts && posts.map(data => <SinglePost key={data.id} data={data}/>)}
            </div>
        </div>
    )
}
function SingleFriend ({id}) {
    const [user] = useDocumentData(firestore.collection('users').doc(id))
    return (
        <div className='canclick3 test' style={{width: '30%', height: 'auto'}}>
            <Link to={'/profile/' + id}>
                <img style={{maxWidth: '100%', height: 'auto'}} src={user && user.avatarURL}/>
                <div style={{maxWidth: '100%', overflow: 'hidden'}}>
                    {user && user.name}
                </div>
            </Link>
        </div>
    )
}
function SingleFriend2 ({id}) {
    const [user] = useDocumentData(firestore.collection('users').doc(id))
    return (
        <div style={{display: 'flex', minWidth: '50%', margin: '10px 0'}}>
            <img src={user && user.avatarURL}/>
            <div>
                {user && <Tag info={user}/>}
                {user && <AddFriendButton id={user.id}/>}
            </div>
        </div>
    )
}


function FriendList ({opponents}) {
    const [tab, setTab] = useState('all')
    const [list, setList] = useState([])
    useEffect(() => {
        setList([])
        const ref = firestore.collection(`users/${opponents.id}/relationship`)
        switch (tab) {
            case 'all': ref.where('relationship', '==', 'friends').get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc]))); return
            case 'recent': ref.where('relationship', '==', 'friends').where('friendSince', '>=', Date.now()-2592000000).get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc]))); return
            case 'birthday': return
            case 'following': ref.where('follow', '==', true).where('relationship', '!=', 'friends').get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc])))
        }
    }, [tab])
    return (
        <div className='color3' style={{padding: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{fontWeight: 'bold', fontSize: '25px',}}>
                    Friends
                </div>
                <div style={{padding: '5px', display: 'flex', justifyItems: 'center'}}>
                    <input placeholder='Search' style={{width: '216px', height: '36px', marginRight: '15px', borderRadius: '25px'}}/>
                    <div className='canclick color4' style={{borderRadius: '5px', marginTop: 0}}>
                    <BsThreeDots  size='36' />
                    </div>
                </div>
            </div>
            {/* Query type */}
            <div style={{display: 'flex', height: '60px', justifyItems: 'center', marginBottom: '20px'}}>
                <div onClick={() => setTab('all')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'all' ? '3px solid #c4dfe6' : '', color: tab === 'all' ? '#c4dfe6' : ''}}>
                    All Friends
                </div>
                <div onClick={() => setTab('recent')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'recent' ? '3px solid #c4dfe6' : '', color: tab === 'recent' ? '#c4dfe6' : ''}}>
                    Recently Added
                </div>
                <div className='cantclick' title='You need to be VIP member to use this' style={{padding: '18px 10px', borderBottom: tab === 'birthday' ? '3px solid #c4dfe6' : '', color: tab === 'birthday' ? '#c4dfe6' : ''}}>
                    Birthdays
                </div>
                <div onClick={() => setTab('following')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'following' ? '3px solid #c4dfe6' : '', color: tab === 'following' ? '#c4dfe6' : ''}}>
                    Following
                </div>
            </div>
            {/* list here */}
            <div style={{display: 'flex', flexWrap: 'wrap', overflow: 'auto', }}>
                {list && list.map(data => <SingleFriend2 key={data.id} id={data.id}/>)}
            </div>
        </div>
    )
}

export function AddFriendButton (props) {
    const client = useSelector(state => state.firebase.profile)
    const [relation] = useDocumentData(firestore.doc(`users/${client.id}/relationship/${props.id}`))
    const [relationship, setRelationship] = useState('')
    useEffect(() => {
        if (relation) {
            setRelationship(relation.relationship)
        }   
    }, [relation])
    const sentfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: true, relationship: 'sent', id: props.id}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: 'receive', id: client.id}, {merge: true})
        //trigger a notify
        
    }
    const cancelfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: false, relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: ''}, {merge: true})
    }
    const declinefriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: ''}, {merge: true})
    }
    const acceptfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: true, relationship: 'friends', friendSince: Date.now()}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({follow: true, relationship: 'friends', friendSince: Date.now()}, {merge: true})
    }
    const removeFriend = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: false, relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({follow: false, relationship: ''}, {merge: true})

    }
    switch (relationship) {
    case '': 
        return (
            <div onClick={sentfriendrequest} className='canclick color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', minWidth: '140px', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://cdn0.iconfinder.com/data/icons/social-media-glyph-1/64/Facebook_Social_Media_User_Interface-35-512.png'/>
                <p>Add Friend</p>
            </div>
        )
    case 'friends': 
        return (
            <div className='color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px'}}>
                <BsFillPersonCheckFill size='18' style={{margin: 'auto 10px auto auto'}}/>
                <p>Friends</p>
                <BsXOctagon onClick={removeFriend} size='15' className='canclick' style={{margin: 'auto 0 auto auto'}} title='Remove this friend'/>
            </div>
        )
    case 'sent':
        return (
            <div onClick={cancelfriendrequest} className='canclick color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px', fontSize: '16px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://cdn2.iconfinder.com/data/icons/user-management/512/cancel-512.png'/>
                <p>Cancel Request</p>
            </div>
        )
    case 'receive':
        return (
            <div style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', borderRadius: '10px'}}>
                <div onClick={acceptfriendrequest} className='canclick color4' style={{display: 'flex', marginRight: '10px', height: '36px', justifyContent: 'center', padding: '7px', borderRadius: '10px'}}>
                    <p>Accept</p>
                </div>
                <div onClick={declinefriendrequest} className='canclick color4' style={{display: 'flex', marginRight: '10px', height: '36px', justifyContent: 'center', padding: '7px', borderRadius: '10px'}}>
                    <p>Decline</p>
                </div>
            </div>
        )
    default:
        return '' 
    }
}

export function MessageButton ({id}) {
    const dispatch = useDispatch()
    const chatlist = useSelector(state => state.chatlist)
    const handleClick = () => {
        if (chatlist.open && chatlist.open.includes(id)) return
        dispatch(addOpen(id))
        if (chatlist.collapse && chatlist.collapse.includes(id)) dispatch(removeCollapse(id))
    }
    return (
        <div onClick={handleClick} className='canclick color4' style={{justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px', margin: '0 4px'}}>
            <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://i.pinimg.com/originals/7b/7b/c6/7b7bc658d3fce83780679e84dc62f2fa.png'/>
            <p>Message</p>
        </div>
    )
}
export function AdvanceOptions () {
    return (
        <div className='circle1 canclick color4' style={{margin: '0 4px'}}>
            <BsThreeDots size='30' style={{margin: '4px'}} />
        </div>
    )
}
